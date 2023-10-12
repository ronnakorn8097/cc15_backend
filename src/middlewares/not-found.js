
// middleware ตัวนี้ จัดการ error ของ req user ส่งค่าผิดมา
module.exports = (req,res,next) =>{
    next();
    res.status(404).json({message : 'Resource not found on this server'})
}