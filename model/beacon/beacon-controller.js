const Controller = require('../../lib/controller');
const beaconFacade  = require('./beacon-facade');
const util       = require('util');
const _          = require('underscore')._;

const findSchema = {

};

function checkParam(req, params) {
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

class BeaconController extends Controller {

  updateBeacons(res, req, next){

    //TODO: call proximy

    return null;
  }

}

module.exports = new BeaconController(beaconFacade);
