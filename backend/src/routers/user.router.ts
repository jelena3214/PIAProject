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

userRouter.route("/updateUser").put(
    (req,res)=>new UserController().updateUser(req,res)
)

userRouter.route("/checkEmail/:email").get(
    (req,res)=>new UserController().checkIfUserWithEmailExists(req,res)
)

userRouter.route("/checkPassword").post(
    (req,res)=>new UserController().checkPassword(req,res)
)

userRouter.route("/getUserByUsername").post(
    (req,res)=>new UserController().getUserByUsername(req,res)
)

userRouter.route('/:username/getAllOrders').get(
    (req,res)=>new UserController().getAllOrders(req,res)
);

export default userRouter;