var _ = require('lodash');
var Q = require('q');
var fs = require('fs');
var logUtil = require('loggingUtility')
var setup = require('./util/chainsetup.service')
var chainTransaction = require('./util/hfcTransaction.service')
var userManager = require('./util/user.service.js')
var request = require('request')

var logger = logUtil.getLogger()

var peerUrls = [];
var users = null;
var peerHosts = [];
var caUrl = null;
var keyValStore = null;
var certificate;
var chain;
var registrar;
var certificate_path;
var self = this;

var service = {}

service.connectHyperledgerSetup = connectHyperledgerSetup;
service.deployChaincode = deployChaincode;

function connectHyperledgerSetup(){

  var deferred = Q.defer();

  try {
        credentials = JSON.parse(fs.readFileSync(__dirname + '/../../configurations/hfc/credentials-hfc.json', 'utf8'));
    
        var peers = credentials.peers;
        for(var i in peers){
          peerUrls.push("grpc://" + peers[i].discovery_host + ":" + peers[i].discovery_port);
        }
        
        var ca = credentials.ca;
        for(var i in ca){
          caUrl = 'grpc://' + ca[i].url;
        }

        if(credentials.users){
          users = credentials.users;
        }
        if(!fileExists(__dirname + '/../../us.blockchain.ibm.com.cert')){
          console.log("downloading...")
          request(credentials.cert)
            .pipe(fs.createWriteStream(__dirname + '/../../us.blockchain.ibm.com.cert'))
        }
        

    } catch (err) {
        deferred.reject("Error reading credentials")
        logger.error("Error in reading credentials in Hyperledger.service.js")
        return deferred.promise; 
    }

    keyValStore = __dirname + '/../../keyValStore';


    //connecting to TLS enabled peers required certificate
    certificate = fs.readFileSync(__dirname +  '/../../us.blockchain.ibm.com.cert')

    // Deploying chaincode requires us to know a path to a certificate on the peers
    certificate_path = credentials.cert_path;

    // Search for chaincode under <project_dir>/src/
    process.env.GOPATH = __dirname + '/../../chaincode';
    
    setup.chainSetup(keyValStore,peerUrls,caUrl,users,certificate,certificate_path)
    .then(function({ chain, registrar }) {
        self.chain = chain;
        self.registrar = registrar;
        userManager.setup(chain);
        chainTransaction.setup(chain);

        deferred.resolve("connected");

    })
    .catch(function(err) {
        deferred.reject(err);
    });
 
  return deferred.promise;

}

function fileExists(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    } catch (err) {
        return false;
    }
}

function deployChaincode(dataArr) {
    return new Promise(function(resolve, reject) {
        if (self.registrar == "" || self.registrar == null) {
            logger.error("Failed to deploy : hyperledger network not connected")
            reject(new Error("Hyperledger Network not connected"));
        } else {
            chainTransaction.deploy(self.registrar, self.certificate_path, dataArr)
                .then(function(response) {
                    resolve(response);
                })
                .catch(function(err) {
                    reject(err);
                })
        }
    });
}


module.exports = service;

