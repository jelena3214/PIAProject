import express from 'express'
import UserM from '../models/user'

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
                res.json({"msg":"exists", "code":"2"});
                return;
            }else{
                UserM.findOne({mejl:user.mejl}).then((user2)=>{
                    if(user2){
                        res.json({"msg":"exists", "code":"3"});
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
                            res.json({"msg":"ok", "code":"0"});
                        }).catch((err)=>{
                            res.json({"msg":"error", "code":"1"});
                        })
                    }
                }).catch((err)=>{
                    res.json({"msg":"error", "code":"1"});
                })
            }
        }).catch((err)=>{
            res.json({"msg":"error", "code":"1"});
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
}