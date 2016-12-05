const Model = require('../../lib/facade');
const mongoose = require('mongoose');
const productSchema  = require('./product-schema');
const positionFacade  = require('../position/position-facade');


class ProductModel extends Model {

  removeByEan(eanQuery) {
    return productSchema
    .find({ ean: eanQuery })
    .remove()
    .exec();
  }

  updateBeaconList(eanQuery, beaconList){
    return productSchema
      .findOne({ean: eanQuery})
      .exec(function(err, product){
        beaconList.forEach(function(beacon){
          beacon._creator = new mongoose.Types.ObjectId(product._id);
          let beaconId = new mongoose.Types.ObjectId();
          beacon._id = beaconId;
          let position = positionFacade.create(beacon);
          product.positions.push(beaconId);
        });
        return productSchema.update({ean: eanQuery}, product, {upsert: true}).exec();
      });
  }
}

module.exports = new ProductModel(productSchema);
