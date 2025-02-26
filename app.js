import express from 'express'
import morgan from 'morgan';
import productRouter from './Routes/productRoute.js';
import userRouter from './Routes/userRoute.js';
import dotenv from 'dotenv'

dotenv.config({path:"./config.env"})

const app = express();

app.use(express.json())
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}
app.use((req,res,next)=>{
    next()
})


app.use('/products',productRouter)
app.use('/users',userRouter)




app.listen(3000)