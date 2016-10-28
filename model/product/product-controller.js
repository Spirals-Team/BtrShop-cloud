const Controller = require('../../lib/controller');
const productModel  = require('./product-facade');
const util       = require('util');
const _          = require ('underscore')._;

var findSchema = {
 'ean': {
    in: 'query',
    optional: true,
    isEan: {
      errorMessage: '%0 is not a valid EAN'
    }
  },
  'name':{
    in: 'query',
    optional: true
  }
};

class ProductController extends Controller {

  removeByEan(req, res, next) {

    //Test for invalid params
    var correctParams = _.keys(findSchema);
    var queryParams =   _.keys(req.query);
    queryParams.forEach(function(param){
      if(correctParams.indexOf(param) == -1){
        res.send(param + " is not a valid param", 400);
        return;
      }
    });

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

    //Test for invalid params
    var correctParams = _.keys(findSchema);
    var queryParams =   _.keys(req.query);
    queryParams.forEach(function(param){
      if(correctParams.indexOf(param) == -1){
        res.send(param + " is not a valid param", 400);
        return;
      }
    });

    //Test known params
    req.check(findSchema);

    var errors = req.validationErrors();
    if (errors) {
      res.send('There have been validation errors: ' + util.inspect(errors), 400);
      return;
    }

    return this.model.find(req.query)
    .then(collection => res.status(200).json(collection))
    .catch(err => next(err));
  } //END : find

  findByEan(req, res, next) {
    
    //Test for invalid params
    var correctParams = _.keys(findSchema);
    var queryParams =   _.keys(req.query);
    queryParams.forEach(function(param){
      if(correctParams.indexOf(param) == -1){
        res.send(param + " is not a valid param", 400);
        return;
      }
    });

    //Test known params
    req.check('ean', "EAN is not valid.").notEmpty().isEan();

    var errors = req.validationErrors();
    if (errors) {
      res.send('There have been validation errors: ' + util.inspect(errors), 400);
      return;
    }

    return this.model.findOne(req.query)
    .then(collection => res.status(200).json(collection))
    .catch(err => next(err));
  } //END : find

}

module.exports = new ProductController(productModel);
