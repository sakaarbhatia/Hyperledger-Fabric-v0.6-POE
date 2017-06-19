var _ = require('lodash');
var Q = require('q');
var logUtil = require('loggingUtility')
var hyperledger = require('./util/restTransaction.service.js')

var logger = logUtil.getLogger();

var service = {}

service.uploadHashData = uploadHashData;
service.retreiveHashData = retreiveHashData;
service.confirmTransaction = confirmTransaction
service.deployChaincode = deployChaincode;

module.exports = service;

/*
* UploadHashData : Service to upload data and hash
* PARAMS:
* hash
* data
*/
function uploadHashData(request) {
    var deferred = Q.defer();

    var hash = request.body.hash;
    var data = request.body.data;

    if (hash === undefined || hash == "") {
        deferred.reject("Incorrect hash arguement")
        logger.error("Incorrect hash arguement")
        return deferred.promise;
    }

    //Do transaction to hyperledger, add_hash_details function on chaincode
    hyperledger.invoke("add_hash_details", hash, data)
        .then(function(result) {
            deferred.resolve(result)
        })
        .catch(function(err) {
            deferred.reject(err)
        })

    return deferred.promise;
}

//service to call retreive function from rest api
// Query params : hash
function retreiveHashData(request) {

    var deferred = Q.defer();
    var hash = request.query.hash;

    if (hash === undefined || hash == "") {
        deferred.reject("Incorrect hash arguement")
        logger.error("Incorrect hash arguement")
        return deferred.promise;
    }

    //get result from hyperledger sending hash as arguement to get_hash_details on chaincode
    hyperledger.query("get_hash_details", hash)
        .then(function(result) {
            deferred.resolve(result)
        })
        .catch(function(err) {
            deferred.reject(err)
        })

    return deferred.promise;

}

//Hyperledger fabric retruns a transaction Id even if chaincode returns error but this transaction id is not confirmed and eventually gets lost
//To confirm if a transaction is valid this service is used
function confirmTransaction(request) {

    var deferred = Q.defer();
    var transaction = request.query.transaction;

    if (transaction === undefined || transaction == "") {
        deferred.reject("Incorrect transaction arguement")
        logger.error("Incorrect transaction arguement")
        return deferred.promise;
    }

    hyperledger.confirm(transaction)
        .then(function(result) {
            deferred.resolve(result)
        })
        .catch(function(err) {
            deferred.reject(err)
        })

    return deferred.promise;

}

function deployChaincode(request) {

    var deferred = Q.defer();
    var address = request.body.address;

    if (address === undefined || address == "") {
        deferred.reject("Incorrect address arguement")
        logger.error("Incorrect address arguement")
        return deferred.promise;
    }

    hyperledger.deploy(address)
        .then(function(result) {
            deferred.resolve(result)
        })
        .catch(function(err) {
            deferred.reject(err)
        })

    return deferred.promise;

}