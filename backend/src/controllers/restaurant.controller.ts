import express from 'express'
import RestaurantM from '../models/restaurant'

export class RestaurantController{
    getNumberOfRestaurants = (req: express.Request, res: express.Response)=>{
        RestaurantM.countDocuments()
            .then(numberOfRestaurants => {
                res.json(numberOfRestaurants);
            })
        .catch(err => {
            console.error(err);
            res.json(null);
        });
    }

    getAll = (req: express.Request, res: express.Response)=>{
        RestaurantM.find()
            .then(restaurants => {
                res.json(restaurants);
            })
        .catch(err => {
            console.error(err);
            res.json(null);
        });
    }
}