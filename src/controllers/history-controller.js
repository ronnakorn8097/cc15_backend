const prisma = require('../models/prisma');
const createError = require('../utils/create-error')



//////////////////////// Get Menu ////////////////////////  
exports.getHistory = async(req,res,next)=>{
    try {
        const getHistory = await prisma.orders.findMany({
           
                include: {
                    orderMenus: {
                      include: {
                        menus: true
                      }
                    },
                    users: {
                        select : {
                            firstName : true
                        }
                    }
                  }
                    
        });
        if(!getHistory)
        {
            return next(createError('Get History failed',404))
        }
        res.status(200).json({getHistory})
    } catch (error) {
        next(error)
    }
}