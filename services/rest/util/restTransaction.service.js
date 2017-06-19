var config = require('configurations/rest/config-rest.json');
var creds = require('configurations/rest/credentials-rest.json');
var _ = require('lodash');
var Q = require('q');
var logUtil = require('loggingUtility')
var request = require("request");

var logger = logUtil.getLogger();

//set peer to query
var peer = "https://" + creds.peers[0].api_host + ":" + creds.peers[0].api_port;

var service = {}

service.deploy = deploy
service.invoke = invoke;
service.query = query;
service.confirm = confirm;

//final method to deploy using rest api call 
function deploy(address){

var deferred = Q.defer();

  var options = { 
    method: 'POST',
    url: peer + '/chaincode',
    headers: 
       { 'cache-control': 'no-cache' },
    body: '{' + 
      '"jsonrpc": "2.0",' + 
      '"method": "deploy",' +
      '"params": {' + 
      '"type": 1,' +
      '"chaincodeID": {' +
      '"path": "' + address + '"},' +
      '"ctorMsg": {' + 
      '"function": "init",'+
      '"args": []' +
      '},' +
      '"secureContext": "' + config.chainUser +'"},' +
      '"id": 0}' 
  };

request(options, function (error, response, body) {
    if (error){
        deferred.reject(error)
        logger.error("Deploy error :%s", error)
    }else{
        deferred.resolve(body);
    }  
});
  
return deferred.promise;

}


//final method to invoke using rest api call 
function invoke(fnName,hash,data){

  var deferred = Q.defer();

  var options = { 
    method: 'POST',
    url: peer + '/chaincode',
    headers: 
       { 'cache-control': 'no-cache' },
    body: '{' + 
      '"jsonrpc": "2.0",' + 
      '"method": "invoke",' +
      '"params": {' + 
      '"type": 1,' +
      '"chaincodeID": {' +
      '"name": "' + config.chaincodeId + '"},' +
      '"ctorMsg": {' + 
      '"function": "' + fnName + '",'+
      '"args": [ "' + hash + '", "'+ data +'" ]},' +
      '"secureContext": "' + config.chainUser +'"},' +
      '"id": 0}' 
  };

request(options, function (error, response, body) {
  if (error){
    deferred.reject(error)
    logger.error(error.stack)
  }else{
    var reply = JSON.parse(body)
    if(reply.result){
      deferred.resolve(reply.result.message);
    }
    else if(reply.error){
      deferred.reject(reply.error.data)
      logger.error("Invoke error :%s",reply.error.data)
    }else{
      deferred.reject(reply)
      logger.error(reply)
    }
  }
  
  });

  return deferred.promise;

}


//final method to query using rest api call 
function query(fnName,hash){

  var deferred = Q.defer();

  var options = { 
    method: 'POST',
    url: peer + '/chaincode',
    headers: 
    { 'cache-control': 'no-cache' },
    body: '{"jsonrpc": "2.0",' +
    '"method": "query",' +
    '"params": {    ' +
    '"type": 1,' +
    '"chaincodeID": {' +
    ' "name": "' + config.chaincodeId + '"},' +
    ' "ctorMsg": ' +
    '{ "function": "' + fnName + '",' +
    '"args": [ "'+ hash +'" ]    },' +
    '"secureContext": "' + config.chainUser +'"},' +
    '"id": 0' +
    '}'
  };

  request(options, function (error, response, body) {
  if (error){
    deferred.reject(error)
    logger.error(error.stack)
  }
  else{
    var reply = JSON.parse(body)
    if(reply.result){
      deferred.resolve(reply.result.message);
    }
    else if(reply.error){
      deferred.reject(reply.error.data)
      logger.error("Query error :%s",reply.error.data)
    }else{
      deferred.reject(reply)
      logger.error(reply)
    }
  }
  
  });

  return deferred.promise;

}


//final method to confirm transaction using rest api call 
function confirm(transaction){

  var deferred = Q.defer();

  var options = { 
    method: 'GET',
    url: peer + '/transactions/' + transaction,
    headers: { 'cache-control': 'no-cache'}
  };

  request(options, function (error, response, body) {
  if (error){
    deferred.reject(error)
    logger.error(error.stack)
  }
  else{
    var reply = JSON.parse(body)
    if(reply.Error){
      deferred.resolve("Error");
      logger.error("Confirmation error :%s",reply.Error)
    }else{
      deferred.resolve("Success")
    }
  }
  
  });

  return deferred.promise;

}

module.exports = service;



 