const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Schema   = mongoose.Schema;


const QuantitativeValue = new Schema({
  /* minValue : { type: Number },
  maxValue : { type: Number }, */
  unitCode: { type: String },
  unitText: { type: String, required: true },
  value: { type: Number, required: true }
}, { _id : false });

const Offer = new Schema({
  price: { type: Number, required: true },
  priceCurrency: { type: String, required: true },
  validFrom: { type: Date },
  validThrough: { type: Date, default: Date.now }
}, { _id : false, timestamps: true });

const productSchema = new Schema({
  brand: { type: String },
  category : { type: String },
  color : { type: String },
  description : { type: String, required: true },
  depth : { type: QuantitativeValue },
  ean:  { type: String, required: true, index: true, unique: true },
  height : { type: QuantitativeValue },
  logo: { type: String },
  offers : { type: [Offer] },
  model : { type: String },
  name : { type: String, required: true },
  weight : { type: QuantitativeValue },
  width : { type: QuantitativeValue }
}, { timestamps: true });

/* Recursive attribute */
// productSchema.add({ isAccessoryOrSparePartFor: { type: productSchema } });

module.exports = mongoose.model('Product', productSchema);
