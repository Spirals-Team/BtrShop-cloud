const Controller = require('../../lib/controller');
const productModel  = require('./product-facade');


class ProductController extends Controller {}

module.exports = new ProductController(productModel);
