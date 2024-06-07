import mongoose from "mongoose";

const Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    ime:String,
    prezime:String,
    korIme:String,
    lozinka:String,
    pol:String,
    adresa:String,
    telefon:String,
    mejl:String,
    tip:String,
    aktivan:Boolean,
    prihvacen:Boolean,
    blokiran:Boolean,
    bezPitanje:
        {
            pitanje:String, odgovor:String
        },
    slika:String,
    brojKreditneKartice:String
  },
  {
    versionKey:false
  }
);

export default mongoose.model("UserModel", userSchema, "Korisnik");
