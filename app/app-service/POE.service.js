angular.module('POEService', [])
.factory('service', Service)

function Service($http, $q) {

	var service = {};

	service.getChaincodeID = getChaincodeID;
	service.getPeers = getPeers;
    service.setHashDetails = setHashDetails;
    service.getHashDetails = getHashDetails;
    service.getTxConfirmation = getTxConfirmation;

	function getChaincodeID() {
        return $http.get('/app/getChaincodeID').then(handleSuccess, handleError);
    }

    function getPeers() {
        return $http.get('/app/getPeers').then(handleSuccess, handleError);
    }

    function setHashDetails(data) {

        var options = {
            hash: data.hash,
            data: data.data
        }

        return $http.post('/app/upload',options).then(handleSuccess, handleError);
    }

    function getHashDetails(hash) {
        return $http.get('/app/retreive?hash=' + hash).then(handleSuccess, handleError);
    }

    function getTxConfirmation(tx){
        return $http.get('/app/confirmTransaction?transaction=' + tx).then(handleSuccess, handleError);
    }

    // private functions
    function handleSuccess(res) {
        return res.data;
    }

    function handleError(res) {
        return $q.reject(res.data);
    }

	return service;

};

