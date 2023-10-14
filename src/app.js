require('dotenv').config();
const express = require('express');
const cors = require('cors');
// import cors from 'cors'
const morgan = require('morgan')

const authenRoute = require('./routes/authenRoute');
const menuRoute = require('./routes/menuRoute');
const userRoute = require('./routes/userRoute');
const orderRoute = require('./routes/orderRoute');
const historyRoute = require('./routes/historyRoute')

const notFoundMiddleware = require('./middlewares/not-found');
const errorMiddleware = require('./middlewares/error');

const app = express();

app.use(cors()) // ให้ port สามารถคุยข้ามกันไปมาได้ 
app.use(morgan('combined'))
app.use(express.json()) // convert req.body to js objetc // ให้อ่าน req.body ได้

app.use('/api/auths',authenRoute);
app.use('/api/menus',menuRoute);
app.use('/api/users',userRoute)
app.use('/api/orders',orderRoute);
app.use('/api/history',historyRoute)

app.use(notFoundMiddleware);
app.use(errorMiddleware);


// สร้าง server
const PORT = process.env.PORT || 1001;
app.listen(PORT,()=>{
    console.log('Server is running Port',PORT)
});