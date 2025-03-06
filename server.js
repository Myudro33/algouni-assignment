import app from "./app.js";
import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL).then(()=>{
    console.log('mongodb connected');
}).catch((err)=>{
    console.log('error',err.message);
})

app.listen(process.env.PORT)