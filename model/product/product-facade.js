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
    const validBeacons = [];

    return beaconFacade.find({})
      .then((proximyBeacons) => {

        // Getting beacons and validate
        positions.forEach((position) => {
          proximyBeacons.forEach((beaconProximy) => {

            if (beaconProximy.data.uuid && position.uuid &&
              position.uuid.toLowerCase() === beaconProximy.data.uuid.toLowerCase()) {
              beaconProximy.dist = position.dist;
              if (!validBeacons.includes(beaconProximy))                {
                validBeacons.push(beaconProximy);
              }
            }
          });
        });

        // Trilate the 3 valid nearests beacons
        if (validBeacons.length >= 3) {
          const beacons = [];
          for (let i = 0; i < 3; i++) {
            beacons.push(new trilateration.Beacon(validBeacons[i].data.marker.lat,
              validBeacons[i].data.marker.lng, validBeacons[i].dist));
          }
          try {
            position = trilateration.trilaterate(beacons);
          } catch (e) {
            // The trilateration have not worked but it's k
          }
        }


      })
      .then(() => productSchema.findOne({ ean: eanQuery })
      .exec((err, product) => {

        if (!err) {
          // Compute average position
          if (position) {
            product.positions.push(position);

            const arrayLat = [];
            const arrayLng = [];
            product.positions.forEach((positionProduct) => {
              arrayLat.push(positionProduct.lat);
              arrayLng.push(positionProduct.lng);
            });

            product.averagePosition = {
              lat: math.median(arrayLat),
              lng: math.median(arrayLng)
            };
          }

          // Save beacons uuid and count in product
          validBeacons.forEach((beacon) => {
            if (!product.beacons) {
              const beacons = [];
              beacons.push(
                {
                  uuid: beacon.data.uuid,
                  count: 1
                });
              product.beacons = beacons;
            } else {
              let found = false;
              for (let i = 0; i < product.beacons.length; i++) {
                if (product.beacons[i].uuid === beacon.data.uuid) {
                  product.beacons[i].count += 1;
                  found = true;
                  break;
                }
              }
              if (!found) {
                product.beacons.push({
                  uuid: beacon.data.uuid,
                  count: 1
                });
              }
            }
          });

          // For mongodb, cause we can't update with an id
          delete product._id;

          productSchema.update({ ean: eanQuery }, product, { upsert: true }).exec();
        }


        return productSchema.findOne({ ean: eanQuery });
      }));
  }
}


module.exports = new ProductModel(productSchema);
