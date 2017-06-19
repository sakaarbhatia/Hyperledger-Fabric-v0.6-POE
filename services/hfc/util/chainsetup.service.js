var _ = require('lodash');
var Q = require('q');
var logUtil = require('loggingUtility')
var hfc = require('hfc');

var logger = logUtil.getLogger();

var chain_name = "POEChain"
var deployWaitTime = 80;

var service = {}

service.chainSetup = chainSetup;

function chainSetup(keyValStoreDir,peerUrls,caUrl,users,certificate,cert_path){
	var deferred = Q.defer();

	//setting up chain object
	var chain = hfc.newChain(chain_name);

	// The keyValStore will hold our user ECerts and TCerts, which we need to send transactions
    // as these users.
    chain.setKeyValStore(hfc.newFileKeyValStore(keyValStoreDir));
        
    //chain.setDeployWaitTime(deployWaitTime);
    chain.setECDSAModeForGRPC(true);

    // This list of suites is used by GRPC to establish secure connections.  GRPC is the protocol used by the SDK
    // to connect to the fabric.
    process.env['GRPC_SSL_CIPHER_SUITES'] = 'ECDHE-RSA-AES128-GCM-SHA256:' +
        'ECDHE-RSA-AES128-SHA256:' +
        'ECDHE-RSA-AES256-SHA384:' +
        'ECDHE-RSA-AES256-GCM-SHA384:' +
        'ECDHE-ECDSA-AES128-GCM-SHA256:' +
        'ECDHE-ECDSA-AES128-SHA256:' +
        'ECDHE-ECDSA-AES256-SHA384:' +
        'ECDHE-ECDSA-AES256-GCM-SHA384';

	// We need the WebAppAdmin user in order to register new users.
    var registrarID = 'WebAppAdmin';
    var registrarCredentials;
    for (var z in users) {
        if (users[z].enrollId === registrarID)
            registrarCredentials = users[z];
    }
    if (!registrarCredentials) {
        logger.error("Could not locate a registrar user for the chain")
        deferred.reject('Could not locate a registrar user for the chain');
    }

    // Setup the chain object
    configure_network(chain, peerUrls, caUrl, registrarCredentials, certificate)
        .then(function(registrar) {
            deferred.resolve({ chain, registrar });
        })
        .catch(function(err) {
            deferred.reject(err);
        })

	return deferred.promise;
}

function configure_network(chain, peerURLs, caURL, registrarCredentials, certificate) {

	var deferred = Q.defer();

    //Set membership service peer
    if (certificate) {
        chain.setMemberServicesUrl(caURL, { pem: certificate, "grpc.initial_reconnect_backoff_ms": 5000 });
    } else {
        chain.setMemberServicesUrl(caURL);
    }

    // set validating and non validating peers
    for (var i in peerURLs) {
        if (certificate)
            chain.addPeer(peerURLs[i], { pem: certificate , "grpc.initial_reconnect_backoff_ms": 5000 });
        else
            chain.addPeer(peerURLs[i]);
    }
     
     //get member   
    chain.getMember(registrarCredentials.enrollId, function(err, WebAppAdmin) {
	    if (err) {
	        deferred.reject(err);
	    } else {
            //enroll member
	        WebAppAdmin.enroll(registrarCredentials.enrollSecret, function(err, crypto) {
	            if (err) {
	                deferred.reject(err);
	            }
                //set registrar
	            chain.setRegistrar(WebAppAdmin);
	            deferred.resolve(WebAppAdmin);
	        });
	    }
    });

    return deferred.promise;

}





module.exports = service;

