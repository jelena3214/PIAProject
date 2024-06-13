const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let shapeSchema = new Schema({
  type: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number },
  height: { type: Number },
  radius: { type: Number },
  brojLjudi: { type: Number },
  vrstaPravougaonika: { type: Number }
});

let restaurantLayoutSchema = new Schema({
  restoranId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restoran', required: true },
  raspored: [shapeSchema]
},
{
    versionKey:false
});

export default mongoose.model("RestorauntLayout", restaurantLayoutSchema, "RestoranRaspored");

