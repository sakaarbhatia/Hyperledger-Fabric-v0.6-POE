var config = require('configurations/hfc/config-hfc.json');
var credentials = require('configurations/hfc/credentials-hfc.json');
var _ = require('lodash');
var Q = require('q');
var fs = require('fs');
var logUtil = require('loggingUtility')
var hfc = require('hfc');
var request = require('request')

var logger = logUtil.getLogger();

var chain;
var certificate_path = credentials.cert_path
var chaincodeUrl = "chaincode/"

var service = {}

service.setup = setup
service.deploy = deploy
service.invoke = invoke;
service.query = query;
service.confirm = confirm

function setup(myChain) {
    if (!myChain)
        throw new Error('Transaction manager requires a chain object');
    chain = myChain;
}


//Final interactio to fabric for deployment
function deploy(enrolledUser, cert_path, argsArray) {

    var deferred = Q.defer();

    // Fix for the SDK.  Need to make sure a `/tmp` directory exists to tarball chaincode
    try {
        if (!fs.existsSync('/tmp')) {
            console.log('No /tmp directory. Creating /tmp directory');
            fs.mkdirSync('/tmp');
        }
    } catch (err) {
        console.error('Error creating /tmp directory for chaincode:', err.message);
        logger.error('Error creating /tmp directory for chaincode: %s', err.message)
    }

    var deployRequest = {
        fcn: 'init',
        args: [],
        chaincodePath: chaincodeUrl,
        certificatePath: cert_path
    };
            try{
                var deployTx = enrolledUser.deploy(deployRequest);
            deployTx.on('submitted', function(results) {});

            deployTx.on('complete', function(results) {
                deferred.resolve(results.chaincodeID);
            });

            deployTx.on('error', function(err) {
               logger.error('Deploy Error: %s', err)
                deferred.reject(err);
            });
        

            }
            catch(err){
                logger.error('Deploy Error: %s', err)
                console.log(err)
            }

    return deferred.promise;


}


//Final interactio to fabric for invoke
function invoke(enrollID, invokeRequest) {

    var deferred = Q.defer();

    chain.getMember(enrollID, function(getMemberError, usr) {
        if (getMemberError) {
            logger.error('Invoke Error: %s', getMemberError)
            reject(getMemberError);
        } else {
            var invokeTx = usr.invoke(invokeRequest);
            // Print the invoke results
            invokeTx.on('complete', function(results) {
                // Invoke transaction submitted successfully
                deferred.resolve(results.result);
            });
            invokeTx.on('submitted', function(results) {
                // Invoke transaction submitted successfully
            });
            invokeTx.on('error', function(err) {
                 logger.error('Invoke Error: %s', err)
                deferred.reject(err);
            });
        }
    });


    return deferred.promise;

}


//Final interactio to fabric for query
function query(enrollID, queryRequest) {

    var deferred = Q.defer();

    // Submit the invoke transaction as the given user
    chain.getMember(enrollID, function(getMemberError, usr) {
        if (getMemberError) {
            deferred.reject(getMemberError);
            logger.error('Query Error: %s', getMemberError)
        } else {
            var queryTx = usr.query(queryRequest);
            queryTx.on('complete', function(results) {
                deferred.resolve(results.result.toString());
            });
            queryTx.on('error', function(err) {
                deferred.reject(err);
                logger.error('Query Error: %s', err)
            });
        }
    });

    return deferred.promise;

}


//Final interactio to fabric for confirmation : uses rest service and not hfc
function confirm(transaction){

  var deferred = Q.defer();

  var options = { 
    method: 'GET',
    url: credentials.peers[0].api_url + '/transactions/' + transaction,
    headers: { 'cache-control': 'no-cache'}
  };

  request(options, function (error, response, body) {
  if (error){
    deferred.reject(error)
     logger.error('Confirmation Error: %s', error)
  }
  else{
    var reply = JSON.parse(body)
    if(reply.Error){
      deferred.resolve("Error");
       logger.error("Transaction not found : %s", transaction)
    }else{
      deferred.resolve("Success")
    }
  }
  
  });

  return deferred.promise;

}


module.exports = service;