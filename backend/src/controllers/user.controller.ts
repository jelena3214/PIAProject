import express from 'express'
import UserM from '../models/user'
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
}