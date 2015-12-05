(function(){
	angular.module('core')
	.controller('EditProfileController', ['Upload', '$scope', '$rootScope', '$state', '$http', '$location', 
	function(Upload, $scope, $rootScope, $state, $http, $location){

		// authenticate
		if($rootScope.loggedIn === false){
			$location.path('/');
		}else{
			$scope.user = $rootScope.user;
		}

		$scope.progressStatus = false;
		$scope.progressPercentage = 0;

		// upload later on form submit or something similar
	    $scope.submit = function() {
			// if ($scope.editProfileForm.file.$valid && $scope.file) {
				$scope.upload($scope.file);
			// }
	    };

		$scope.upload = function(file){

			if( file ){
				Upload.upload({
					url : 'edit-profile-img',
					method : 'POST',
					data : $scope.user,
					file : file
				}).progress(function(evt){
					$scope.progressStatus = true;
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					$scope.progressPercentage = progressPercentage + '%';

					if(progressPercentage === 100){
						$scope.progressPercentage = 'Complete';
						// $scope.progressStatus = false;
					}
				}).success(function(data){
					$rootScope.loggedIn = true;
					$rootScope.user = data;
					$scope.success = 'Edit profile success';
					delete $scope.message;
				}).error(function(error){
					$scope.message = error;
					delete $scope.success;
				});
			}else{
				$http.post('edit-profile', $scope.user)
				.success(function(res){
					$rootScope.loggedIn = true;
					$rootScope.user = res;
					$scope.success = 'Edit profile success';
					delete $scope.message;
				})
				.error(function(error){
					$scope.message = error;
					delete $scope.success;
				});
			}
		};
	}]);
}());