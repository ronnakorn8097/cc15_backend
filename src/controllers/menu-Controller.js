const { STATUS_AVAILIABLE, STATUS_UNAVAILABLE } = require("../config/constant");
const prisma = require("../models/prisma");
const {upload} = require('../utils/cloudinary-service')
const fs = require('fs/promises')
const createError = require("../utils/create-error");
const {
  checkMenuIdSchema,
  checkMenuIdForDelete,
} = require("../validators/menu-Validator");

/////////////////   create  ////////////////
exports.menuCreate = async (req, res, next) => {
  try {
  
    const menu = req.body;

  
    // ถ้าไฟล์รูปมีการส่งเข้ามา
    if(req.file)
    {
      menu.menuImage = await upload(req.file.path);
    }
 

    if (!menu) {
      return next(createError("cannot create menu", 400));
    }

    const newMenu = await prisma.menus.create({
      data: menu,
    });
    res.status(200).json({ message: "Success create menu", newMenu });
  } catch (error) {
    next(error)
  }finally{
    // ลบ รูปออกจาก public
    if(req.file)
    {
      fs.unlink(req.file.path)
    }
  }
};

/////////////////   update  ////////////////
exports.updateMenus = async (req, res, next) => {
  try {
   
    const { value, error } = checkMenuIdSchema.validate(req.body);
    // const updateMenu = req.body
   
    if (error) {
      return next(createError("cannot update menu", 400));
    }

    if(req.file)
    {
      value.menuImage = await upload(req.file.path);
    }

    const updateMenu = await prisma.menus.update({
      where: {
        id: value.id,
      },
      data: {
        name: value?.name,
        detail: value?.detail,
        status: value?.status,
        price: value?.price,
        menuImage: value?.menuImage,
      },
    });
    res.status(200).json({ nessage: "update menu successed", updateMenu });
  } catch (error) {
    next(error);
  }finally{
    if(req.file){
      fs.unlink(req.file.path)
    }
  }
};

/////////////////  delete  ////////////////
exports.deleteMenu = async (req, res, next) => {
  try {
    req.params.deleteMenu = +req.params.deleteMenu;
    console.log(req.params.deleteMenu)
    const { value, error } = checkMenuIdForDelete.validate(req.params);

    
    if (error) {
      return next(createError("can not delete menu", 400));
    }

    const isExistData = await prisma.orderMenu.findFirst({
      where : {
        menuId : value.deleteMenu
      }
    })

    if(isExistData)
    {
      return next(createError('This Menu already in use',400))
    }

    await prisma.menus.delete({
      where: {
        id: value.deleteMenu,
      },
    });
    res.status(200).json({ message: "Delete Success" });
  } catch (error) {
    next(error);
  }
};

//////////////////  GET MENU ////////////

exports.getMenus = async (req,res,next) => {
  try {
    let getAllMenu = await prisma.menus.findMany();
    if (req.user.role === "STAFF")
      getAllMenu = getAllMenu.filter((e) => e.status === "AVAILIABLE");

    const user = {
      role: req.user.role,
    };


    res.status(201).json({ user,getAllMenu });
  } catch (error) {
    next(error);
  }
};

//////////////////  GET MENU BY ID ////////////
exports.getMenuById = async (req,res,next) => {
  try {
         const data = req.params.menuId
         console.log('data',data)
         const getMenuId = await prisma.menus.findFirst({
          where : {
            id : +data
          }
         })
         res.status(201).json({ getMenuId });

  } catch (error) {
    console.log(error)
    next(error)
  }
}



