var knex  = require('../../config/knex');
var debug = require('debug')('squareuser.model');

const USER_ID_FIELD = "user_id";

exports.createSquareUserRelationship = function(userId, accessToken, merchantId, expiresAt) {
    return knex('square_user').insert(
        {
            user_id : userId,
            access_token: accessToken,
            merchant_id: merchantId,
            expires_at: new Date(expiresAt)
        }).returning('*');
};


exports.getAllSquare = function() {
    return knex('square_user').select();
};

exports.getByUser = function (userId) {
    return knex('square_user').select().where(USER_ID_FIELD, userId).returning("*");
};

exports.updateUserInfo = function(userId, accessToken, expirationDate, merchantId) {
    const map = {
        access_token : accessToken,
        expires_at : expirationDate,
        merchant_id : merchantId
    };
    console.log(map);
    return knex('square_user').update(map).where(USER_ID_FIELD, userId).returning("*");
};