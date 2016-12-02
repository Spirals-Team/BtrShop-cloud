const Router = require('express').Router;
const router = new Router();

const product  = require('./model/product/product-router');


router.route('/').get((req, res) => {
  res.json({ message: 'Welcome to btrshop-cloud API!' });
});

router.use('/products', product);


module.exports = router;
