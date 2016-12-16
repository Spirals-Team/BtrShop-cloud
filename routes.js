const Router = require('express').Router;
const router = new Router();

const product  = require('./model/product/product-router');
const beacon   = require('./model/beacon/beacon-router');

router.use('/products', product);
router.use('/beacons', beacon);


module.exports = router;
