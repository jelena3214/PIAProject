import mongoose from "mongoose";

const Schema = mongoose.Schema;

let orderSchema = new Schema(
  {
    korIme:String, 
    restoranId:String,
    vremeDostave:String,
    status:String,
    naruceno:Array,
    datum:Date,
    iznos:Number,
    datumDostave:Date
  },
  {
    versionKey:false
  }
);

export default mongoose.model("orderModel", orderSchema, "Narudzbina");
