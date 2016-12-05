const Controller = require('../../lib/controller');
const positionModel  = require('./position-facade');
const util       = require('util');
const _          = require('underscore')._;

const findSchema = {

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

  const errors = req.validationErrors();
  if (errors) {
    return { message: `There have been validation errors: ${util.inspect(errors)}`, code: 400 };
  }

  return { message: null, code: 200 };
}

class PositionController extends Controller {

  find(req, res, next) {
    const resCheck = checkParam(req, req.query);

    if (resCheck.code !== 200) {
      res.status(resCheck.code).send(resCheck.message);
    } else {
      return this.model.find(req.query).populate('_creator')
      .then((collection) => {
        if (collection === null || collection.length === 0) {
          res.status(404).send('No position found with those params');
          return;
        }
        return res.status(200).json(collection);
      })
      .catch(err => next(err));
    }
  } // END : find

}

module.exports = new PositionController(positionModel);
