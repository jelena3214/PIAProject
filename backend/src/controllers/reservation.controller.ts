import express from 'express'
import ReservationM from '../models/reservation'

export class ReservationController{
    getReservationsLast24Hours = (req: express.Request, res: express.Response) => {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);
    
        ReservationM.countDocuments({ datumVreme: { $gte: twentyFourHoursAgo } })
        .then(count => {
            res.json(count);
        })
        .catch(err => {
            console.error(err);
            res.json(null);
        });
    };

    getReservationsLast7Days = (req: express.Request, res: express.Response) => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
        ReservationM.countDocuments({ datumVreme: { $gte: sevenDaysAgo } })
        .then(count => {
            res.json(count);
        })
        .catch(err => {
            console.error(err);
            res.json(null);
        });
    };
    
    getReservationsLast30Days = (req: express.Request, res: express.Response) => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
        ReservationM.countDocuments({ datumVreme: { $gte: thirtyDaysAgo } })
        .then(count => {
            res.json(count);
        })
        .catch(err => {
            console.error(err);
            res.json(null);
        });
    };
}