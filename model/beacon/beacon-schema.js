const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const Position = new Schema ({
  lat: { type: Number  , required: true },
  lng: { type: Number  , required: true }
}, { _id : false });

const Data = new Schema ({
  instanceid: { type: String },
  marker: { type: Position },
  namespaceid: { type: String }
});

const beaconSchema = new Schema ({
 createdAt: { type: Date }
 data: { type: Data },
 department_id: { type: String },
 id: { type: String },
 name: { type: String },
 organization_id: { type: String },
 type: { type: String },
 triggerFloorChange: { type: Boolean },
 triggerVenueChange: { type: Boolean },
 updatedAt: { type: Date }
)};

module.exports = mongoose.model('Beacon', beaconSchema);
