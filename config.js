const config = {
  environment: process.env.NODE_ENV || 'dev',
  server: {
    port: process.env.PORT || 8080
  },
  mongo: {
    url: process.env.MONGO_DB_URI || 'mongodb://localhost/btrshop-cloud'
  },
  proximi: {
    email: process.env.PROXIMI_EMAIL || 'hamann.denis@gmail.com',
    password: process.env.PROXIMI_PASS || 'blinds'
  },
  swagger:{
    url: process.env.SWAGGER_URL || 'localhost',
    port : process.env.SWAGGER_PORT || '8080'
  }
};

module.exports = config;
