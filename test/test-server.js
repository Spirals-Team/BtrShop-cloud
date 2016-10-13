var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
var should = chai.should();

chai.use(chaiHttp);


describe('Blobs', function() {

  it('should list ALL blobs on /user GET', function(done) {
    chai.request(server)
      .get('/user')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });

  it('should list a SINGLE blob on /user/<id> GET');
  it('should add a SINGLE blob on /users POST');
  it('should update a SINGLE blob on /user/<id> PUT');
  it('should delete a SINGLE blob on /user/<id> DELETE');
});
