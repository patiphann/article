(function(){
	angular.module('core')
	.controller('SignupController', ['$scope', '$rootScope', '$state', '$http', '$location', function($scope, $rootScope, $state, $http, $location){
		$scope.message = {};

		$scope.createUser = function(){
			$http.post('signup', $scope.newUser)
			.success(function(res){
				$rootScope.loggedIn = true;
	            $rootScope.user = res;
				$scope.success = 'Signup success';
				delete $scope.message;
				delete $scope.newUser;
			})
			.error(function(error){
				$scope.message = error;
				delete $scope.success;
			});
		};
	}]);
}());