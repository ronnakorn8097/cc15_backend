const createError = require('../utils/create-error');
const jwt = require('jsonwebtoken');
const prisma = require('../models/prisma')


// middleware จัดการ เกี่ยวกับ authen token 

module.exports = async (req,res,next)=>{
    try {
        // check token จาก req.headers
        const authorization = req.headers.authorization;
     
        
        // ถ้าใน req.heads.authorization ไม่มีค่า
        if(!authorization || !authorization.startsWith(`Bearer `))
        {

            return next(createError('Unauthorized',401))
        }

        // ถ้า authorization มีค่า
        // index[0] is bearer
        // index[1] is accessToken
        const token = authorization.split(' ')[1]
        
        // เอา token มา verify เพื่อหาค่า key userId จาก การที่เราสร้างไว้ใน autjen-controller
        const payload = jwt.verify(token,process.env.JWT_SECRET_KEY || "qwerasdf")

        const user = await prisma.users.findUnique({
            where : {
                id : payload.userId
            }
        });

        // ถ้าไม่เจอ user จากการ หาใน db
        if(!user)
        {
            return next(createError('Unauthorized',401))
        }

        delete user.password;
        
        // นำ user ที่หามาจาก db นำไปใส่ไว้ใน req.user เพื่อให้เราเข้าถึงมันได้
        req.user = user;
        next();

    } catch (error) {
        next(error)
    }
}