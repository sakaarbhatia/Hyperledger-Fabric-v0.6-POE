var express = require('express');
var router = express.Router();
var config = require('configurations/hfc/config-hfc.json')
var creds = require('configurations/hfc/credentials-hfc.json')

router.get("/getChaincodeId", getChaincodeId)
router.get("/getPeers", getPeers)


//Informatory controllers or api to get information from config files

function getChaincodeId(req, res, next) {

  if(config.chaincodeId){
    res.send(config.chaincodeId);
  }
  else {
    res.status(400).send("Chaincode ID Not Found");
  }
}

function getPeers(req, res, next) {

	var peers = creds.peers;
  var allPeer = [];

  peers.forEach(function(element) {
    allPeer.push(element.discovery_host + ":" + element.discovery_port)
  });

  res.send(allPeer);
}

module.exports = router