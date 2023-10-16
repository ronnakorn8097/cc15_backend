const { registerSchema, loginSchema } = require("../validators/authenValidator");
const bcrypt = require("bcryptjs");
const prisma = require("../models/prisma");
const jwt = require('jsonwebtoken')
const createError = require('../utils/create-error');
const {upload} = require('../utils/cloudinary-service')

/////////////////////////// Register //////////////////////////
exports.register = async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    if(req.file)
    {
        value.userImage = await upload(req.file.path)
    }

    const isExistUsername = await prisma.users.findUnique({
        where : {
            username : req.body.username
        }
    });
    if(isExistUsername)
    {
        return next(createError("Username already in use",400))
    }

    // ทำการ bcrypt password ที่ได้มาจาก value
    value.password = await bcrypt.hash(value.password, 10);

    const user = await prisma.users.create({
      data: value,
    });

    const payload = {userId : user.id}
    const accessToken = jwt.sign(payload,process.env.JWT_SECRET_KEY || 'qwerasdf',
    {expiresIn:process.env.JWT_EXPIRE})

    delete user.password
    res.status(201).json({ message: "Create user success", results: {
        accessToken: accessToken,user,
        user
    }}); // res to client

  } catch (error) {
    console.log(error);
    next(error);
  }
};


/////////////////////////// Login //////////////////////////

exports.login = async (req,res,next)=>{
    try {
        console.log(req.body)
        const {value , error} = loginSchema.validate(req.body)
        if(error)
        {
            return next(createError("Unauthorized",401))
        }
        //  หา username ใน database
        const user = await prisma.users.findFirst({
            where : {
                username : value.username
            }
        });

        // ถ้าไม่มี username ใน database
        if(!user)
        {
           return next(createError("Username not found",404))
        }

        // ถ้ามี user ให้ compare password ที่เขากรอกมา
        const passwordMatch = await bcrypt.compare(value.password,user.password)
        // ถ้า password ไม่ถูกต้อง
        if(!passwordMatch)
        {
            return next(createError("Unauthorized",401))
        }

        //ถ้า password match
        const payload = {userId : user.id}
        const accessToken = jwt.sign(
            payload,process.env.JWT_SECRET_KEY || 'qwerasdf',
            {expiresIn : process.env.JWT_EXPIRE }
        )
        delete user.password
        if (user.status !== "AVAILIABLE") return next(createError("Permission deny", 403))

        res.status(200).json({accessToken,user})
    } catch (error) {
        next(error)
    }
}
