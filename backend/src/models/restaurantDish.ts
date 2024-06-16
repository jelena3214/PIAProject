import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const dishSchema = new Schema({
  naziv: { type: String, required: true },
  cena: { type: Number, required: true },
  sastojci: { type: Array, required: true },
  slika: { type: String }
});

const restaurantDishSchema = new Schema({
  restoranId: { type: String, required: true },
  jela: [dishSchema]
}, { versionKey: false });

const RestaurantDishM = mongoose.model('RestaurantDishM', restaurantDishSchema, 'RestoranJela');

export default RestaurantDishM;
