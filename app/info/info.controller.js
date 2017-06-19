angular.module('POEController')
	.controller('info.controller', ['$scope','service', controller])
	

	function controller($scope, service){

		vm = this;
		vm.chaincodeID = null;
		vm.peers = {};

		init();

		function init(){
			service.getChaincodeID()
			.then(function(result){
				vm.chaincodeID = result;
			})

			service.getPeers()
			.then(function(result){
				vm.peers = result;
			})
		}
		
				
		
	}	
	
