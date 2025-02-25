import express from 'express'
import morgan from 'morgan';
import productRouter from './Routes/productRoute.js';
import userRouter from './Routes/userRoute.js';

const app = express();
app.use(express.json())
app.use(morgan('dev'))
app.use((req,res,next)=>{
    console.log('test');
    next()
})


app.use('/products',productRouter)
app.use('/users',userRouter)




app.listen(3000)