var supertest = require("supertest");
var should = require("should");
var mongoose = require('mongoose');

// This agent refers to PORT where program is runninng.
var server = supertest.agent("http://localhost:8080");

//var db = mongoose.connect("mongodb://localhost:27017/btrshop-cloud");
//var ProductModel = mongoose.model("Product");

var parsedJSON = require('../mongo-seed/product.json');

describe("Products get test",function(){

  //Clean up db
  beforeEach(function(done) {
    mongoose.connect('mongodb://localhost:27017/btrshop-cloud', function(){
      mongoose.connection.db.dropDatabase(function(){
        //console.log('db drop') ;
      });
      mongoose.connection.collection('products').insertMany(parsedJSON, function(err,r) {
        //console.log('db feeded');
        done();
      });
    });
  });

  // #1 should return home page
  it("should return list of product",function(done){

    // calling home page api
    server
    .get("/product")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.length.should.be.eql(7);
      done();
    });

  });

  // #1 should return home page
  it("should return a single product",function(done){

    // calling home page api
    server
    .get("/product?ean=0885909462872")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.length.should.be.eql(1);
      done();
    });

  });

});
