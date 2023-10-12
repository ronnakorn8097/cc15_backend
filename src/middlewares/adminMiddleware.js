

const createError = require('../utils/create-error');

module.exports = async (req,res,next) =>{
    try {
     const user = req.user
     
    
     if(user.role !== "ADMIN")
     {
       
        return next(createError('Unauthorized ,You are not admin',401))
     }
     next();
    } catch (error) {
        next(error)
    }
}