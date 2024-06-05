import express from 'express'
import RestaurantM from '../models/restaurant'
import ReservationM from '../models/reservation'

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

    getById = (req: express.Request, res: express.Response)=>{
        RestaurantM.findById(req.params.id)
            .then(restaurant => {
                res.json(restaurant);
            })
        .catch(err => {
            console.error(err);
            res.json(null);
        });
    }

    getReservationsById = (req: express.Request, res: express.Response)=>{
        ReservationM.find({restoranId:req.params.id})
            .then(reservations => {
                res.json(reservations);
            })
        .catch(err => {
            console.error(err);
            res.json(null);
        });
    }

    makeReservation = (req: express.Request, res: express.Response)=>{
        const newReservation = new ReservationM({
            korIme: req.body.korIme,
            restoranId: req.body.restoranId,
            uToku: req.body.uToku,
            komentar: req.body.komentar,
            ocena: req.body.ocena,
            datumVreme: new Date(req.body.datumVreme),
            brojOsoba: req.body.brojOsoba,
            opis: req.body.opis
        });
        
        newReservation.save().then(reservation => {
            res.json(reservation);
        })
        .catch(err => {
            console.error(err);
            res.json(null);
        });
    }
}