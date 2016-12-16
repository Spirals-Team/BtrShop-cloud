const express    = require('express');
const mongoose   = require('mongoose');
const helmet     = require('helmet');
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const bluebird   = require('bluebird');
const expressValidator = require('express-validator');
const barcoder   = require('barcoder');

const config = require('./config');
const routes = require('./routes');

const app  = express();
const subpath    = express();
const swagger    = require('swagger-node-express').createNew(subpath);

mongoose.Promise = bluebird;
mongoose.connect(config.mongo.url);

// Validator options
const options = expressValidator({
  customValidators: {
    isEan(value) {
      return barcoder.validate(value);
    }
  }
});
// END : Validator options

app.use(helmet()); // secure Express/Connect apps with various HTTP headers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator(options)); // validator middleware
app.use(morgan('tiny')); // HTTP request logger middleware
app.use('/', routes);

// Swagger
app.use(express.static('dist'));
swagger.configureSwaggerPaths('', 'api-docs', '');
swagger.configure(`http://${config.swagger.url}:${config.swagger.port}`, '1.0.0');

app.listen(config.server.port, () => {
  console.log(`Magic happens on port ${config.server.port}`);
});

module.exports = app;
