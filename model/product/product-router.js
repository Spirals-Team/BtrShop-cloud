const controller = require('./product-controller');
const Router = require('express').Router;
const router = new Router();

router.route('/')
  .get((...args) => controller.find(...args))
  .post((...args) => controller.create(...args))
  .delete((...args) => controller.removeByEan(...args));

router.route('/:ean')
  // .put((...args) => controller.update(...args))
  // .delete((...args) => controller.remove(...args))
  .get((...args) => controller.findByEan(...args));

module.exports = router;
