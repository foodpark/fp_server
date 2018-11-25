const multer = require("multer");
const MIME_TYPE_MAP = {
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
};

const storege = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "app/wordfiles")
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + ".", ext);
  }
});

var knex  = require('../../config/knex');
var debug = require('debug')('church.model');


exports.createChurch = function(name) {
  return knex('churches').insert(
    {
      name: name
    }).returning('*');
};

exports.churchForChurchName = function(churchName) {
  return knex('churches').select('*').where('name', 'ILIKE', churchName)
};

exports.updateChurch = function(church_id, body) {
  return knex('churches').update({
    sponsor: body.sponsor,
    title: body.title,
    type: body.church_type,
    connected_with: body.connected_with,
    addendum_file: body.attachment,
    latitude: body.latitude,
    longitude: body.longitude,
    approved: body.approved
  }).where('id', church_id).returning('*');
}
