import express from 'express'
import { getProducts,updateProduct,deleteProduct,buyProduct,createProduct, getCategoryStats } from '../controllers/ProductController.js';
import SlugifyMiddleware from '../middlewares/SlugifyMiddleware.js'


const productRouter = express.Router()

productRouter.route('').get(getProducts).post(SlugifyMiddleware,createProduct)
productRouter.route('/:id').put(updateProduct).delete(deleteProduct)
productRouter.route('/buy/:id').post(buyProduct)
productRouter.route('/stats').get(getCategoryStats)
export default productRouter
