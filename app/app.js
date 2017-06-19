angular
	.module('fabricPOE', ['POEController', 'POEService','ui.router'])
	.config(config)
	.run(run)

function config($stateProvider,$urlRouterProvider){
 		
 		$urlRouterProvider.otherwise("/");

        $stateProvider
            .state('retreive', {
                url: '/',
                templateUrl: 'retreive/retreive.html',
                controller: 'retreive.controller',
                controllerAs: 'vm',
                data: { activeTab: 'retreive' }
            })
            .state('upload', {
                url: '/upload',
                templateUrl: 'upload/upload.html',
                controller: 'upload.controller',
                controllerAs: 'vm',
                data: { activeTab: 'upload' }
            })
            .state('info', {
                url: '/info',
                templateUrl: 'info/info.html',
                controller: 'info.controller',
                controllerAs: 'vm',
                data: { activeTab: 'info' }
            })
            .state('confirm', {
                url: '/confirm',
                templateUrl: 'confirm/confirm.html',
                controller: 'confirm.controller',
                controllerAs: 'vm',
                data: { activeTab: 'confirm' }
            });

}

function run($http, $rootScope, $window) {
       
        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });
    }
