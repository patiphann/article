var app = angular.module('core');

app.run(function($rootScope, $location, $http, $q, mainFunction, Socket){
	$rootScope.ajaxCall = $q.defer();
	$rootScope.loggedIn = false;

	// check authenticate
	$http.get('check-auth', {})
	.success(function(res){
		if(res !== undefined && res._id){
			$rootScope.user = res;
			$rootScope.loggedIn = true;
		}

		$rootScope.ajaxCall.resolve();
	})
	.error(function(error){
		console.log(error);
		$rootScope.ajaxCall.resolve();
	});
});