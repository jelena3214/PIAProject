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
    tipSkole: string;
    trenutniRazred: number;
    bezPitanje: { pitanje: string; odgovor: string };
    slika: string;
    nastavnikPitanja: { zeljeniPredmeti: any[]; zeljeniRazredi: any[]; izvor: string };
    cv: string;
  }
  


import crypto from 'crypto';

function encryptPassword(password: string): string {
    const secret = 'tajni_kljuc';
    const hash = crypto.createHmac('sha256', secret)
        .update(password)
        .digest('hex');
    return hash;
}


export class UserController{
    login = (req: express.Request, res: express.Response)=>{
        let usernameP = req.body.username;
        let passwordP = req.body.password;
        console.log(encryptPassword(passwordP))
        UserM.findOne({korIme: usernameP, lozinka: encryptPassword(passwordP)}).then((user)=>{
            res.json(user)
        }).catch((err)=>{
            console.log(err)
        })
    }

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
                        let newStudent = new UserM();
                        newStudent.ime = user.ime
                        newStudent.prezime = user.prezime
                        newStudent.korIme = user.korIme
                        newStudent.lozinka = encryptPassword(user.lozinka)
                        newStudent.pol = user.pol;
                        newStudent.adresa = user.adresa;
                        newStudent.telefon = user.telefon;
                        newStudent.mejl = user.mejl
                        newStudent.tip = user.tip
                        newStudent.aktivan = user.aktivan
                        newStudent.tipSkole = user.tipSkole
                        newStudent.trenutniRazred = user.trenutniRazred
                        newStudent.bezPitanje = user.bezPitanje
                        newStudent.slika = user.slika
                        newStudent.nastavnikPitanja = user.nastavnikPitanja
                        newStudent.cv = user.cv

                        newStudent.save().then((user)=>{
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

    checkAnswer = (req: express.Request, res: express.Response)=>{
        let usernameP = req.body.username;
        let answer = req.body.answer;
    
        UserM.findOne({korIme: usernameP}).then((user)=>{
            if(user){
                if(user.bezPitanje?.odgovor == answer){
                    res.json({"msg":"ok", "code":"0"});
                }else{
                    res.json({"msg":"error", "code":"1"});
                }
            }else{
                res.json({"msg":"error", "code":"1"});
            }
        }).catch((err)=>{
            console.log(err)
        })
    }

    changePassword = (req: express.Request, res: express.Response)=>{
        let usernameP = req.body.username;
        let passwordP = req.body.newPassword;
        UserM.updateOne({korIme: usernameP},{lozinka: encryptPassword(passwordP)}).then((user)=>{
            res.json({"msg":"ok", "code":"0"});
        }).catch((err)=>{
            res.json({"msg":"error", "code":"1"});
        })
    }
}