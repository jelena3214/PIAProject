import mongoose from "mongoose";

const Schema = mongoose.Schema;

let reservationSchema = new Schema(
  {
    korIme:String, 
    restoranId:String,
    uToku:Boolean,
    komentar:String,
    ocena:Number,
    datumVreme:Date,
    brojOsoba:Number,
    opis:String
  },
  {
    versionKey:false
  }
);

export default mongoose.model("ReservationModel", reservationSchema, "Rezervacija");
