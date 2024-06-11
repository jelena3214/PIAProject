import express from 'express';
import cors from 'cors'
import userRouter from './routers/user.router';
import mongoose from 'mongoose'
import UserM from './models/user'
import guestRouter from './routers/guest.router';
import restaurantRouter from './routers/restaurant.router';
import waiterRouter from './routers/waiter.router';
import reservationRouter from './routers/reservation.router';

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.static('upload'));

mongoose.connect('mongodb://127.0.0.1:27017/KutakDobreHrane')
const conn = mongoose.connection
conn.once('open', ()=>{
    console.log("DB ok")
})

const router = express.Router()
router.use('/user', userRouter)
router.use('/guest', guestRouter)
router.use('/restaurant', restaurantRouter)
router.use('/waiter', waiterRouter)
router.use('/reservation', reservationRouter)


// Helpers for photo upload

var multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: (arg0: null, arg1: string) => void) {
        cb(null, './upload')
    },
    filename: function (req: any, file: { originalname: any; }, cb: (arg0: null, arg1: any) => void) {
        cb(null, file.originalname)
    }
})
const upload = multer({
    storage: storage
})

const fs = require('fs')
const path = require('path')

router.post('/uploadPhoto',  upload.single('file'), (req, res) => {
    const filename = req.file?.filename;
    const user = req.body.user
    
    const newPath = user + "_" + filename; // Dodajemo korisničko ime korisnika u naziv slike
    fs.renameSync(req.file?.path, path.join(req.file?.destination, newPath)); // Preimenujemo sliku na serveru
    const imageUrl = newPath; // Novi naziv slike koji ćemo sačuvati u bazi ili koristiti za prikaz
       

    UserM.updateOne({ korIme: user }, { slika: imageUrl }).then((user1)=>{
        UserM.findOne({korIme:user}).then((user2)=>{
            res.json(user2);
        }).catch((err)=>{
            res.json(null);
        })
    }).catch((err)=>{
        res.json(null);
    })
    console.log(filename)
    console.log(user)
});

app.use("/" ,router)
app.listen(4000, () => console.log(`Express server running on port 4000`));