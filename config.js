const config = {
  environment: process.env.NODE_ENV || 'dev',
  server: {
    port: process.env.PORT || 8080
  },
  mongo: {
    url: process.env.MONGO_DB_URI || 'mongodb://localhost/btrshop-cloud'
  },
  swaggerurl: process.env.URL_SWAGGER || 'localhost:8080'
};

module.exports = config;
