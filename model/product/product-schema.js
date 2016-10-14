const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const productSchema = new Schema({
  name: { type: String, required: true },
  ean:  { type: String, required: true, index: true },
  description : { type: String },
  category : { type: String },
  poids : { type: String }
});


module.exports = mongoose.model('Product', productSchema);
