var debug = require('debug')('payload');

 var COMPANY_ELEMENTS = [ 'id', 'order_sys_id', 'base_slug', 'default_cat', 'daily_special_cat_id', 'delivery_chg_cat_id', 
  'delivery_chg_item_id', 'stub', 'created_at', 'updated_at' ]
 
 var ORDER_HIST_ELEMENTS = [ 'id', 'order_sys_order_id', 'amount', 'initiation_time', 'order_detail', 'checkin_id', 
  'customer_name', 'customer_id', 'unit_id', 'company_id', 'created_at']
 

 exports.testFn = function *(next) {
  console.log('testFn')
  debug('..tested')
};

 exports.limitCompanyPayloadForPut = function *(object) {
     // modifies object passed in
     debug('limitCompanyPayloadForPut')
     debug(COMPANY_ELEMENTS)
     debug(object)
     try {
         yield limitPayload(object, COMPANY_ELEMENTS);
     } catch (err) {
         console.error(err);
         throw(err);
     }
 }

 exports.limitOrderHistPayloadForPut = function *(object) {
     // modifies object passed in
     debug('limitOrderHistPayloadForPut')
     debug(ORDER_HIST_ELEMENTS)
     debug(object)
     try {
         yield limitPayload(object, ORDER_HIST_ELEMENTS);
     } catch (err) {
         console.error(err);
         throw(err);
     }
 }

 function * limitPayload(object, payloadElements) {
     var len = payloadElements.length
     for (var i=0; i<len; i++) {
         debug('...attribute '+ payloadElements[i])
        if (object.hasOwnProperty(payloadElements[i])) {
            debug('..before: '+ object[payloadElements[i]])
            delete object[payloadElements[i]]
            debug('..after: '+ object[payloadElements[i]])
        }
     }
 }


exports.simplifySpecial = function * (special) {
    debug('simplifySpecial');
    debug(special.title);
    var detail = {
        title : special.title,
        description : special.description,
        price : special.price.value
    }
    if (special.images) detail.image = special.images[0].url.http;
    debug(detail);
    return detail;
}


exports.simplifyItem = function * (item) {
    debug('simplifyItem');
    debug('..menu item ');
    debug(item.product.value);
    debug('..quantity ');
    debug(item.quantity);
    debug('..amount');
    var itemDetail = {
        title : item.product.value,
        quantity : item.quantity
    }
    if (item.product.data.modifiers) { 
        debug('..modifiers');
        var modifiers = item.product.data.modifiers;
        itemDetail.options = [];
        itemDetail.selections = {};
        for (var j in modifiers) {
            debug(modifiers[j].title);
            var mod = modifiers[j];
            debug(mod);
            if (!mod.type && mod.data.type.value == 'Variant') { // price associated with Variant
                debug(mod.data.title + ': '+ mod.var_title);
                itemDetail.selections[mod.data.title] = mod.var_title;
            } else { // option items or single selections
                var titles = [];
                if (mod.type.value == 'Variant') {
                    for (var k in mod.variations) {
                        var variation = mod.variations[k]
                        debug('... variant '+ variation.title);
                        debug('...'+ variation.id);
                        titles.push(variation.title);
                    }
                    itemDetail.selections[mod.title]=titles
                } else if (mod.type.value =='Single') {
                    for (var k in mod.variations) {
                        var variation = mod.variations[k]
                        debug('... option '+ variation.title);
                        debug('... id '+ variation.id);
                        debug('... parent '+ variation.modifier);
                        var options = item.options[variation.modifier];
                        if (options && options[variation.id] ) {
                            debug('... option '+ variation.title +' was selected');
                            titles.push(variation.title);
                        }
                    }
                    itemDetail.options = titles;
                }
            }
        }
    }
    return itemDetail;
}