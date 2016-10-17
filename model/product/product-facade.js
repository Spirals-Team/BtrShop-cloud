const Model = require('../../lib/facade');
const productSchema  = require('./product-schema');


class ProductModel extends Model {

  removeByEan(ean) {
    return productSchema
    .find({ean: ean})
    .remove()
    .exec();
  }
}

module.exports = new ProductModel(productSchema);
