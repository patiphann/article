(function(){
	angular.module('core')
	.controller('MainController',['$scope', '$rootScope', '$http', '$interval', '$state', '$stateParams', 
	function($scope, $rootScope, $http, $interval, $state, $stateParams){

		$scope.showMenuLogin = false;
		$scope.useController = $state.$current.self.controller;
		$rootScope.lastEdit = '';

		// $state.go('signUp');
		if( $state.$current.self.name === 'main' ){
			list();
		}else if( $state.$current.self.name === 'viewArticleMain' ){
			selectData();
		}

		// list
		function list(){
			$http.post('list-article', {})
			.success(function(res){
				// res.sort(sort_by('update.date', true, parseInt));
				// console.log(res);
				$rootScope.articles = res;
			})
			.error(function(error){
				console.log(error);
			});
		};

		// view
		function selectData(id){
			$http.post('data-article', { _id: $stateParams.articleId })
			.success(function(res){
				$rootScope.article = res;
			})
			.error(function(error){
				delete $scope.success;
				$scope.error = error;
			});
		}
	}]);
}());