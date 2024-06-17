import express from 'express'
import RestaurantM from '../models/restaurant'
import ReservationM from '../models/reservation'
import RestaurantLayoutM from '../models/restaurantLayout'
import RestaurantDishM from '../models/restaurantDish'
import OrderM from '../models/order'

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
        let mx = (new Date(req.body.datumVreme)).toLocaleString('se-SE',{ timeZone: 'Europe/Paris' }) + "Z";
        console.log(mx)
        const newReservation = new ReservationM({
            korIme: req.body.korIme,
            restoranId: req.body.restoranId,
            uToku: req.body.uToku,
            komentar: req.body.komentar,
            ocena: req.body.ocena,
            datumVreme: new Date(mx),
            brojOsoba: req.body.brojOsoba,
            opis: req.body.opis,
            stoId: req.body.stoId
        });
        console.log(newReservation.datumVreme)
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
                res.json({"mess":"waiter already busy", "code":"2"});
                return;
            }else{
                RestaurantM.findById(restoranId).then(
                    (restaurant)=>{
                        if(restaurant){
                            restaurant.Konobari.push(konobarUsername);
                            restaurant.save().then(
                                (ss)=>{
                                    res.json({"mess":"ok", "code":"0"});
                                    return;
                                }
                            ).catch(err => {
                                res.json({"mess":"error", "code":"1"});
                                return;
                            });
                            
                        }else{
                            res.json({"mess":"nonexistant restaurant", "code":"3"});
                            return;
                        }
                    }
                ).catch(error => {
                    console.error("Greška prilikom dodavanja konobara u restoran:", error);
                    res.json({"mess":"error", "code":"1"});
                    return;
                });
            }
        }).catch(error => {
            console.error("Greška prilikom dodavanja konobara u restoran:", error);
            res.json({"mess":"error", "code":"1"});
        });
            

    }

    addRestaurant =  async (req: express.Request, res: express.Response)=>{
        try{
            const { restaurant, layout } = req.body;
        
            // Kreiranje i cuvanje novog restorana
            const newRestaurant = new RestaurantM(restaurant);
            const savedRestaurant = await newRestaurant.save();
        
            // Kreiranje i cuvanje rasporeda povezanog sa restoranom
            const newLayout = new RestaurantLayoutM({
                restoranId: savedRestaurant._id,
                raspored: layout
            });
            await newLayout.save();
        
            res.json({"mess":savedRestaurant._id, "code":"0"});
        }catch(err){
            console.log(err)
            res.json({"mess":"error", "code":"1"});
        }
    }

    updateWorkingHours =  async (req: express.Request, res: express.Response)=>{
        const restaurantId = req.params.id;
        const workingHours = req.body.workingHours;
        console.log(workingHours)

        try {
            const updatedRestaurant = await RestaurantM.findByIdAndUpdate(
                restaurantId,
                { RadniDani: workingHours },
                { new: true } // vraca novoupdatovani dokument
            );

            if (!updatedRestaurant) {
                res.json({"mess":"restaurant not found", "code":"1"});
            }

            res.json({"mess":"ok", "code":"0"});
        } catch (error) {
            res.json({"mess":"error", "code":"1"});
        }
    }

    getLayout =  async (req: express.Request, res: express.Response)=>{
        const restaurantId = req.params.id;

        try {
            const layout = await RestaurantLayoutM.findOne({restoranId:restaurantId});
            res.json(layout.raspored);
        } catch (error) {
            res.json(null);
        }
    }

    getReservationsForSpecificDateTime =  async (req: express.Request, res: express.Response)=>{
        const restoranId = req.body.restoranId
        const datumVreme = req.body.datumVreme

        if (!restoranId || !datumVreme) {
            return res.status(400).send('restoranId and datumVreme are required');
        }
        
        let mx = (new Date(req.body.datumVreme)).toLocaleString('se-SE',{ timeZone: 'Europe/Paris' }) + "Z";
        const date = new Date(mx)

        const threeHoursBefore = new Date(date.getTime() - 3 * 60 * 60 * 1000);

        try {
            const reservations = await ReservationM.find({
                restoranId: restoranId,
                datumVreme: { $gte: threeHoursBefore, $lte: date },
                uToku: false
            });
            res.json(reservations);
        } catch (error) {
            res.json(null)
        }
    }

    
    getDishes =  async (req: express.Request, res: express.Response)=>{
        const restaurantId = req.params.id;

        try {
            const dishes = await RestaurantDishM.findOne({restoranId:restaurantId});
            res.json(dishes?.jela);
        } catch (error) {
            res.json(null);
        }
    }

    makeAnOrder = (req: express.Request, res: express.Response)=>{
        let mx = (new Date(req.body.datum)).toLocaleString('se-SE',{ timeZone: 'Europe/Paris' }) + "Z";
        console.log(mx)
        const newOrder = new OrderM({
            korIme: req.body.korIme,
            restoranId: req.body.restoranId,
            vremeDostave:req.body.vremeDostave,
            status:req.body.status,
            naruceno:req.body.naruceno,
            datum:new Date(mx),
            iznos:req.body.iznos,
            datumDostave:null
        });
        newOrder.save().then(order => {
            res.json(order);
        })
        .catch(err => {
            console.error(err);
            res.json(null);
        });
    }
}