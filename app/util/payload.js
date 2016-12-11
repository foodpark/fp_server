 var debug = require('debug')('payload');

 
 var orderHistoryPayload = [ "actual_pickup_time", "desired_pickup_time", " prep_notice_time", "status", "messages"]
 
 exports.hardenOrderHistPutPayload = function *(object) {
     var payload = {}
     for (attr in orderHistoryPayload) {
         debug('...attribute '+ attr)
        if (object[attr]) {
            payload[attr] = object[attr]
            debug(object[attr])
        }
     }
     return payload;
 }

/*
  NO - id SERIAL PRIMARY KEY
  NO - order_sys_order_id text
  NO - amount money,
  NO - initiation_time timestamp,
  WHY DO WE NEED THIS, WE HAVE STATUS - payment_time timestamp,
  actual_pickup_time timestamp,
  desired_pickup_time timestamp,
  prep_notice_time timestamp,
  status json,
  messages text, -- json
  qr_code text,
  NO - manual_pickup boolean DEFAULT false,
  NO - order_detail json, -- json
  NO - checkin_id integer REFERENCES checkins(id),
  NO - customer_name text,
  NO - customer_id integer REFERENCES customers(id),
  NO - unit_id integer REFERENCES units(id),
  NO - company_id integer REFERENCES companies(id),
  NO - created_at timestamp without time zone DEFAULT now(),
  NO - updated_at timestamp without time zone DEFAULT now()
  */