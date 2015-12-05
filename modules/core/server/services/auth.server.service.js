var app = angular.module('core');

app.run(function($rootScope, $location, $http, mainFunction, Socket){
	$rootScope.loggedIn = false;

	// check authenticate
	$http.get('check-auth', {})
	.success(function(res){
		if(res !== undefined && res._id){
			$rootScope.user = res;
			$rootScope.loggedIn = true;
		}
	})
	.error(function(error){
		console.log(error);
	});
});