/* eslint-env mocha */
const trilateration = require('../util/trilateration');
const assert = require('assert');
const mathjs = require('mathjs');


describe('Trilateration', () => {

  it('should raise an exception because two beacons have the same geoloc', (done) => {
    const beacons = [];
    beacons.push(new trilateration.Beacon(12, 12, 2));
    beacons.push(new trilateration.Beacon(12, 12, 4));
    beacons.push(new trilateration.Beacon(36, 54, 18));
    assert.throws(() => trilateration.trilaterate(beacons), TypeError, 'Error thrown');
    done();
  });

  it('tests simple trilateration', (done) => {
    const beacons = [];
    beacons.push(new trilateration.Beacon(37.418436, -121.963477, 0.265710701754));
    beacons.push(new trilateration.Beacon(37.417243, -121.961889, 0.234592423446));
    beacons.push(new trilateration.Beacon(37.418692, -121.960194, 0.0548954278262));
    const res = trilateration.trilaterate(beacons);
    mathjs.round(res.lat, 10).should.be.eql(mathjs.round(37.41910237382539, 10));
    mathjs.round(res.lng, 10).should.be.eql(mathjs.round(-121.96057920839236, 10));
    done();
  });

});
