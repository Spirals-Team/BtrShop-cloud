const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const positionSchema = new Schema({
  _creator : { type: Schema.Types.ObjectId, ref: 'Product' },
  uuid: { type: String, required: true},
  distance: { type: Number  , required: true },
}, { _id : true, timestamps : true });


module.exports = mongoose.model('Position', positionSchema);
