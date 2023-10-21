const prisma = require("../models/prisma");
const { upload } = require("../utils/cloudinary-service");
const createError = require("../utils/create-error");
const { checkUserSchema, checkUserForDelete } = require("../validators/user-Validator");
const fs = require('fs/promises')

////////////// update user ///////////////////
exports.updateUser = async (req, res, next) => {
  try {
    const { value, error } = checkUserSchema.validate(req.body);
    
    if (req.file) {
      // value.userImage = await upload(req.file.path)
     
       value.userImage = await upload(req.file.path);
    
    }
    if (error) {
     
      return next(createError("cannot update user", 400));
    }

    const updateUser = await prisma.users.update({
      where: {
        id: value.id,
      },
      data: {
        username: value?.username,
        password: value?.password,
        firstName: value?.firstName,
        lastName: value?.lastName,
        status: value?.status,
        userImage: value?.userImage,
        role: value?.role,
      },
    });

    if (!updateUser) {
      return next(createError("ID not found", 404));
    }

    // delete updateUser.password;
    res.status(200).json({ nessage: "update user successed", updateUser });
  } catch (error) {
    next(error);
  }finally{
    if(req.file)
    {
        fs.unlink(req.file.path)
    }
  }
};

//////////////// get users /////////////////////
exports.getUsers = async (req, res, next) => {
  try {
    const getAllUsers = await prisma.users.findMany();

    ////// delete password from user before send data to client ///////
    const userWithoutPassword = getAllUsers.map((pass) => {
      const { password, ...userWithoutPassword } = pass;
      return userWithoutPassword;
    });

    res.status(200).json({ userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

//////////////// get userById /////////////////////
exports.getUserById = async (req, res, next) => {
  try {
    const data = req.params.userId;
    console.log(data);
    const getUserById = await prisma.users.findFirst({
      where: {
        id: +data,
      },
    });
    delete getUserById.password;
    res.status(200).json({ getUserById });
  } catch (error) {
    next(error);
  }
};

//////////////// Delete users /////////////////////
exports.deleteUser = async (req,res,next) =>{
try {
         req.params.deleteUser =  +req.params.deleteUser
         const {value,error} = checkUserForDelete.validate(req.params);

         if(error)
         {
          return next(createError("can not delete user", 400));
         }

         ///////////  check ว่ามีเมนูนี้ เคยมีการสั่งยัง ///////////
         const isExistData = await prisma.orders.findFirst({
          where : {
            userId : value.deleteUser
          }
         });

         if(isExistData)
         {
          return next(createError('This User already in use',400))
         }

         await prisma.users.delete({
          where : {
            id : value.deleteUser
          }
         })
         res.status(200).json({ message: "Delete Success" });
} catch (error) {
  next(error)
}
}
