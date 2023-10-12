const joi = require('joi')

exports.registerSchema = joi.object({
    username : joi.string().trim().required(),
    firstName : joi.string().trim(),
    lastName : joi.string().trim(),
    password : joi.string().pattern(/^[a-zA-Z0-9]{6,30}/) // password ต้องมีอย่างน้อย 6 ตัว และไม่เกิน 30
    .trim()
    .required(),
    confirmpassword : joi.string().valid(joi.ref("password")).trim().required().strip(),
    role : joi.string().trim()

})

exports.loginSchema = joi.object({
    username : joi.string().required(),
    password : joi.string().required()

})



// check user ที่ซ้ำกัน
// //const existUser = await prisma.users.findUnique ({
// //     where : {
// //         username : // req.body.username
// //     }
// })