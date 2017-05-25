const controller = require('./product-controller');
const Router = require('express').Router;
const router = new Router();

router.route('/')
  .get((...args) => controller.find(...args))
  .post((...args) => controller.create(...args))
  .delete((...args) => controller.removeByEan(...args));

router.route('/:ean')
  .get((...args) => controller.findByEan(...args))
  .post((...args) => controller.addPosition(...args));

module.exports = router;
