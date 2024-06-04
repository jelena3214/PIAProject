import mongoose from "mongoose";

const Schema = mongoose.Schema;

let restaurantSchema = new Schema(
  {
    Naziv:String,
    Adresa:String,
    Tip:String,
    Konobari:Array,
    ProsecnaOcena:Number,
    Telefon:String
  },
  {
    versionKey:false
  }
);

export default mongoose.model("RestaurantModel", restaurantSchema, "Restoran");
