var debug = require('debug')('payload');

 
 var PAYLOAD_ELEMENTS = [ 'id', 'order_sys_order_id', 'amount', 'initiation_time', 'order_detail', 'checkin_id', 
  'customer_name', 'customer_id', 'unit_id', 'company_id', 'created_at']
 

 exports.testFn = function *(next) {
  console.log('testFn')
  debug('..tested')
};

 exports.limitOrderHistPayloadForPut = function *(object) {
     // modifies object passed in
     debug('limitOrderHistPayloadForPut')
     debug(PAYLOAD_ELEMENTS)
     debug(object)
     var len = PAYLOAD_ELEMENTS.length
     for (var i=0; i<len; i++) {
         debug('...attribute '+ PAYLOAD_ELEMENTS[i])
        if (object.hasOwnProperty(PAYLOAD_ELEMENTS[i])) {
            debug('..before: '+ object[PAYLOAD_ELEMENTS[i]])
            delete object[PAYLOAD_ELEMENTS[i]]
            debug('..after: '+ object[PAYLOAD_ELEMENTS[i]])
        }
     }
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