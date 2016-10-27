var supertest = require("supertest");
var should = require("should");
var mongoose = require('mongoose');

// This agent refers to PORT where program is runninng.
var server = supertest.agent("http://localhost:8080");

//Sample produts
var parsedJSON = require('../mongo-seed/product.json');

describe("Products",function(){

  //Clean up db
  beforeEach(function(done) {
    mongoose.connect(process.env.MONGO_DB_URI || 'mongodb://localhost/btrshop-cloud', function(){
      mongoose.connection.db.dropDatabase(function(){
        //console.log('db drop') ;
        mongoose.connection.collection('products').insertMany(parsedJSON, function(err,r) {
          //console.log('db feeded');
          done();
        });
      });

    });
  });

  describe("Find",function(){
    it("should return list of product",function(done){
      server
      .get("/product")
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(200);
        res.body.length.should.be.eql(7);
        done();
      });
    });

    it("should return empty list of product cause of bad param",function(done){
      server
      .get("/product?test=0885909462872")
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(200);
        res.body.length.should.be.eql(0);
        done();
      });
    });

    it("should return empty list of product cause of empty param",function(done){
      server
      .get("/product?test=")
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(200);
        res.body.length.should.be.eql(0);
        done();
      });
    });

    it("should return a single product",function(done){
      server
      .get("/product?ean=0885909462872")
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(200);
        res.body.length.should.be.eql(1);
        done();
      });
    });

    it("should return a 400 cause of string ean",function(done){
      server
      .get("/product?ean=dfdfdffd")
      .expect("Content-type",/json/)
      .expect(400)
      .end(function(err,res){
        res.status.should.equal(400);
        done();
      });
    });

    it("should return a 400 cause of too short ean",function(done){
      server
      .get("/product?ean=123")
      .expect("Content-type",/json/)
      .expect(400)
      .end(function(err,res){
        res.status.should.equal(400);
        done();
      });
    });

    it("should return a 400 cause of too long ean",function(done){
      server
      .get("/product?ean=123456789123456789")
      .expect("Content-type",/json/)
      .expect(400)
      .end(function(err,res){
        res.status.should.equal(400);
        done();
      });
    });

  });

  describe("Add",function(){
    /*it("should add a single product",function(done){
      server
      .post("/product")
      .send({
        "name": "Fanta Limon 1l",
        "ean": "5449033017888",
        "description": "Boisson citronné avec des extraits de plantes. Rafraîchissant et vivifiant",
        "category": "Drink",
        "poids": "0.9"
      })
      .expect("Content-type",/json/)
      .set('Accept', 'application/json')
      .expect(201)
      .end(function(err,res){
        res.status.should.equal(201);
        server
        .get("/product")
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.length.should.be.eql(8);
          done();
        });
      });
    });*/

    it("should return an 404 error",function(done){
      server
      .post("/product")
      .send({
        "name": "Fanta Limon 1l",
        "ean": "5449033017888",
        "description": "Boisson citronné avec des extraits de plantes. Rafraîchissant et vivifiant",
        "category": "Drink",
        "poids": "0.9"
      })
      .expect("Content-type",/json/)
      .set('Accept', 'application/json')
      .expect(404)
      .end(function(err,res){
        res.status.should.equal(404);
        done();
      });
    });

  });


  describe("Remove",function(){
    it("should remove a single product",function(done){
      server
      .delete("/product")
      .query({ ean: '5449000017888' })
      .set('Accept', 'application/json')
      .expect(204)
      .end(function(err,res){
        server
        .get("/product")
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.length.should.be.eql(6);
          done();
        });
      });
    });

    it("should return a 400 cause of string ean",function(done){
      server
      .delete("/product")
      .query({ ean: 'dsfsdfd' })
      .set('Accept', 'application/json')
      .expect(400)
      .end(function(err,res){
        res.status.should.equal(400);
        done();
      });
    });

    it("should return a 400 cause of too short ean",function(done){
      server
      .delete("/product")
      .query({ ean: '123' })
      .set('Accept', 'application/json')
      .expect(400)
      .end(function(err,res){
        res.status.should.equal(400);
        done();
      });
    });

    it("should return a 400 cause of too long ean",function(done){
      server
      .delete("/product")
      .query({ ean: '123456798132456798' })
      .set('Accept', 'application/json')
      .expect(400)
      .end(function(err,res){
        res.status.should.equal(400);
        done();
      });
    });

    it("should return a 400 cause of not ean",function(done){
      server
      .delete("/product")
      .query({})
      .set('Accept', 'application/json')
      .expect(400)
      .end(function(err,res){
        res.status.should.equal(400);
        done();
      });
    });


  });

});
