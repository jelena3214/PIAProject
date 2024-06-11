import express from 'express'
import { ReservationController } from '../controllers/reservation.controller';

const reservationRouter = express.Router()


reservationRouter.route("/last24h").get(
    (req,res)=>new ReservationController().getReservationsLast24Hours(req,res)
)

reservationRouter.route("/last7d").get(
    (req,res)=>new ReservationController().getReservationsLast7Days(req,res)
)


reservationRouter.route("/last30d").get(
    (req,res)=>new ReservationController().getReservationsLast30Days(req,res)
)


export default reservationRouter;