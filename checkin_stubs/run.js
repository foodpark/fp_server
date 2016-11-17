// get current date and time
// query for all stub companies and get their hours/days of operation
// filter result set to find companies that are currently checked-out and need to be checked-in
// apply this checkin via knex update
// filter result set to find companies that are currently checked-in and need to be checked-out
// apply this checkout via knex update
// Done.

var knex = require('../config/knex');

var currentDateTime = new Date();

console.log('current date and time: ' + currentDateTime);

var currHour = currentDateTime.getHours(); // TODO: account for time zone in sql query results

var doCheckIn = function(companyId) {
  // find all unit IDs for the company then check-in each unit
  // TODO: figure out how to get lat/long
  return knex.select('id','company_id').from('units').where('company_id', companyId)
    .then(function(units) {
      console.log("About to loop through each unit");
      units.forEach(function(row) {
        if (row.id) {
          console.log("Performing checkin insert for unit " + row.id);
          return doInsert(row.company_id, row.id);
        }
      });
    })
    .catch(function(err) { console.error('error: ' + err);});
}

var doInsert = function(companyId, unitId) {
  return knex('checkins').insert(
    {
      company_id: companyId,
      unit_id: unitId,
      check_in: '2016-11-17T01:49:23.123456Z'
    }
  );
}

var doCheckOut = function(companyId) {
  return knex.select('id','company_id').from('units').where('company_id', companyId)
    .then(function(units) {
      units.forEach(function(row) {
        if (units.id) {
          return knex('checkins').where(
          {
            company_id: row.company_id,
            unit_id: row.id
          }).del();
        }
      });
    })
    .catch(function(err) { console.error('error: ' + err);});
}

// Main logic

var currDayOfWeek = "";
switch (currentDateTime.getDay()) {
  case 0:
    currDayOfWeek = 'Su';
    break;
  case 1:
    currDayOfWeek = 'M';
    break;
  case 2:
    currDayOfWeek = 'Tu';
    break;
  case 3:
    currDayOfWeek = 'W';
    break;
  case 4:
    currDayOfWeek = 'Th';
    break;
  case 5:
    currDayOfWeek = 'F';
    break;
  case 6:
    currDayOfWeek = 'Sa';
    break;
}

console.log('Day of week: ' + currDayOfWeek);
console.log('Hour: ' + currHour);

var results;

knex.select('id', 'schedule', 'hours').from('companies').whereRaw('stub IS true AND schedule LIKE \'%' + currDayOfWeek + '%\'')
  .then(function(stubs) {
    stubs.forEach(function(row) {
      if (row.hours) {
        var splitHours = row.hours.split('-');
        if (splitHours && splitHours.length > 1) {
          console.log(splitHours[0]);
          var openHourRaw = splitHours[0];
          console.log(splitHours[1]);
          var closeHourRaw = splitHours[1];

          var openHour;
          if (openHourRaw.indexOf('a') > 0) {
            openHour = parseInt(openHourRaw.split('a'));
            if (openHour == 12) {
              openHour = 0; // 12am is 0 hours
            }
          } else if (openHourRaw.indexOf('p') > 0) {
            openHour = parseInt(openHourRaw.split('p'));
            if (openHour < 12) {
              openHour += 12;
            }
          } else {
            openHour = parseInt(openHourRaw);
          }
          console.log(openHour);

          var closeHour;
          if (closeHourRaw.indexOf('a') > 0) {
            closeHour = parseInt(closeHourRaw.split('a'));
            if (closeHour == 12) {
              closeHour = 0; // 12am is 0 hours
            }
          } else if (closeHourRaw.indexOf('p') > 0) {
            closeHour = parseInt(closeHourRaw.split('p'));
            if (closeHour < 12) {
              closeHour += 12;
            }
          } else {
            closeHour = parseInt(closeHourRaw);
          }
          console.log(closeHour);

          if (currHour == openHour) {
            console.log('Company ' + row.id + ' is open!');
            return doCheckIn(row.id);
          } else if (currHour == closeHour) {
            console.log('Company ' + row.id + ' is closed!');
            return doCheckOut(row.id);
          }
        } else {
          console.log("NOTHING");
        }
      } else {
        console.log("row.hours is false");
      }
    });
  })
  .catch(function(err) { console.error('error: ' + err);});
