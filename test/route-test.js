var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:8080");

describe("Routes test",function(){
  it("should return home page",function(done){
    server
    .get("/")
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      done();
    });
  });

  it("should return product list",function(done){
    server
    .get("/product")
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      done();
    });
  });

  it("should return 404",function(done){
    server
    .get("/random404")
    .expect(404)
    .end(function(err,res){
      res.status.should.equal(404);
      done();
    });
  });


});
