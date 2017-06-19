var express = require('express');
var router = express.Router();
var transactionService = require('services/hfc/transaction.service');
var deployService = require('services/hfc/hyperledger.service');

router.post("/upload", uploadData)
router.get("/retreive", retreiveData)
router.post("/deploy", deploy)
router.get("/confirmTransaction", confirmTransaction)
router.get("/", initialise)


//Api for upload hash and data
function uploadData(req, res, next) {
    transactionService.uploadHashData(req)
        .then(function(data) {
            res.send(data);
        })
        .catch(function(err) {
            res.status(400).send(err);
        })
}


//Api for retreiving hash and data using hash as query param
function retreiveData(req, res, next) {
    transactionService.retreiveHashData(req)
        .then(function(data) {
            res.send(data);
        })
        .catch(function(err) {
            res.status(400).send(err);
        })
}

////Api for deploying chaincode
function deploy(req, res, next) {
  deployService.deployChaincode(req)
    .then(function(data){
      res.send(data);
    })
    .catch(function(err){
      res.status(400).send(err);
    })
}

//Api for confirming a transaction using transaction id as query param
function confirmTransaction(req, res, next) {
  transactionService.confirmTransaction(req)
    .then(function(data){
      res.send(data);
    })
    .catch(function(err){
      res.status(400).send(err);
    })
}


//Initialise angular
function initialise(req, res, next) {
    res.sendfile('./app/index.html');
}

module.exports = router