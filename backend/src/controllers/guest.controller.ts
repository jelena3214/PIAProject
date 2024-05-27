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
                res.json({"msg":"exists", "code":"2"});
                return;
            }else{
                UserM.findOne({mejl:user.mejl}).then((user2)=>{
                    if(user2){
                        res.json({"msg":"exists", "code":"3"});
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

                        newGuest.save().then((user)=>{
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

    // checkAnswer = (req: express.Request, res: express.Response)=>{
    //     let usernameP = req.body.username;
    //     let answer = req.body.answer;
    
    //     UserM.findOne({korIme: usernameP}).then((user)=>{
    //         if(user){
    //             if(user.bezPitanje?.odgovor == answer){
    //                 res.json({"msg":"ok", "code":"0"});
    //             }else{
    //                 res.json({"msg":"error", "code":"1"});
    //             }
    //         }else{
    //             res.json({"msg":"error", "code":"1"});
    //         }
    //     }).catch((err)=>{
    //         console.log(err)
    //     })
    // }

    // changePassword = (req: express.Request, res: express.Response)=>{
    //     let usernameP = req.body.username;
    //     let passwordP = req.body.newPassword;
    //     UserM.updateOne({korIme: usernameP},{lozinka: encryptPassword(passwordP)}).then((user)=>{
    //         res.json({"msg":"ok", "code":"0"});
    //     }).catch((err)=>{
    //         res.json({"msg":"error", "code":"1"});
    //     })
    // }

    // getInfo = async (req: express.Request, res: express.Response) => {
    //     try {
    //       const totalStudents = await UserM.countDocuments({ tip: 'student' }); // Broj učenika
    //       const totalActiveTeachers = await UserM.countDocuments({ tip: 'nastavnik', aktivan: true }); // Broj aktivnih nastavnika
    //       res.json({ totalStudents, totalActiveTeachers });
    //     } catch (error) {
    //       console.error('Error fetching general info:', error);
    //       res.status(500).json({ error: 'Internal server error' });
    //     }
    // };


    // getTeachersPerSubject = async (req: express.Request, res: express.Response) => {
    //     try {
    //         // Pronalaženje svih nastavnika
    //         const nastavnici = await UserM.find({ tip: 'nastavnik' });
    
    //         // Formiranje liste predmeta sa listom trenutno angažovanih nastavnika po predmetu
    //         interface PredmetNastavnik {
    //             predmet: string;
    //             nastavnici: { ime: string; prezime: string }[];
    //         }
              
    //         const predmeti: PredmetNastavnik[] = [];
            
    //         nastavnici.forEach(nastavnik => {
    //             if(nastavnik){
    //                 nastavnik.nastavnikPitanja?.zeljeniPredmeti.forEach(predmet => {
    //                     const index = predmeti.findIndex(item => item.predmet === predmet);
    //                     if (index !== -1) {
    //                         predmeti[index].nastavnici.push({ ime: nastavnik.ime? nastavnik.ime:"", prezime: nastavnik.prezime?nastavnik.prezime:"" });
    //                     } else {
    //                         predmeti.push({ predmet: predmet, nastavnici: [{ ime: nastavnik.ime?nastavnik.ime:"", prezime: nastavnik.prezime?nastavnik.prezime:"" }] });
    //                     }
    //                 });
    //             }
    //         });
    
    //         // Slanje liste predmeta sa listom trenutno angažovanih nastavnika po predmetu
    //         res.json({ success: true, predmeti });
    //     } catch (err) {
    //         // Slanje odgovora u slučaju greške
    //         res.status(500).json({ success: false, message: "greska" });
    //     }
    // };
}