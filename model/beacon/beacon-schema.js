const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const Position = new Schema({
  lat: { type: Number },
  lng: { type: Number }
}, { _id : false });

const Data = new Schema({
  instanceid: { type: String },
  major: { type: Number },
  minor: { type: Number },
  marker: { type: Position },
  namespaceid: { type: String },
  uuid: { type: String }
}, { _id : false });

const beaconSchema = new Schema({
  createdAt: { type: Date },
  data: { type: Data },
  department_id: { type: String },
  floor_id: { type: String },
  id: { type: String },
  name: { type: String },
  place_id: { type: String },
  organization_id: { type: String },
  type: { type: String },
  triggerFloorChange: { type: Boolean },
  triggerVenueChange: { type: Boolean },
  updatedAt: { type: Date },
  geopoint: { type: [Position] }
}, { _id : true });

module.exports = mongoose.model('Beacon', beaconSchema);
