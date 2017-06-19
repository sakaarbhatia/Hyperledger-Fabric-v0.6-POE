angular.module('POEController')
	.controller('upload.controller', ['$scope','service','FlashService', controller])
	

	function controller($scope, service, FlashService){

		vm = this;
		
		vm.poe = [];

		vm.saveHash = saveHash;

		function saveHash() {
            service.setHashDetails(vm.poe)
                .then(function (data) {
                    FlashService.Success("Transaction : " + data)
                })
                .catch(function (error) {
                    FlashService.Error("Error :" + error)
                });
        }		
				
		
	}	
	
