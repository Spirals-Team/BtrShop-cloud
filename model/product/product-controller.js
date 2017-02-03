const Controller = require('../../lib/controller');
const productFacade  = require('./product-facade');
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
  },
  position:{
    in: 'body',
    optional: true
  }
};

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function checkBeacon(beacons) {
  let queryCheck = { message: null, code: 200 };

  if (!Array.isArray(beacons))      {
    return { message: 'Positions are not an array', code: 400 };
  }

  beacons.forEach((beacon) => {

    if (!beacon.uuid || typeof (beacon.uuid) !== 'string') {
      queryCheck =  {
        message: `Uuid of Beacon : ${JSON.stringify(beacon)} is not valid.
      Require array of {"uuid": "string", "dist": 0}`,
        code: 400 };
      return;
    }

    if (!beacon.dist || !isNumber(beacon.dist)) {
      queryCheck =  {
        message: `Dist of beacon : ${JSON.stringify(beacon)} is not valid.
      Require array of {"uuid": "string", "dist": 0}`,
        code: 400 };
      return;
    }
  });

  return queryCheck;
}





function checkFutureArrayBeacon(query) {
  let queryCheck = { message: null, code: 200 };
  if (!query){
    return { message: `Param doesn't exists`, code: 400 };
  }
  let beaconsString = query.uuids
  // uuid existe
  if (!beaconsString){
    return { message: `Param uuids doesn't exists`, code: 400 };
  }
  // est une string
  if (!typeof beaconsString === 'string'){
    return { message: `Param list : ${JSON.stringify(beaconsString)} is not a string`, code: 400 };
  }
  return queryCheck;
}

function checkArrayBeacon(beacons) {
  let queryCheck = { message: null, code: 200 };

  if (!Array.isArray(beacons))      {
    return { message: 'Uuids are not an array', code: 400 };
  }

  beacons.forEach((beacon, index, beaconArray) => {
    if (beacon.indexOf("uuid") === -1){
      queryCheck = { message: `Bad param list : ${JSON.stringify(beacon)} no substring uuid found`, code: 400 };
    }
  });

  return queryCheck;
}

function checkParam(req, params, eanForced = false) {
  // Test for invalid params
  const correctParams = _.keys(findSchema);
  const queryParams =   _.keys(params);

  let queryCheck = null;

  queryParams.forEach((param) => {
    if (correctParams.indexOf(param) === -1) {
      queryCheck = { message: `${param} is not a valid param`, code: 400 };
    }
  });

  if (queryCheck) return queryCheck;


  // Test known params
  req.check(findSchema);

  // Test for ean if forced
  if (eanForced) {
    req.check('ean', 'EAN is not valid').notEmpty().isEan();
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
      res.status(resCheck.code).send(resCheck.message);
    } else {
      return productFacade
      .find(req.query)
      .then((collection) => {
        if (collection === null || collection.length === 0) {
          res.status(404).send('No product found with this ean');
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
      res.status(resCheck.code).send(resCheck.message);
    } else {
      return productFacade.findOne({ ean : req.params.ean })
      .then((collection) => {
        if (collection === null || collection.length === 0) {
          res.status(404).send('No product found with this ean');
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
      productFacade.removeByEan(req.query.ean)
      .then(doc => {
        if (!doc) { return res.status(404).end(); }
        return res.status(204).end();
      })
      .catch(err => next(err));
    } else {
      return res.status(resCheck.code).send(resCheck.message);
    }
  } // END : removeByEan

  findByBeacons(req, res, next){

    const resCheck = checkFutureArrayBeacon(req.query);
    if (resCheck.code !== 200) {
      res.status(resCheck.code).send(resCheck.message);
      return;
    }

    // explode
    var beacons = req.query.uuids.split("&");
    const resCheckTwo = checkArrayBeacon(beacons);

    if (resCheckTwo.code !== 200) {
      res.status(resCheckTwo.code).send(resCheckTwo.message);
      return;
    }

    beacons.forEach((beacon, index, beaconArray) => {
      beaconArray[index] = beacon.replace('uuid=', '');
    });

    return productFacade
    .findProductsByBeacons(beacons)
    .then((collection) => {
      if (collection === null || collection.length === 0) {
        res.status(404).send('No product found with those beacons');
        return;
      }
      return res.status(200).json(collection);
    })
    .catch(err => next(err));

  }




  addPosition(req, res, next) {
    const resCheck = checkBeacon(req.body);

    if (resCheck.code !== 200) {
      res.status(resCheck.code).send(resCheck.message);
    } else {
      productFacade.addPosition(req.params.ean, req.body)
      .then((collection) => {
        if (collection === null || collection.length === 0) {
          res.status(404).send('No product found with this ean');
          return;
        }
        return res.status(200).json(collection);
      })
      .catch(err => next(err));
    }
  } // END : addPosition

}

module.exports = new ProductController(productFacade);
