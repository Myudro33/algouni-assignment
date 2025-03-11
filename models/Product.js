import mongoose from "mongoose"

const productSchema= new mongoose.Schema({
    id:{type:Number,required:true,unique:true},
    name:{type:String,required:true},
    price:{type:Number,required:true},
    description:{type:String,required:true},
    stock:{type:Number,required:true},
    slug:{type:String},
    createdAt:{type:Date,default:Date.now}

})
productSchema.pre('findOneAndDelete',async function(next){
    const product = await this.model.findOne(this.getQuery())
    if(product.stock>0){
      return next(new Error('Product cant be deleted'))
    }
    next()
    
})


export default mongoose.model('Product',productSchema)