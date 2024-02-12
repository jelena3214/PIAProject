import express from 'express'
import UserM from '../models/user'

export class UserController{
    login = (req: express.Request, res: express.Response)=>{
        let usernameP = req.body.username;
        let passwordP = req.body.password;

        /*
            let query = UserM.findOne({username: usernameP, password: passwordP});

            Mongoose queries are not promises. Queries are thenables. Code above is executed synchronously.

            Unlike promises, calling a query's .then() executes the query and it gets called immediately, 
            but execution is asynchronous and THEN CALLBACK is called after finish.

            Then function returs Promise, but we are not returning promises to front, 
            from then callback we are returning just data in response that is later inserted into Observable.
        */

        UserM.findOne({username: usernameP, 
        password: passwordP}).then((user)=>{
            res.json(user)
        }).catch((err)=>{
            console.log(err)
        })

        
    }

    register = (req: express.Request, res: express.Response)=>{
        let username = req.body.username;
        let password = req.body.password;
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;

        let user = {
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname
        }

        new UserM(user).save().then(ok=>{
            res.json({message: "ok"})
        }).catch(err=>{
            console.log(err)
        })
    }

    addToFavourites= (req: express.Request, res: express.Response)=>{
        let datee = new Date();
        let dateStr = datee.getFullYear() + "-" + 
        (datee.getMonth()+1) + "-" + datee.getDate();
        let fav = {
            name: req.body.name,
            author: req.body.author,
            date: dateStr
        }
        UserM.updateOne({username: req.body.user}, 
            {$push: {favourites: fav}}).then(data=>{
                res.json({message: "Ok"})
            }).catch(err=>{
                res.json({message: "Fail"})
            })
    }

    getUserByUsername = (req: express.Request,
        res: express.Response) =>{
            let username = req.params.username;
            UserM.findOne({username: username}).then(
                user=>{
                    res.json(user)
                }
            ).catch(err=>console.log(err))

            /*UserM.findOne({_id: "658c42827618b2cf3e3edae6"}).then(
                user=>{
                    res.json(user)
                }
            ).catch(err=>console.log(err))*/
        }

    changeFavourite=(req: express.Request, res: express.Response)=>{
        let user = req.body.user;
        let bookname = req.body.bookname;

        /*UserM.updateOne({username: user},
        {$pull: {favourites: {name: bookname}}}).then(
                ok=>res.json({message: "Ok"})
        ).catch(err=>console.log(err))*/

        UserM.updateOne({username: user}, 
            {$set: {"favourites.$[f].name": "Changed name"}}, 
            {arrayFilters: [{"f.name": bookname}]}).then(
                ok=>res.json({message: "Ok"})
        ).catch(err=>console.log(err))
    }
}