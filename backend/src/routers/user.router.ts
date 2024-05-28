import express from 'express'
import { UserController } from '../controllers/user.controller'

const userRouter = express.Router()

userRouter.route("/login").post(
    (req,res)=>new UserController().login(req,res)
)

userRouter.route("/getSafeQA").post(
    (req,res)=>new UserController().getSafeQA(req,res)
)

userRouter.route("/changePassword").post(
    (req,res)=>new UserController().changePassword(req,res)
)

export default userRouter;