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

guestRouter.route("/:username/getAllOrders").get(
    (req,res)=>new GuestController().getAllOrders(req,res)
);

guestRouter.route("/:username/getAllReservations").get(
    (req,res)=>new GuestController().getAllReservations(req,res)
);

guestRouter.route("/:username/strike").get(
    (req,res)=>new GuestController().strikeGuest(req,res)
);

export default guestRouter;