const Model = require('../../lib/facade');
const productSchema  = require('./product-schema');

class ProductModel extends Model {

  removeByEan(eanQuery) {
    return productSchema
    .find({ ean: eanQuery })
    .remove()
    .exec();
  }

  addPosition(eanQuery, position) {
    return productSchema
      .findOne({ ean: eanQuery })
      .exec((err, product) => {
        product.positions.push(position);
        return productSchema.update({ ean: eanQuery }, product, { upsert: true }).exec();
      });
  }
}

module.exports = new ProductModel(productSchema);
