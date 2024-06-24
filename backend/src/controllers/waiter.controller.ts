import express from 'express'
import UserM from '../models/user'
import RestaurantM from '../models/restaurant'
import ReservationM from '../models/reservation'
import OrderM from '../models/order'

interface User {
    ime: string;
    prezime: string;
    korIme: string;
    lozinka: string;
    pol: string;
    adresa: string;
    telefon: string;
    mejl: string;
    tip: string;
    aktivan: boolean;
    bezPitanje: { pitanje: string; odgovor: string };
    slika: string;
    brojKreditneKartice:string;
    prihvacen: boolean;
    blokiran: boolean;
}

import crypto from 'crypto';

function encryptPassword(password: string): string {
    const secret = 'tajni_kljuc';
    const hash = crypto.createHmac('sha256', secret)
        .update(password)
        .digest('hex');
    return hash;
}


export class WaiterController{
    register = (req: express.Request, res: express.Response)=>{
        const user: User = req.body.user;

        // provera username
        UserM.findOne({korIme:user.korIme}).then((user1)=>{
            if(user1){
                res.json({"mess":"exists", "code":"2"});
                return;
            }else{
                UserM.findOne({mejl:user.mejl}).then((user2)=>{
                    if(user2){
                        res.json({"mess":"exists", "code":"3"});
                    }else{
                        let newWaiter = new UserM();
                        newWaiter.ime = user.ime
                        newWaiter.prezime = user.prezime
                        newWaiter.korIme = user.korIme
                        newWaiter.lozinka = encryptPassword(user.lozinka)
                        newWaiter.pol = user.pol;
                        newWaiter.adresa = user.adresa;
                        newWaiter.telefon = user.telefon;
                        newWaiter.mejl = user.mejl
                        newWaiter.tip = user.tip
                        newWaiter.aktivan = user.aktivan
                        newWaiter.bezPitanje = user.bezPitanje
                        newWaiter.slika = user.slika
                        newWaiter.brojKreditneKartice = user.brojKreditneKartice
                        newWaiter.prihvacen = user.prihvacen
                        newWaiter.blokiran = user.blokiran

                        newWaiter.save().then((user)=>{
                            res.json({"mess":"ok", "code":"0"});
                        }).catch((err)=>{
                            res.json({"mess":"error", "code":"1"});
                        })
                    }
                }).catch((err)=>{
                    res.json({"mess":"error", "code":"1"});
                })
            }
        }).catch((err)=>{
            res.json({"mess":"error", "code":"1"});
        })

        
    }

    getAll = (req: express.Request, res: express.Response)=>{
        UserM.find({ tip: 'konobar' })
            .then(guests => {
                res.json(guests);
            })
        .catch(err => {
            console.error(err);
            res.json(null);
        });
    }

    getRestaurantByWaiterId = async (req: express.Request, res: express.Response)=>{
        const waiterId = req.params.id;

        try {
            const restoran = await RestaurantM.findOne({ Konobari: waiterId });
            if (restoran) {
                res.json(restoran);
            } else {
                res.json(null);
            }
        } catch (error) {
            res.json(null);
        }
    }

    updateReservation = async (req: express.Request, res: express.Response)=>{
        const { _id, ...rest } = req.body;

        if (!_id) {
            return res.status(400).send('Reservation ID is required');
        }

        try {
            const updatedReservation = await ReservationM.findByIdAndUpdate(
                _id,
                { ...rest },
                { new: true }
            );

            if (!updatedReservation) {
                res.json(null)
                return
            }

            res.json(updatedReservation);
        } catch (error) {
            res.json(null)
            return
        }
    }

    getCurrentOrders = async (req: express.Request, res: express.Response) => {
        const { restaurantId } = req.params;
        
        if (!restaurantId) {
            return res.status(400).json({ message: 'Restaurant ID is required' });
        }
        
        try {
            const orders = await OrderM.find({ restoranId: restaurantId, status: 'K' });
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching current orders' });
        }
    };
      
    confirmOrRejectOrder = async (req: express.Request, res: express.Response) => {
        const { orderId, action, estimatedTime } = req.body;

        if (!orderId || !action) {
            return res.status(400).json({ message: 'Order ID and action are required' });
        }

        try {
            const update = action === 'confirm'
            ? { status: 'P', estimatedTime }
            : { status: 'O' };

            let datumDostave = null;

            if (action === 'confirm' && estimatedTime) {
                const now = new Date();
                switch (estimatedTime) {
                    case '23':
                        datumDostave = new Date(now.getTime() + 30 * 60000);
                        break;
                    case '34':
                        datumDostave = new Date(now.getTime() + 40 * 60000);
                        break;
                    case '56':
                        datumDostave = new Date(now.getTime() + 60 * 60000);
                        break;
                    default:
                        datumDostave = now;
                }
            }

            const updatedOrder = await OrderM.findByIdAndUpdate(
                orderId,
                { status: update.status, vremeDostave: update.estimatedTime, datumDostave },
                { new: true }
            );

            res.json(updatedOrder);
        } catch (error) {
            res.status(500).json({ message: 'Error updating order', error });
        }
    };

    getGuestCountByDay = async (req: express.Request, res: express.Response) => {
        const waiterId = req.params.waiterId;
        try {
            const data = await ReservationM.aggregate([
                { $match: { konobar: waiterId } },
                { 
                    $group: { 
                        _id: { $dayOfWeek: { $toDate: "$datumVreme" } }, 
                        count: { $sum: "$brojOsoba" } 
                    } 
                },
                { $sort: { "_id": 1 } }
            ]);

            // Korekcija dana u nedelji (0 za nedelju, 1 za ponedeljak, itd.)
            const formattedData = data.map(item => ({
                dayOfWeek: item._id - 1, // MongoDB $dayOfWeek vraća 1 za nedelju, mi želimo 0
                count: item.count
            }));

            res.json(formattedData);
        } catch (error) {
            res.json(null);
        }
    };
      
    getGuestDistributionAmongWaiters = async (req: express.Request, res: express.Response) => {
        const restaurantId = req.params.restaurantId;
        try {
            const data = await ReservationM.aggregate([
            { $match: { restoranId: restaurantId } },
            { $group: { _id: "$konobar", count: { $sum: "$brojOsoba" } } },
            ]);
            res.json(data);
        } catch (error) {
            res.json(null);
        }
    };
      
    getAverageReservationsByWeekday = async (req: express.Request, res: express.Response) => {
        const restaurantId = req.params.restaurantId;
        try {
            const data = await ReservationM.aggregate([
                {
                    $match: {
                        restoranId: restaurantId,
                        datumVreme: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 2)) }
                    }
                },
                {
                    $group: {
                        _id: { $dayOfWeek: "$datumVreme" },
                        totalReservations: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        avgReservations: { $avg: "$totalReservations" }
                    }
                },
                {
                    $sort: { "_id": 1 }
                }
            ]);
            res.json(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Error fetching data' });
        }
    };
      

}