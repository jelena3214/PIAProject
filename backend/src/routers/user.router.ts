import express from 'express'
import { UserController } from '../controllers/user.controller'
import user from '../models/user'

const userRouter = express.Router()

userRouter.route("/login").post(
    (req,res)=>new UserController().login(req,res)
)

userRouter.route("/register").post(
    (req,res)=>new UserController().register(req,res)
)

userRouter.route("/checkAnswer").post(
    (req,res)=>new UserController().checkAnswer(req,res)
)

userRouter.route("/changePassword").post(
    (req,res)=>new UserController().changePassword(req,res)
)

export default userRouter;