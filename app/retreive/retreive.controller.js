angular.module('POEController', [])
	.controller('retreive.controller', ['$scope','service','FlashService', controller])
	

	function controller($scope, service, FlashService){

		vm = this;
		
		vm.getHashDetails = getHashDetails;
		vm.searchHash = null;
		vm.foundData = [];
		vm.resultOK = false;

		function getHashDetails(){
			service.getHashDetails(vm.searchHash)
			.then(function(data){
				if(data == "Hash does not Exist"){
					vm.resultKO = true;
					vm.resultOK = false;
					FlashService.Error("Hash does not Exist!")
				}else{
					vm.foundData = data;
					vm.resultOK = true;
					vm.resultKO = false;
					FlashService.Success("Hash  Exists!")
				}
			})
			.catch(function(err){
				FlashService.Error("Error :" + err)
			})
		}

	}	
	
