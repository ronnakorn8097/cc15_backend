
const prisma = require('../models/prisma');
const createError = require('../utils/create-error');


exports.createOrder = async (req,res,next) => {
    try {
        const order = req.body
        await prisma.orderMenu.create({
       
        })
    } catch (error) {
        next(error)
    }
}



