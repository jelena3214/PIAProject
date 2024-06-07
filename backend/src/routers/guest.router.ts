import express from 'express'
import { GuestController } from '../controllers/guest.controller'

const guestRouter = express.Router()


guestRouter.route("/register").post(
    (req,res)=>new GuestController().register(req,res)
)

guestRouter.route("/getNumberOfGuests").get(
    (req,res)=>new GuestController().getNumberOfGuests(req,res)
)

guestRouter.route("/getAll").get(
    (req,res)=>new GuestController().getAll(req,res)
)

export default guestRouter;