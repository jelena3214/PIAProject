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
    opis:String,
    stoId:String,
    pojavioSe:String,
    konobar:String,
    odbijanjeKom:String,
    produzetak:Boolean
  },
  {
    versionKey:false,
    timestamps:true
  }
);

export default mongoose.model("ReservationModel", reservationSchema, "Rezervacija");
