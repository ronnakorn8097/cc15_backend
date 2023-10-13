const { STATUS_AVAILIABLE, STATUS_UNAVAILABLE } = require("../config/constant");
const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const {
  checkMenuIdSchema,
  checkMenuIdForDelete,
} = require("../validators/menu-Validator");

/////////////////   create  ////////////////
exports.menuCreate = async (req, res, next) => {
  try {
    const menu = req.body;

    if (!menu) {
      return next(createError("cannot create menu", 400));
    }

    const newMenu = await prisma.menus.create({
      data: menu,
    });
    res.status(200).json({ message: "Success create menu", newMenu });
  } catch (error) {
    next(error)
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
  }
};

/////////////////  delete  ////////////////
exports.deleteMenu = async (req, res, next) => {
  try {
    req.params.deleteMenu = +req.params.deleteMenu;

    const { value, error } = checkMenuIdForDelete.validate(req.params);

    console.log(error);
    if (error) {
      return next(createError("can not delete menu", 400));
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

    const response = {
      message: "Get all menu success",
      data: {
        user,
        menus: getAllMenu,
      },
    };
    res.status(200).json({ response });
  } catch (error) {
    next(error);
  }
};



