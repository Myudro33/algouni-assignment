import express from 'express'
import { getProducts,updateProduct,deleteProduct,buyProduct,createProduct } from '../controllers/ProductController.js';
import SlugifyMiddleware from '../middlewares/SlugifyMiddleware.js'


const productRouter = express.Router()

productRouter.route('').get(getProducts).post(SlugifyMiddleware,createProduct)
productRouter.route('/:id').put(updateProduct).delete(deleteProduct)
productRouter.route('/buy/:id').post(buyProduct)

export default productRouter
