import express from 'express'
import UserM from '../models/user'
import OrderM from '../models/order'
import ReservationM from '../models/reservation'

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
    prihvacen:boolean;
    blokiran:boolean;
}

import crypto from 'crypto';

function encryptPassword(password: string): string {
    const secret = 'tajni_kljuc';
    const hash = crypto.createHmac('sha256', secret)
        .update(password)
        .digest('hex');
    return hash;
}


export class GuestController{
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
                        let newGuest = new UserM();
                        newGuest.ime = user.ime
                        newGuest.prezime = user.prezime
                        newGuest.korIme = user.korIme
                        newGuest.lozinka = encryptPassword(user.lozinka)
                        newGuest.pol = user.pol;
                        newGuest.adresa = user.adresa;
                        newGuest.telefon = user.telefon;
                        newGuest.mejl = user.mejl
                        newGuest.tip = user.tip
                        newGuest.aktivan = user.aktivan
                        newGuest.bezPitanje = user.bezPitanje
                        newGuest.slika = user.slika
                        newGuest.brojKreditneKartice = user.brojKreditneKartice
                        newGuest.prihvacen = user.prihvacen
                        newGuest.blokiran = user.blokiran
                        newGuest.strajk = 0

                        newGuest.save().then((user)=>{
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

    getNumberOfGuests = (req: express.Request, res: express.Response)=>{
        UserM.countDocuments({ tip: 'gost' })
            .then(numberOfGuests => {
                res.json(numberOfGuests);
            })
        .catch(err => {
            console.error(err);
            res.json(null);
        });
    }

    getAll = (req: express.Request, res: express.Response)=>{
        UserM.find({ tip: 'gost' })
            .then(guests => {
                res.json(guests);
            })
        .catch(err => {
            console.error(err);
            res.json(null);
        });
    }

    getAllOrders =  async (req: express.Request, res: express.Response)=>{
        const username = req.params.username;

        try {
            const orders = await OrderM.find({korIme:username});
            res.json(orders);
        } catch (error) {
            res.json(null);
        }
    }

    getAllReservations =  async (req: express.Request, res: express.Response)=>{
        const username = req.params.username;

        try {
            const reservations = await ReservationM.find({korIme:username});
            res.json(reservations);
        } catch (error) {
            res.json(null);
        }
    }

    strikeGuest =  async (req: express.Request, res: express.Response)=>{
        const username = req.params.username;

        try {
            const user = await UserM.findOneAndUpdate(
                { korIme: username },
                { $inc: { strajk: 1 } }
            );
            res.json(user);
        } catch (error) {
            res.json(null);
        }
    }
}