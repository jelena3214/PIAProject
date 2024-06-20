import express from 'express'
import { WaiterController } from '../controllers/waiter.controller'

const waiterRouter = express.Router()


waiterRouter.route("/register").post(
    (req,res)=>new WaiterController().register(req,res)
)

waiterRouter.route("/getAll").get(
    (req,res)=>new WaiterController().getAll(req,res)
)

waiterRouter.route("/getRestaurant/:id").get(
    (req, res)=>new WaiterController().getRestaurantByWaiterId(req, res)
)

waiterRouter.route("/updateReservation").put(
    (req, res)=>new WaiterController().updateReservation(req, res)
)

export default waiterRouter;