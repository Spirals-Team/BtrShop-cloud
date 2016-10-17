const Controller = require('../../lib/controller');
const productModel  = require('./product-facade');


class ProductController extends Controller {

  removeByEan(req, res, next) {
    
    this.model.removeByEan(req.query.ean)
    .then(doc => {
      if (!doc) { return res.status(404).end(); }
      return res.status(204).end();
    })
    .catch(err => next(err));
  }

}

module.exports = new ProductController(productModel);
