const Model = require('../../lib/facade');
const positionSchema  = require('./position-schema');


class PositionModel extends Model {

}

module.exports = new PositionModel(positionSchema);
