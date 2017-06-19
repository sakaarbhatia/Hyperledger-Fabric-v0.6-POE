angular.module('POEController')
	.controller('confirm.controller', ['$scope','service','FlashService', controller])
	

	function controller($scope, service, FlashService){

		vm = this;
		vm.getTxConfirmation = getTxConfirmation;
		vm.Tx = null;
		vm.resultOK = false;

		

		function getTxConfirmation(){
			service.getTxConfirmation(vm.Tx)
			.then(function(data){
				if(data == "Error"){
					vm.resultKO = true;
					vm.resultOK = false;
					FlashService.Error("Transaction does not exist")
				}else{
					vm.resultOK = true;
					vm.resultKO = false;
					FlashService.Success("Transaction Exists!")
				}
			})
			.catch(function(err){
				FlashService.Error("Error : check logs")
			})
		}
		
		
	}	
	
