var Events = require('../models/podevents.server.model');
var TimeUtils = require('../utils/timeutils');

exports.createEvent = function * (next) {
  var event = this.body;

  var startDate = new Date(event.start_date);
  var endDate = new Date(event.end_date);

  var daysInterval = TimeUtils.calculateInterval('day', startDate.getTime(), endDate.getTime()) + 1;

  if (!isValidSchedule(event.schedule, daysInterval)) {
    this.status = 415;
    this.body = {error : 'you must provide a schedule with a length of 1 or the interval in days of the event'};
    return;
  }

  var response = yield registerEvent(this.body);
  this.status = 201;
  this.body = {message : 'event created', data : response};

  return;
};


function isValidSchedule(schedule, interval) {
  return schedule.length === 1 || schedule.length === interval;
}
