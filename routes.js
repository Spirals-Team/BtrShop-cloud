const Router = require('express').Router;
const router = new Router();

const user  = require('./model/user/user-router');
const pet  = require('./model/pet/pet-router');


router.route('/').get((req, res) => {
  res.json({ message: 'Welcome to btrshop-cloud API!' });
});

router.use('/user', user);
router.use('/pet', pet);


module.exports = router;
