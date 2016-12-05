const Router = require('express').Router;
const router = new Router();

const product  = require('./model/product/product-router');


router.use('/products', product);


module.exports = router;
