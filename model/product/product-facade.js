const Model = require('../../lib/facade');
const productSchema  = require('./product-schema');


class ProductModel extends Model {

  removeByEan(eanQuery) {
    return productSchema
    .find({ ean: eanQuery })
    .remove()
    .exec();
  }
}

module.exports = new ProductModel(productSchema);
