import express from 'express'
import morgan from 'morgan';
import productRouter from './routes/productRoute.js';
import userRouter from './routes/userRoute.js';
import dotenv from 'dotenv'
import maintenanceMiddleware from './middlewares/MaintenanceMiddleware.js';
import globalRateLimiter from './middlewares/RequestLimitMiddleware.js';

dotenv.config({path:"./config.env"})

const app = express();
app.use(express.json())
app.use(maintenanceMiddleware)
app.use(globalRateLimiter)
if(process.env.NODE_ENV==='development'){
    app.use(morgan('combined'))
}



app.use('/products',productRouter)
app.use('/users',userRouter)




app.listen(process.env.PORT)