var Churches = require('../models/churches.server.model');

exports.updateChurch = function * () {
  try {
    const body = this.body;
    const church_id = this.params.churchId;

    yield Churches.updateChurch(church_id, body);
    this.status = 200;
    this.body = {message : "Successfully updated"};
  } catch(err) {
    logger.error('Error while updating church');
    throw (err);
  }
}
