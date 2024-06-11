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
    RadniDani: {
      "1": { od: String, do: String },
      "2": { od: String, do: String },
      "3": { od: String, do: String },
      "4": { od: String, do: String },
      "5": { od: String, do: String },
      "6": { od: String, do: String },
      "7": { od: String, do: String }
    },
    Stolovi: [
      {
        stoID: Number,
        maksimalanBrojLjudi: Number
      }
    ]
  },
  {
    versionKey: false
  }
);

export default mongoose.model("RestaurantModel", restaurantSchema, "Restoran");
