const Controller = require('../../lib/controller');
const productModel  = require('./product-facade');
const util       = require('util');
const _          = require('underscore')._;

const findSchema = {
  ean: {
    in: 'query',
    optional: true,
    isEan: {
      errorMessage: '%0 is not a valid EAN'
    }
  },
  name:{
    in: 'query',
    optional: true
  }
};

function checkParam(req, params, eanForced = false) {
  // Test for invalid params
  const correctParams = _.keys(findSchema);
  const queryParams =   _.keys(params);

  let queryCheck = null;
  queryParams.forEach((param) => {
    if (correctParams.indexOf(param) === -1) {
      queryCheck = { message: `${param} is not a valid param`, code: 400 };
    }
    return null;
  });
  if (queryCheck)    { return queryCheck; }

  // Test known params
  req.check(findSchema);

  // Test for ean if forced
  if (eanForced)    {
    req.check('ean', 'EAN is not valid.').notEmpty().isEan();
  }


  const errors = req.validationErrors();
  if (errors) {
    return { message: `There have been validation errors: ${util.inspect(errors)}`, code: 400 };
  }

  return { message: null, code: 200 };
}

class ProductController extends Controller {

  find(req, res, next) {
    const resCheck = checkParam(req, req.query);

    if (resCheck.code !== 200) {
      res.send(resCheck.message, resCheck.code);
    } else {
      return this.model.find(req.query)
      .then((collection) => {
        if (collection === null || collection.length === 0) {
          res.send('No product found with this ean', 404);
          return;
        }
        return res.status(200).json(collection);
      })
      .catch(err => next(err));
    }
  } // END : find

  findByEan(req, res, next) {
    const resCheck = checkParam(req, req.params, true);

    if (resCheck.code !== 200) {
      res.send(resCheck.message, resCheck.code);
    } else {
      return this.model.findOne({ ean : req.params.ean })
      .then((collection) => {
        if (collection === null || collection.length === 0) {
          res.send('No product found with this ean', 404);
          return;
        }
        return res.status(200).json(collection);
      })
      .catch(err => next(err));
    }
  } // END : find


  removeByEan(req, res, next) {
    const resCheck = checkParam(req, req.query, true);

    if (resCheck.code === 200) {
      this.model.removeByEan(req.query.ean)
      .then(doc => {
        if (!doc) { return res.status(404).end(); }
        return res.status(204).end();
      })
      .catch(err => next(err));
    } else {
      return res.send(resCheck.message, resCheck.code);
    }
  } // END : removeByEan

}

module.exports = new ProductController(productModel);
