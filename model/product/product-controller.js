const Controller = require('../../lib/controller');
const productModel  = require('./product-facade');
const util       = require('util');

class ProductController extends Controller {

  removeByEan(req, res, next) {
    req.check('ean', "EAN is not valid.").notEmpty().isEan();

    var errors = req.validationErrors();
    if (errors) {
      res.send('There have been validation errors: ' + util.inspect(errors), 400);
      return;
    }

    this.model.removeByEan(req.query.ean)
    .then(doc => {
      if (!doc) { return res.status(404).end(); }
      return res.status(204).end();
    })
    .catch(err => next(err));
  } //END : removeByEan

  find(req, res, next) {

    req.check('ean', "EAN is not valid.").optional().isEan();

    var errors = req.validationErrors();
    if (errors) {
      res.send('There have been validation errors: ' + util.inspect(errors), 400);
      return;
    }

    return this.model.find(req.query)
    .then(collection => res.status(200).json(collection))
    .catch(err => next(err));
  } //END : find

}

module.exports = new ProductController(productModel);
