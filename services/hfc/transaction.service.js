var config = require('configurations/hfc/config-hfc.json');
var _ = require('lodash');
var Q = require('q');
var logUtil = require('loggingUtility')

var hfcTransactionUtil = require('./util/hfcTransaction.service')
var chainUser = "WebAppAdmin" // we are using single user for demo purposes

var logger = logUtil.getLogger();

var service = {}

service.uploadHashData = uploadHashData;
service.retreiveHashData = retreiveHashData;
service.deployChaincode = deployChaincode;
service.confirmTransaction = confirmTransaction;

module.exports = service;

//service to prepare invoke param
function uploadHashData(request) {
    var deferred = Q.defer();

    var hash = request.body.hash;
    var data = request.body.data;

    if (hash === undefined || hash == "") {
        deferred.reject("Incorrect hash arguement")
        logger.error("Incorrect hash arguement")
        return deferred.promise;
    }

    invokeRequest = {
      // Name (hash) required for query
        chaincodeID: config.chaincodeId,
        // Function to trigger
        fcn: "add_hash_details",
        // Existing state variable to retrieve
        args: [hash, data]
    }
    //Do transaction to hyperledger bluemix
    hfcTransactionUtil.invoke(chainUser, invokeRequest)
        .then(function(data) {
            deferred.resolve(data)
        }).catch(function() {
            deferred.reject(err)
        })

    return deferred.promise;
}


//service to prepare hfc request param
function retreiveHashData(request) {

    var deferred = Q.defer();
    var hash = request.query.hash;

    if (hash === undefined || hash == "") {
        deferred.reject("Incorrect hash arguement")
        logger.error("Incorrect hash arguement")
        return deferred.promise;
    }

    //get result from hyperledger send ing hash as arguement
    var queryRequest = {
        // Name (hash) required for query
        chaincodeID: config.chaincodeId,
        // Function to trigger
        fcn: "get_hash_details",
        // Existing state variable to retrieve
        args: [hash]
    };

    hfcTransactionUtil.query(chainUser, queryRequest)
        .then(function(data) {
            deferred.resolve(data)
        }).catch(function() {
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

    hfcTransactionUtil.confirm(transaction)
        .then(function(result) {
            deferred.resolve(result)
        })
        .catch(function(err) {
            deferred.reject(err)
        })

    return deferred.promise;

}

//Service to deploy chaincode
function deployChaincode(request) {

    var deferred = Q.defer();

    hfcTransactionUtil.deploy(chainUser)
        .then(function(result) {
            deferred.resolve(result)
        })
        .catch(function(err) {
            deferred.reject(err)
        })

    return deferred.promise;

}