import mongoose from "mongoose"
import StockHistory from "./StockHistory.js"

const productSchema= new mongoose.Schema({
    id:{type:Number,required:true,unique:true},
    name:{type:String,required:true},
    price:{type:Number,required:true},
    description:{type:String,required:true},
    stock:{type:Number,required:true},
    slug:{type:String},
    createdAt:{type:Date,default:Date.now},
    archived:{type:Boolean,default:false}
}
,
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
},
)
productSchema.pre('findOneAndDelete',async function(next){
    const product = await this.model.findOne(this.getQuery())
    if(product.stock>0){
      return next(new Error('Product cant be deleted'))
    }
    next()
    
})

productSchema.post('save',function(doc){
    console.log('product saved',doc);
    
})

productSchema.virtual('status').get(function(){
    return this.stock>0?'Avaliable':"Not Avaliable"
})

productSchema.virtual('priceWithTax').get(function(){
    return this.price+(this.price*0.20)
})

productSchema.virtual('capacity').get(function(){
    return this.price*this.stock
})

productSchema.statics.deleteOne = async function (filter) {
    return this.updateOne(filter, { archived: true });
  };

productSchema.pre("findOneAndUpdate", async function (next) {
    const updatedProduct = await this.model.findOne(this.getQuery());
    const newStock = this.getUpdate().stock; 
    
    if (updatedProduct && newStock !== undefined && updatedProduct.stock !== newStock) {
      await StockHistory.create({
        productId: updatedProduct._id,
        oldStock: updatedProduct.stock,
        newStock: newStock
      });
      console.log("Stock change logged:", {
        productId: updatedProduct._id,
        oldStock: updatedProduct.stock,
        newStock: newStock
      });
    }
    next();
  });

export default mongoose.model('Product',productSchema)