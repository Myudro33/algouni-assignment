import express from 'express'
import { getProducts,updateProduct,deleteProduct,buyProduct,createProduct } from '../Controllers/ProductController.js';


const productRouter = express.Router()

productRouter.route('').get(getProducts).post(createProduct)
productRouter.route('/:id').put(updateProduct).delete(deleteProduct)
productRouter.route('/buy/:id').post(buyProduct)

export default productRouter
