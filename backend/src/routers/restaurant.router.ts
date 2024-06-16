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

restaurantRouter.route('/addWaiter').post(
    (req,res)=>new RestaurantController().addWaiter(req,res)
)

restaurantRouter.route('/addRestaurant').post(
    (req,res)=>new RestaurantController().addRestaurant(req,res)
);


restaurantRouter.route('/:id/working-hours').put(
    (req,res)=>new RestaurantController().updateWorkingHours(req,res)
)

restaurantRouter.route('/:id/getLayout').get(
    (req,res)=>new RestaurantController().getLayout(req,res)
)

restaurantRouter.route('/getReservationsForTime').post(
    (req,res)=>new RestaurantController().getReservationsForSpecificDateTime(req,res)
);

restaurantRouter.route('/:id/getDishes').get(
    (req,res)=>new RestaurantController().getDishes(req,res)
);

restaurantRouter.route('/makeAnOrder').post(
    (req,res)=>new RestaurantController().makeAnOrder(req,res)
)

export default restaurantRouter;