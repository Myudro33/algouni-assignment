import express from 'express'
import { getUsers,createUser,deleteUser,editUser } from '../controllers/UserController.js'

const userRouter = express.Router()


userRouter.route('/').get(getUsers).post(createUser)
userRouter.route('/:id').put(editUser).delete(deleteUser)


export default userRouter