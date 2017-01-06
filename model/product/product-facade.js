const Model = require('../../lib/facade');
const productSchema  = require('./product-schema');
const trilateration = require('../../util/trilateration')
const beaconFacade = require('../beacon/beacon-facade')

class ProductModel extends Model {

  removeByEan(eanQuery) {
    return productSchema
    .find({ ean: eanQuery })
    .remove()
    .exec();
  }

  addPosition(eanQuery, positions) {

    let position = null;

    return beaconFacade.find({})
      .then((proximyBeacons) => {

        // Getting beacons
        let validBeacons = [];
        positions.forEach((position) => {
          proximyBeacons.forEach((beaconProximy) => {
            if(position.uuid === beaconProximy.data.uuid){
              beaconProximy["dist"] = position.dist;
              validBeacons.push(beaconProximy);
            }
          });
        });

        // Trilate the 3 nearests beacons
        if(validBeacons.length >= 3) {
          let beacons = [];
          for (let i = 0; i < 3; i++) {
            beacons.push(new trilateration.Beacon(validBeacons[i].data.marker.lat, validBeacons[i].data.marker.lng, validBeacons[i].dist));
          }
          position = trilateration.trilaterate(beacons);
        }

      })
      .then(() => productSchema.findOne({ ean: eanQuery })
      .exec((err, product) => {
        if(!position)
          return productSchema.findOne({ ean: eanQuery });
        product.positions.push(position);
        return productSchema.update({ ean: eanQuery }, product, { upsert: true }).exec();
      }));
  }
}

module.exports = new ProductModel(productSchema);
