import express from 'express'
import { RestaurantController } from '../controllers/restaurant.controller';

const restaurantRouter = express.Router()

restaurantRouter.route("/getNumberOfRestaurants").get(
    (req,res)=>new RestaurantController().getNumberOfRestaurants(req,res)
)

restaurantRouter.route("/getAll").get(
    (req,res)=>new RestaurantController().getAll(req,res)
)

restaurantRouter.route('/:id').get(
    (req,res)=>new RestaurantController().getById(req,res)
)

restaurantRouter.route('/getReservations/:id').get(
    (req,res)=>new RestaurantController().getReservationsById(req,res)
)

restaurantRouter.route('/makeReservation').post(
    (req,res)=>new RestaurantController().makeReservation(req,res)
)

export default restaurantRouter;