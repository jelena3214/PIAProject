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

    cancelReservation = async (req: express.Request, res: express.Response)=>{
        try {
            const reservation = await ReservationM.findByIdAndUpdate(req.params.id, { uToku: false }, { new: true } );
            if (!reservation) {
                res.json(null);
                return
            }
            res.json(reservation);
        } catch (error) {
            res.json(null)
        }
    }

    updateReservation = async (req: express.Request, res: express.Response)=>{
        try {
            const reservationId = req.params.id;
            const { komentar, ocena } = req.body;
        
            const updatedReservation = await ReservationM.findByIdAndUpdate(
                reservationId,
                { komentar, ocena },
                { new: true }
            );
        
            if (!updatedReservation) {
                return res.json(null);
            }
        
            res.json(updatedReservation);
        } catch (error) {
            console.error('Error updating reservation:', error);
            res.status(500).json(null);
        }
    }
}