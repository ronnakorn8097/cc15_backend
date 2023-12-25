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

           const getHistoryWithOutVoid = getHistory.filter(el=> el.status !== "VOID")
        
        // console.log(getHistory)
        // getHistoryWithOutVoid show list ที่ไม่รวม status void
        // getHistory เอาไปใช้เป็น order no ความยาวของ array = order no
        res.status(200).json({getHistoryWithOutVoid,getHistory})
    } catch (error) {
        next(error)
    }
}