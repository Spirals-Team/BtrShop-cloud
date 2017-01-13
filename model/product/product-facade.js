const Model = require('../../lib/facade');
const productSchema  = require('./product-schema');
const trilateration = require('../../util/trilateration');
const beaconFacade = require('../beacon/beacon-facade');
const math = require('mathjs');

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

            if(beaconProximy.data.uuid && position.uuid &&
              position.uuid.toLowerCase() === beaconProximy.data.uuid.toLowerCase()){
              beaconProximy["dist"] = position.dist;
              if(!validBeacons.includes(beaconProximy))
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
        if(position) {
          product.positions.push(position);

          // Compute average position
          let arrayLat = [];
          let arrayLng = [];
          product.positions.forEach((positionProduct) => {
            arrayLat.push(positionProduct.lat);
            arrayLng.push(positionProduct.lng);
          });
  
          product.averagePosition = {
            lat: math.median(arrayLat),
            lng: math.median(arrayLng)
          };

          productSchema.update({ ean: eanQuery }, product, { upsert: true }).exec();
        }
        return productSchema.findOne({ ean: eanQuery });
      }));
  }
}

module.exports = new ProductModel(productSchema);
