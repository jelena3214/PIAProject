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

    addWaiter = (req: express.Request, res: express.Response)=>{
        const restoranId = req.body.restaurant;
        const konobarUsername = req.body.waiter;
        console.log(konobarUsername)

        RestaurantM.findOne({ Konobari: { $in: [konobarUsername] } }).then(rest =>{
            if(rest){
                res.json({"msg":"waiter already busy", "code":"2"});
                return;
            }else{
                RestaurantM.findById(restoranId).then(
                    (restaurant)=>{
                        if(restaurant){
                            restaurant.Konobari.push(konobarUsername);
                            restaurant.save().then(
                                (ss)=>{
                                    res.json({"msg":"ok", "code":"0"});
                                    return;
                                }
                            ).catch(err => {
                                res.json({"msg":"error", "code":"1"});
                                return;
                            });
                            
                        }else{
                            res.json({"msg":"nonexistant restaurant", "code":"3"});
                            return;
                        }
                    }
                ).catch(error => {
                    console.error("Greška prilikom dodavanja konobara u restoran:", error);
                    res.json({"msg":"error", "code":"1"});
                    return;
                });
            }
        }).catch(error => {
            console.error("Greška prilikom dodavanja konobara u restoran:", error);
            res.json({"msg":"error", "code":"1"});
        });
            

    }
}