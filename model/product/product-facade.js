const Model = require('../../lib/facade');
const productSchema  = require('./product-schema');


class ProductModel extends Model {}

module.exports = new ProductModel(productSchema);
