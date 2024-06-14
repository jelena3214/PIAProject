import mongoose from "mongoose";

const Schema = mongoose.Schema;

let restaurantSchema = new Schema(
  {
    Naziv: String,
    Adresa: String,
    Tip: String,
    Konobari: [String],
    ProsecnaOcena: Number,
    Telefon: String,
    Opis:String,
    RadniDani: {
      "1": { od: String, do: String, radan: Boolean },
      "2": { od: String, do: String, radan: Boolean },
      "3": { od: String, do: String, radan: Boolean },
      "4": { od: String, do: String, radan: Boolean },
      "5": { od: String, do: String, radan: Boolean },
      "6": { od: String, do: String, radan: Boolean },
      "7": { od: String, do: String, radan: Boolean }
    }
  },
  {
    versionKey: false
  }
);

export default mongoose.model("RestaurantModel", restaurantSchema, "Restoran");
