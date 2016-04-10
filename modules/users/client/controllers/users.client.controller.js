(function(){
	angular.module('core')
	.controller('loginController', ['$scope', '$rootScope', '$state', '$http', '$location', function($scope, $rootScope, $state, $http, $location){
		$scope.loginUser = function(){
			$http.post('api/login', $scope.login)
			.success(function(res){
				if(res._id === undefined){
					delete $scope.login;
				}else{
					$rootScope.loggedIn = true;
	            	$rootScope.user = res;
	            	delete $scope.login;
	            	// $scope.loginForm.$setPristine();
				}
			})
			.error(function(error){
				delete $scope.login;
			});
		};

		$scope.logOut = function () {
			$http.get('logout', {})
			.success(function(res){
				if(res.status == 'success'){
	            	$rootScope.loggedIn = false;
	            	$location.path('/');
	            	// window.location = "/";
				}
			})
			.error(function(error){
				console.log(error);
			});
        }
	}]);
}());