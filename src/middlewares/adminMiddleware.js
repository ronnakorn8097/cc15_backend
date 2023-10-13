

const createError = require('../utils/create-error');

module.exports = async (req,res,next) =>{
    try {
     const user = req.user
     
    
     if(user.role !== "ADMIN")
     {
       
        return next(createError('Permission deny, You are not admin',403))
     }
     next();
    } catch (error) {
        next(error)
    }
}