/* eslint-env mocha */
const supertest = require('supertest');
const should = require('should');
const mongoose = require('mongoose');
const config = require('../config');

/* For local test for coverage, start with : sudo docker-compose -f docker-compose.test.yml -p ci up */
const app = require('../index.js');
const server = supertest.agent(app);

// Sample produts
const parsedProducts = require('../mongo-seed/product.json');
const parsedBeacons = require('../mongo-seed/beacons.json');


describe('Products', () => {

  // Clean up product db
  beforeEach((done) => {
    mongoose.connection.collections['products'].drop(error => {
      mongoose.connection.collection('products').insertMany(parsedProducts, (err, r) => {
        done();
      });
    });
  });

  describe('Find', () => {
    it('should return list of product', (done) => {
      server
      .get('/products')
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.body.length.should.be.eql(3);
        done();
      });
    });

    it('should return 400 cause of bad param', (done) => {
      server
      .get('/products?test=0885909462872')
      .expect('Content-type', /json/)
      .expect(400)
      .end((err, res) => {
        done();
      });
    });

    it('should return 400 cause of empty param', (done) => {
      server
      .get('/products?test=')
      .expect('Content-type', /json/)
      .expect(400)
      .end((err, res) => {
        done();
      });
    });

    it('should return a 400 cause of string ean', (done) => {
      server
      .get('/products?ean=dfdfdffd')
      .expect('Content-type', /json/)
      .expect(400)
      .end((err, res) => {
        done();
      });
    });

    it('should return a 400 cause of too short ean', (done) => {
      server
      .get('/products?ean=123')
      .expect('Content-type', /json/)
      .expect(400)
      .end((err, res) => {
        done();
      });
    });

    it('should return a 400 cause of too long ean', (done) => {
      server
      .get('/products?ean=123456789123456789')
      .expect('Content-type', /json/)
      .expect(400)
      .end((err, res) => {
        done();
      });
    });


    it('should return a array with one single product', (done) => {
      server
      .get('/products?ean=0885909462872')
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.body.length.should.be.eql(1);
        done();
      });
    });

    it('should return an 404 because product dont exist', (done) => {
      server
      .get('/products?ean=3072665220052')
      .expect('Content-type', /json/)
      .expect(404)
      .end((err, res) => {
        done();
      });
    });

    it('should return a single product', (done) => {
      server
      .get('/products/0885909462872')
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.body.ean.should.equal('0885909462872');
        done();
      });
    });

    it('should return an 404 because product dont exist', (done) => {
      server
      .get('/products/3072665220052')
      .expect('Content-type', /json/)
      .expect(404)
      .end((err, res) => {
        done();
      });
    });

    it('should return a 400 cause of string ean', (done) => {
      server
      .get('/products/azeqds')
      .expect('Content-type', /json/)
      .expect(400)
      .end((err, res) => {
        done();
      });
    });

    it('should return a 400 cause of bad ean', (done) => {
      server
      .get('/products/132456')
      .expect('Content-type', /json/)
      .expect(400)
      .end((err, res) => {
        done();
      });
    });

  });

  describe('Add', () => {

    it('should add a single product', (done) => {
      server
      .post('/products')
      .send({
        brand: 'Coca Cola',
        category: '/Alimentaire/Boissons/Sodas',
        color: 'Jaune',
        description: 'Boisson citronné avec des extraits de plantes. Rafraîchissant et vivifiant',
        ean: '5449033017888',
        height: {
          value: 0.4,
          unitcode: 'MTR',
          unitText: 'm'
        },
        logo: 'http://cdn.pymesenlared.es/img/136/1727/45696/0x1200/fanta-limon-1l.jpg',
        offers: [
          {
            price: 1.29,
            priceCurrency: '€',
            validFrom: '2016-10-02T17:32:16.777Z',
            validThrough: '2016-12-02T17:32:16.777Z'
          }
        ],
        model: '1l',
        name: 'Fanta Limon 1l',
        weight: {
          value: 1.1,
          unitcode: 'KGM',
          unitText: 'kg'
        }
      })
      .expect('Content-type', /json/)
      .set('Accept', 'application/json')
      .expect(201)
      .end((err, res) => {
        res.status.should.equal(201);
        server
        .get('/products')
        .expect('Content-type', /json/)
        .expect(200)
        .end((err, res) => {
          res.body.length.should.be.eql(4);
          done();
        });
      });
    });
  });


  describe('Remove', () => {
    it('should remove a single product', (done) => {
      server
      .delete('/products')
      .query({ ean: '5449000017888' })
      .set('Accept', 'application/json')
      .expect(204)
      .end((err, res) => {
        server
        .get('/products')
        .expect('Content-type', /json/)
        .expect(200)
        .end((err, res) => {
          res.body.length.should.be.eql(2);
          done();
        });
      });
    });

    it('should return a 400 because product dont exist', (done) => {
      server
      .delete('/products')
      .query({ ean: '3072665220052' })
      .set('Accept', 'application/json')
      .expect(404)
      .end((err, res) => {
        done();
      });
    });

    it('should return a 400 cause of string ean', (done) => {
      server
      .delete('/products')
      .query({ ean: 'dsfsdfd' })
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        done();
      });
    });

    it('should return a 400 cause of too short ean', (done) => {
      server
      .delete('/products')
      .query({ ean: '123' })
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        done();
      });
    });

    it('should return a 400 cause of too long ean', (done) => {
      server
      .delete('/products')
      .query({ ean: '123456798132456798' })
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        done();
      });
    });

    it('should return a 400 cause of not ean', (done) => {
      server
      .delete('/products')
      .query({})
      .set('Accept', 'application/json')
      .expect(400)
      .end((err, res) => {
        done();
      });
    });


  });

  describe('Add position', () => {

    // Clean up beacon dbs
    beforeEach((done) => {
      mongoose.connection.collections['beacons'].drop(error => {
        mongoose.connection.collection('beacons').insertMany(parsedBeacons, (err, r) => {
          done();
        });
      });
    });


    it('should add positions', (done) => {
      server
      .post('/products/5449000017888')
      .send(
        [
          {
            uuid: "D0D3FA86-CA76-45EC-9BD9-6AF4278200B9",
            dist: 0.02
          },
          {
            uuid: "D0D3FA86-CA76-45EC-9BD9-6AF4C304C06A",
            dist: 0.03
          },
          {
            uuid: "D0D3FA86-CA76-45EC-9BD9-6AF4AD649F44",
            dist: 0.04
          }
        ]
      )
      .expect('Content-type', /json/)
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        res.body.positions.length.should.be.equal(1);

        // Test positions arrays
        res.body.positions[0].lat.should.be.a.Number();
        res.body.positions[0].lng.should.be.a.Number();
        res.body.positions[0].date.should.be.a.String();

        // Test trilateration
        res.body.averagePosition.lat.should.be.equal(res.body.positions[0].lat);
        res.body.averagePosition.lng.should.be.equal(res.body.positions[0].lng);
        res.body.averagePosition.date.should.be.a.String();

        // Test beacons count
        res.body.beacons.length.should.be.equal(3);
        res.body.beacons[0].uuid.should.be.a.String();
        res.body.beacons[0].count.should.be.a.Number();

        done();
      });
    });

    it('should add beacons to list without position cause only one beacon sent', (done) => {
      server
      .post('/products/5449000017888')
      .send(
        [
          {
            uuid: "D0D3FA86-CA76-45EC-9BD9-6AF4278200B9",
            dist: 0.02
          }
        ]
      )
      .expect('Content-type', /json/)
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        res.body.positions.length.should.be.equal(0);

        // Test beacons count
        res.body.beacons.length.should.be.equal(1);
        res.body.beacons[0].uuid.should.be.a.String();
        res.body.beacons[0].count.should.be.a.Number();

        done();
      });
    });

    it('should add beacons to list without position cause same beacons sent', (done) => {
      server
      .post('/products/5449000017888')
      .send(
        [
          {
            uuid: "D0D3FA86-CA76-45EC-9BD9-6AF4278200B9",
            dist: 0.02
          },
          {
            uuid: "D0D3FA86-CA76-45EC-9BD9-6AF4278200B9",
            dist: 0.03
          },
          {
            uuid: "D0D3FA86-CA76-45EC-9BD9-6AF4278200B9",
            dist: 0.04
          }
        ]
      )
      .expect('Content-type', /json/)
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        res.body.positions.length.should.be.equal(0);

        // Test beacons count
        res.body.beacons.length.should.be.equal(1);
        res.body.beacons[0].uuid.should.be.a.String();
        res.body.beacons[0].count.should.be.a.Number();

        done();
      });
    });

    it('should add double positions', (done) => {

      server
      .post('/products/5449000017888')
      .send(
        [
          {
            uuid: "D0D3FA86-CA76-45EC-9BD9-6AF4278200B9",
            dist: 0.02
          },
          {
            uuid: "D0D3FA86-CA76-45EC-9BD9-6AF4C304C06A",
            dist: 0.03
          },
          {
            uuid: "D0D3FA86-CA76-45EC-9BD9-6AF4AD649F44",
            dist: 0.04
          }
        ]
      )
      .expect('Content-type', /json/)
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {

        // Second send to try count
        server
        .post('/products/5449000017888')
        .send(
          [
            {
              uuid: "D0D3FA86-CA76-45EC-9BD9-6AF4278200B9",
              dist: 0.01
            },
            {
              uuid: "D0D3FA86-CA76-45EC-9BD9-6AF4694F32B0",
              dist: 0.05
            },
            {
              uuid: "D0D3FA86-CA76-45EC-9BD9-6AF4AD649F44",
              dist: 0.02
            }
          ]
        )
        .expect('Content-type', /json/)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          res.body.positions.length.should.be.equal(2);

          // Test positions arrays
          res.body.positions[0].lat.should.be.a.Number();
          res.body.positions[0].lng.should.be.a.Number();
          res.body.positions[0].date.should.be.a.String();

          // Test beacons count
          res.body.beacons.length.should.be.equal(4);
          res.body.beacons[0].uuid.should.be.a.String();
          res.body.beacons[0].count.should.be.a.Number();

          done();
        }); // End of second end function
      }); // End of first end function
    }); // End of test double addPosition
  });//End : describe : addPosition
});
