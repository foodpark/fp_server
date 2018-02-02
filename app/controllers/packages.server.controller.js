/**
 * @author Sávio Muniz
 */

var ParseUtils = require('../utils/parseutils');

var Packages = require('../models/packages.server.model');
var PrePay = require('../controllers/prepay.server.controller');
var Users = require('../models/user.server.model');

exports.createPackage = createPackage;
exports.getPackage = getPackage;
exports.getCompanyPackages = getCompanyPackages;
exports.givePackage = givePackage;
exports.redeemPackage = redeemPackage;
exports.redeemMultiplePackages = redeemMultiplePackages;
exports.getUserGiftedPackages = getUserGiftedPackages;
exports.updatePackage = updatePackage;

const PACKAGE_NUMBER_OF_DIGITS = 15;

function * redeemMultiplePackages() {
  try {
    var packageCodes = this.body.package_codes;

    if (!packageCodes) {
      this.status = 400;
      this.body = { error : "You must provide a 'package_codes' field"};
    }

    if (!packageCodes.forEach) {
      this.status = 400;
      this.body = { error : "Input for 'package_codes' must be an array"};
    }

    var retrievePackagePromises = [];
    var packagesGiven = [];

    packageCodes.forEach(function (qrcode) {
      retrievePackagePromises.push(Packages.getQRCodeGivenPackage(qrcode));
    });

    var resolvePromises = Promise.all(retrievePackagePromises).then(function (retrievedPackages) {
      packagesGiven = retrievedPackages;

      return packagesGiven;
    });

    yield resolvePromises;

    var itResult = {
      success : true
    };

    var updatePromises = [];
    var transactionPromises = [];

    packagesGiven.some(function (packageGiven, index) {
      if (!packageGiven) {
        itResult.success = false;
        itResult.status = 404;
        itResult.body = { error : `Package '${packageCodes[index]}' does not exist`};
        return true;
      }

      else if (packageGiven.quantity < 1) {
        itResult.success = false;
        itResult.status = 404;
        itResult.body = { error : `Package '${packageCodes[index]}' is not available for this user anymore (quantity < 1)`};
        return true;
      }

      else {
        packageGiven.quantity--;

        updatePromises.push(Packages.updateGivenPackage(packageGiven.gifted_user, packageGiven.package, packageGiven.quantity));
        transactionPromises.push(PrePay.getPrepayTransactionPromise(packageGiven.id, 'package'));
      }
    });

    if (!itResult.success) {
      this.status = itResult.status;
      this.body = itResult.body;
      return;
    }    
    
    resolvePromises = Promise.all(updatePromises).then(function (updates) {
      return updates;
    });

    yield resolvePromises;

    resolvePromises = Promise.all(transactionPromises).then(function (transactions) {
      return transactions;
    });

    yield resolvePromises;

    this.status = 200;
    this.body = { message : "Packages were successfully redeemed"};
  } catch (err) {
    console.error("Error while updating multiple packages");
    throw err;
  }
}

function * getCompanyPackages() {
  try {
    var itemPackages = yield Packages.getCompanyPackages(this.params.companyId);

    this.status = 200;
    this.body = itemPackages;
  } catch (err) {
    console.error("error retrieving company's packages");
  }
}

function * updatePackage() {
  try {
    var body = this.body;

    var itemPackage = this.params.packageId;

    if (body.company) {
      this.status = 400;
      this.body = { error : "You cannot update a package's company"};
      return;
    }

    if (yield Packages.getActivePackageById(itemPackage)) {
      yield Packages.updatePackage({available : false}, itemPackage);
      var formerPackage = yield(Packages.getPackage(itemPackage));

      Object.keys(body).forEach(function (updatedField) {
        formerPackage[updatedField] = body[updatedField];
      });

      formerPackage.id = undefined;
      formerPackage.available = true;

      yield Packages.createPackage(formerPackage);

      this.status = 201;
      this.body = {message : "This package was still active, so another package was created with updated info, while former one was unactivated for future gifting"};
    }

    else {
      yield Packages.updatePackage(body, itemPackage);
      this.status = 200;
      this.body = {message : "Successfully updated"};
    }
  } catch (err) {
    console.error("error updating packages");
  }
}

