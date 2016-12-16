const Model = require('../../lib/facade');
const beaconSchema  = require('./beacon-schema');

class BeaconModel extends Model {

  updateBeacons(beaconsList) {

    console.log('facade');

    return beaconSchema
      .remove({})
      .then(() => beaconSchema
          .create(beaconsList));

  }
}

module.exports = new BeaconModel(beaconSchema);
