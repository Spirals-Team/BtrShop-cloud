const Model = require('../../lib/facade');
const mongoose = require('mongoose');
const beaconSchema  = require('./beacon-schema');

class BeaconModel extends Model {


}

module.exports = new beaconModel(beaconSchema);
