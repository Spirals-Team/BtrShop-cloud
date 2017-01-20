const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const QuantitativeValue = new Schema({
  /* minValue : { type: Number },
  maxValue : { type: Number }, */
  unitCode: { type: String },
  unitText: { type: String, required: true },
  value: { type: Number, required: true }
}, { _id : false, timestamps: false  });

const Offer = new Schema({
  price: { type: Number, required: true },
  priceCurrency: { type: String, required: true },
  validFrom: { type: Date },
  validThrough: { type: Date, default: Date.now }
}, { _id : false, timestamps: false });

const Position = new Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  date : { type: Date, default: Date.now }
}, { _id : false, timestamps: false  });

const BeaconUuid = new Schema({
  uuid: { type: String, required: true },
  count: { type: Number }
}, { _id : false, timestamps: false  });

const productSchema = new Schema({
  averagePosition : { type: Position },
  beacons: { type: [BeaconUuid] },
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
  positions : { type: [Position] },
  weight : { type: QuantitativeValue },
  width : { type: QuantitativeValue }
}, { _id : true, timestamps: true });

/* Recursive attribute */
// productSchema.add({ isAccessoryOrSparePartFor: { type: productSchema } });

module.exports = mongoose.model('Product', productSchema);
