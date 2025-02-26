import express from 'express'
import morgan from 'morgan';
import productRouter from './Routes/productRoute.js';
import userRouter from './Routes/userRoute.js';
import dotenv from 'dotenv'
import productMiddleware from './Middlewares/SlugifyMiddleware.js'
import maintenanceMiddleware from './Middlewares/MaintenanceMiddleware.js';
import globalRateLimiter from './Middlewares/RequestLimitMiddleware.js';

dotenv.config({path:"./config.env"})

const app = express();
app.use(express.json())
app.use(productMiddleware)
app.use(maintenanceMiddleware)
app.use(globalRateLimiter)
if(process.env.NODE_ENV==='development'){
    app.use(morgan('combined'))
}



app.use('/products',productRouter)
app.use('/users',userRouter)




app.listen(process.env.PORT)