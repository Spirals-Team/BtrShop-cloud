var supertest = require("supertest");
var should = require("should");
var mongoose = require('mongoose');

// This agent refers to PORT where program is runninng.
var server = supertest.agent("http://localhost:8080");

//Sample produts
var parsedJSON = require('../mongo-seed/product.json');

describe("Products get test",function(){

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

  it("should return list of product",function(done){
    server
    .get("/product")
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      if(err){
        done(err);
      }
      res.status.should.equal(200);
      res.body.length.should.be.eql(7);
      done();
    });
  });

  it("should return a single product",function(done){

    server
    .get("/product?ean=0885909462872")
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      if(err){
        done(err);
      }
      res.status.should.equal(200);
      res.body.length.should.be.eql(1);
      done();
    });

  });

  it("should add a single product",function(done){

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
      if(err){
        done(err);
      }

      res.status.should.equal(201);

      server
      .get("/product")
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        if(err){
          done(err);
        }

        res.status.should.equal(200);
        res.body.length.should.be.eql(8);
        done();
      });
    });



  });

  it("should remove a single product",function(done){

    server
    .delete("/product")
    //.expect("Content-type",/json/)
    .query({ ean: '5449000017888' })
    .set('Accept', 'application/json')
    .expect(204)
    .end(function(err,res){
      if(err){
        done(err);
      }

      server
      .get("/product")
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        if(err){
          done(err);
        }
        res.status.should.equal(200);
        res.body.length.should.be.eql(6);
        done();
      });
    });



  });

});
