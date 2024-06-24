import express from 'express'
import UserM from '../models/user'
import OrderM from '../models/order'
import ReservationM from '../models/reservation'
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
            res.json(null)
        })
    }

    getSafeQA = (req: express.Request, res: express.Response)=>{
        let usernameP = req.body.username;

        UserM.findOne({korIme: usernameP}).then(
            (user)=>{
                if(user){
                    res.json({"question": user.bezPitanje?.pitanje, "answer":user.bezPitanje?.odgovor})
                }else{
                    res.json(null)
                }
        }).catch((err)=>{
            console.log(err)
            res.json(null)
        })
    }

    changePassword = (req: express.Request, res: express.Response)=>{
        let usernameP = req.body.username;
        let passwordP = req.body.password;

        UserM.updateOne({korIme: usernameP}, {lozinka: encryptPassword(passwordP)}).then(
            (user)=>{
                res.json({"mess":"ok", "code":"0"})
        }).catch((err)=>{
            console.log(err);
            res.json({"mess":"error", "code":"1"});
        })
    }

    updateUser = (req: express.Request, res: express.Response)=>{
        const updatedUser = req.body;
        UserM.updateOne({ _id: updatedUser._id }, { $set: updatedUser }).then(
            (user)=>{
                res.json({"mess":"ok", "code":"0"})
        }).catch((err)=>{
            console.log(err);
            res.json({"mess":"error", "code":"1"});
        })
    }

    getUserByUsername = (req: express.Request, res: express.Response)=>{
        const username = req.body.username;
        UserM.findOne({ korIme: username}).then(
            (user)=>{
                res.json(user)
        }).catch((err)=>{
            console.log(err);
            res.json(null);
        })
    }

    getUserById = (req: express.Request, res: express.Response)=>{
        const id = req.body.id;
        UserM.findById(id).then(
            (user)=>{
                res.json(user)
        }).catch((err)=>{
            console.log(err);
            res.json(null);
        })
    }

    checkIfUserWithEmailExists = (req: express.Request, res: express.Response)=>{
        const email = req.params.email;

        UserM.findOne({ mejl: email })
          .then(user => {
            if (user) {
              res.json({ exists: true }); // Korisnik sa datim emailom postoji
            } else {
              res.json({ exists: false }); // Korisnik sa datim emailom ne postoji
            }
          })
          .catch(err => {
            console.error('Greška pri pronalaženju korisnika:', err);
            res.status(500).json({ error: 'Greška pri pronalaženju korisnika' });
        });
    }

    checkPassword = (req: express.Request, res: express.Response)=>{
        let username = req.body.username;
        let password = req.body.password;

        UserM.findOne({ korIme: username })
          .then(user => {
            if (user) {
              res.json({ correct: user.lozinka ==  encryptPassword(password)});
            } else {
              res.json({ correct: false });
            }
          })
          .catch(err => {
            console.error('Greška pri promeri lozinke:', err);
            res.status(500).json({ error: 'Greška'});
        });
    }
}