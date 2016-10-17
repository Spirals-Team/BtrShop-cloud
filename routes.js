const Router = require('express').Router;
const router = new Router();

const user  = require('./model/user/user-router');
const product  = require('./model/product/product-router');


router.route('/').get((req, res) => {
  res.json({ message: 'Welcome to btrshop-cloud API!' });
});

router.use('/user', user);
router.use('/product', product);


module.exports = router;
