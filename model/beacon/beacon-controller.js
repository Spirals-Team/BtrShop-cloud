const Controller = require('../../lib/controller');
const beaconFacade  = require('./beacon-facade');
const rp         = require('request-promise');
const config     = require('../../config');


const optionsAuthProximy = {
  method: 'POST',
  uri: 'https://api.proximi.fi/core_auth/login',
  form: {
    email: config.proximi.email,
    password: config.proximi.password // Will be urlencoded
  },
  headers: {
        /* 'content-type': 'application/x-www-form-urlencoded' */ // Set automatically
  }
};


class BeaconController extends Controller {

  updateBeacons(req, res, next) {

    // 2 steps : getToken from proximi then getInputs
    rp(optionsAuthProximy)
      .then((body) => {
        const token = JSON.parse(body).token;

        const optionsProximy = {
          method: 'GET',
          uri: 'https://api.proximi.fi/core/inputs',
          qs: {
            access_token: token // -> uri + '?access_token=xxxxx%20xxxxx'
          },
          headers: {
            'User-Agent': 'Request-Promise',
            'Content-type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${token}`
          },
          resolveWithFullResponse: true
        };
        return rp(optionsProximy);
      })
      .then((inputs) => {
        const beacons = JSON.parse(inputs.body);
        return beaconFacade.updateBeacons(beacons);
      })
      .then(collection => res.status(200).json(collection))
      .catch(err => next(err));

    return null;
  }

}

module.exports = new BeaconController(beaconFacade);
