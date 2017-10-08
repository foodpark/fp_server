var debug = require('debug')('square');
var fs = require('fs');
var sts = require('./security.server.controller');
var User = require('../models/user.server.model');
var SquareUser = require('../models/squareuser.server.model');
var config = require('../../config/config');
var request = require('requestretry');
var timeUtils = require('../utils/timeutils');
var logger = require('winston');

const RENEWAL_TOLERANCE_IN_DAYS = 14; //number of days till expiration date that will make the api renew the code

function registerAccessToken(userId, accessToken, merchantId, expiresAt) {
    var squareUserRelationship = '';

    try {
        squareUserRelationship = SquareUser.createSquareUserRelationship(userId, accessToken, merchantId, expiresAt);
    } catch (err) {
        meta.error = err;
        logger.error('Error creating Square-User relationship', meta);
        throw (err);
    }
    debug('..Square-User relationship');
    debug(squareUserRelationship);
    squareUserRelationship.then(function (data) {
        console.log(data);
    });

    return squareUserRelationship;
}

function buildAccessToken(authorizationCode) {
    debug('oAuthSquare');
    return new Promise( function (resolve, reject) {
        request.post({
            url: config.squareAuthUrl,
            form: {
                'client_id': config.square.clientId,
                'client_secret': config.square.clientSecret,
                'code': authorizationCode,
                'redirect_uri': config.square.redirectUrl
            },
            maxAttempts: 3,
            retryDelay: 150 // wait for 150 ms before trying again
        })
        .then(function (res) {
            var data = JSON.parse(res.body);
            resolve(data);
        })
        .catch( function (err) {
            console.error(err);
            reject(err);
        });
    });
}

function isCloseToExpire(expirationDate) {
    
    var currentDate = new Date(1512086400000);
    return timeUtils.calculateInterval('day', currentDate.getTime(), expirationDate.getTime()) <= RENEWAL_TOLERANCE_IN_DAYS;
}

function requestRenew(accessToken) {
    debug('renewSquare');
    console.log(accessToken);
    console.log(config.squareRenewUrl);
    return new Promise( function (resolve, reject) {
        request.post({
            url: config.squareRenewUrl,
            headers: {
                'Authorization': 'Client  ' + config.square.clientSecret
            },
            form: {
                'access_token': accessToken
            },
            maxAttempts: 3,
            retryDelay: 150 // wait for 150 ms before trying again
        })
            .then(function (res) {
                var data = JSON.parse(res.body);
                resolve(data);
            })
            .catch( function (err) {
                console.error(err);
                reject(err);
            });
    });
}

async function updateAccessToken(accessToken, expirationDate, merchantId) {
    var updatedSquareInfo;
    try {
        updatedSquareInfo = await SquareUser.updateUserInfo(accessToken, expirationDate, merchantId);
        return updatedSquareInfo;
    } catch (err) {
        logger.error('Error updating Square-User relationship', meta);
        throw (err);
    }
}

async function renewToken(userId) {
    var squareUserRelPromise = await SquareUser.getByUser(userId);
    var squareUserRel = squareUserRelPromise[0];

    var shouldRenew = isCloseToExpire(squareUserRel.expires_at);

    if (shouldRenew) {
        var renewedSquareInfo = await requestRenew(squareUserRel.access_token);

        if (renewedSquareInfo.access_token)
            updateAccessToken(renewedSquareInfo.access_token, new Date(renewedSquareInfo.expires_at), renewedSquareInfo.merchant_id);
    }
}

// exports.renewToken = async function (userId) {
//     var squareUserRel = await SquareUser.getByUser(userId);
//
//
// };

exports.setUser = function *(userId, next){
    var user = undefined;

    if (!userId || userId === "") {
        this.status = 422;
        this.body = { error: 'Provide a valid user id'};
        return;
    }

    try {
        user = (yield User.getSingleUser(userId))[0];
    } catch (err) {
        console.error('register: error during registration');
        console.error(err);
        throw err;
    }

    if (!user) {
        this.status = 422;
        this.body = { error: 'User id provided does not exists'};
        return;
    }

    this.user = user;
    yield next;
};

exports.setupToken = async function (res) {
    renewToken(this.user.id);
    // var authenticationCode = this.body.authentication_code;
    // var result = await buildAccessToken(authenticationCode);
    //
    // if (result.access_token) {
    //      var accessToken = result.access_token;
    //      var expiresAt = result.expires_at;
    //      var merchantId = result.merchant_id;
    //
    //     logger.info("Getting user square access token");
    //     console.log("ACESS TOKEN: " + accessToken);
    //     console.log("EXPIRES AT: " + new Date(expiresAt));
    //     console.log("MERCHANT ID: " + merchantId);
    //
    //     registerAccessToken(this.user.id, accessToken, merchantId, expiresAt);
    // }
};