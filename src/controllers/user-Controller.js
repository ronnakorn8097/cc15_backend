const prisma = require('../models/prisma');
const { upload } = require('../utils/cloudinary-service');
const createError = require('../utils/create-error');
const {checkUserSchema} = require('../validators/user-Validator')



////////////// update user ///////////////////
exports.updateUser = async(req,res,next)=>{
    try {
        const {value , error} = checkUserSchema.validate(req.body)

        if(req.file)
        {
            value.userImage = await upload(req.file.path)
        }

        if(error)
        {
            return next(createError("cannot update user", 400));
        }

        const updateUser = await prisma.users.update({
            where : {
                id : value.id
            },
            data : {
                username : value?.username,
                password : value?.password,
                firstName : value?.firstName,
                lastName : value?.lastName,
                status : value?.status,
                userImage : value?.userImage,
                role : value?.role
            }
        });

        if(!updateUser)
        {
            return next(createError('ID not found',404))
        }

        delete updateUser.password
        res.status(200).json({ nessage: "update user successed", updateUser });

    } catch (error) {
        next(error)
    }
}

//////////////// get users /////////////////////
exports.getUsers = async (req,res,next)=>{
    try {
        const getAllUsers = await prisma.users.findMany();

        ////// delete password from user before send data to client ///////
        const userWithoutPassword = getAllUsers.map(pass=>{
            const {password,...userWithoutPassword} = pass;
            return userWithoutPassword;
        });
        
        res.status(200).json({userWithoutPassword})
    } catch (error) {
        next(error)
    }
}