function * getPackage() {
  try {
    var itemPackage = yield Packages.getPackage(this.params.packageId);

    if (!itemPackage) {
      this.status = 404;
      this.body = { error : 'package not found'};
      return;
    }

    this.status = 200;
    this.body = itemPackage;
  } catch (err) {
    console.error('error getting package');
    throw(err);
  }
}

function * createPackage() {
  var itemPackage = this.body;
  var userRole = this.passport.user.role;

  if (userRole !== 'FOODPARKMGR' && userRole !== 'OWNER' && userRole !== 'UNITMGR') {
    this.status = 401;
    return;
  }

  try {
    var createdPackage = yield Packages.createPackage(itemPackage);
    var response = { message : 'Package created successfully'};
    response.data = createdPackage;
    this.body = response;
    this.status = 201;
  } catch (err) {
    console.error('error creating package');
    throw(err);
  }
}

function * givePackage() {
  var giftedQuantity = this.body.quantity;
  var itemPackage = this.params.packageId;
  var giftedUser = this.params.userId;
  var creatorRole = this.passport.user.role;

  if (creatorRole !== 'FOODPARKMGR' && creatorRole !== 'OWNER' && creatorRole !== 'UNITMGR') {
    this.status = 401;
    this.body = {error : "Not an fpm/owner/unitmgr"};
    return;
  }

  giftedUser = (yield Users.getSingleUser(giftedUser))[0];
  itemPackage = yield Packages.getPackage(itemPackage);

  if (giftedUser.role !== 'CUSTOMER') {
    this.status = 406;
    this.body = {error : "You can only give packages to a CUSTOMER user"};
    return;
  }

  if (!itemPackage) {
    this.status = 404;
    this.body = {error : "No such package"};
    return;
  }

  var givenPackage = yield (Packages.getGivenPackage(giftedUser.id, itemPackage.id));

  if (!givenPackage) {
    var qrcode = undefined;

    while (!qrcode) {
      qrcode = ParseUtils.getRandomNumber(PACKAGE_NUMBER_OF_DIGITS);
      if (yield checkQRCodeExistence(qrcode))
        qrcode = undefined;
    }

    var packageCreated = yield Packages.createGivenPackage(giftedUser.id, itemPackage.id, giftedQuantity, qrcode);
    this.status = 200;
    this.body = { message : "Package was given to user"};
    this.body.data = packageCreated;
    return;
  }

  givenPackage.quantity += giftedQuantity;

  var packageUpdated = yield Packages.updateGivenPackage(giftedUser.id, itemPackage.id, givenPackage.quantity);
  this.status = 200;
  this.body = { message : "Package was given to user" };
  this.body.data = givenPackage;
}

function * checkQRCodeExistence(qrcode) {
  var packageGifted = yield Packages.getQRCodeGivenPackage(qrcode);
  return packageGifted !== undefined ;
}

function * redeemPackage() {
  var user = this.passport.user;
  var givenPackage = undefined;

  if (this.params.qrcode) {
    givenPackage = yield Packages.getQRCodeGivenPackage(this.params.qrcode);
  }

  else {
    var itemPackage = this.params.packageId;
    var giftedUser = this.params.userId;

    givenPackage = yield (Packages.getGivenPackage(giftedUser, itemPackage));
  }

  if (!givenPackage) {
    this.status = 404;
    this.body = { error : "No such package"};
    return;
  }

  if (givenPackage.quantity < 1) {
    this.status = 400;
    this.body = { error : "Package not available, quantity is 0"};
    return;
  }

  givenPackage.quantity--;

  var packageUpdated = yield Packages.updateGivenPackage(givenPackage.gifted_user, givenPackage.package, givenPackage.quantity);
  this.status = 200;
  this.body = { message : "Package successfully redeemed"};
  this.body.data = givenPackage;

  yield PrePay.registerPrepayTransaction(givenPackage.id, 'package');
}

function * getUserGiftedPackages() {
  var giftedUser = Number(this.params.userId);
  var loggedUser = this.passport.user;

  if (loggedUser.id !== giftedUser) {
    this.status = 401;
    this.body = { error : "User queried does not match authorization"};
    return;
  }

  var givenPackages = yield Packages.getUserGiftedPackages(giftedUser);

  this.status = 200;
  this.body = givenPackages.rows;
}



