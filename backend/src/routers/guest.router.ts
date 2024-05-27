import express from 'express'
import { GuestController } from '../controllers/guest.controller'

const guestRouter = express.Router()


guestRouter.route("/register").post(
    (req,res)=>new GuestController().register(req,res)
)

export default guestRouter;