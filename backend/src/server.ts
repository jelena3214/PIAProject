import express from 'express';
import cors from 'cors'
import userRouter from './routers/user.router';
import mongoose from 'mongoose'
import UserM from './models/user'

const app = express();
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/NajdraziNastavnik')
const conn = mongoose.connection
conn.once('open', ()=>{
    console.log("DB ok")
})

const router = express.Router()
router.use('/users', userRouter)

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

router.post('/uploadPhoto',  upload.single('file'), (req, res) => {
    const filename = req.file?.filename;
    const path = req.file?.path;
    const user = req.body.user

    UserM.updateOne({ korIme: user }, { slika: path }).then((user1)=>{
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

router.post('/uploadCV',  upload.single('file'), (req, res) => {
    const filename = req.file?.filename;
    const path = req.file?.path;
    const user = req.body.user

    UserM.updateOne({ korIme: user }, { cv: path }).then((user1)=>{
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