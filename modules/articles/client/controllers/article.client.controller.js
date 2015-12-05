(function(){
	angular.module('core')
	.controller('articleController', ['$scope', '$rootScope', '$state', '$stateParams', '$http', '$location', 'mainFunction', 
	function($scope, $rootScope, $state, $stateParams, $http, $location, mainFunction){

		$scope.showMenuLogin = true;
		$scope.useController = $state.$current.self.controller;
		$rootScope.lastEdit = '';

		// authenticate
		if($rootScope.loggedIn === false){
			$location.path('/');
		}else{
			if( $state.$current.self.name === 'listArticle' ){
				list();
			// view && edit
			}else if( $state.$current.self.name === 'viewArticle' || $state.$current.self.name === 'editArticle'){
				selectData();
			}
		}

		// create
		$scope.submit = function(){
			$http.post('save-article', $scope.newArticle)
			.success(function(res){
				$scope.success = 'Save article success!';
				delete $scope.error;
				delete $scope.newArticle;
			})
			.error(function(error){
				delete $scope.success;
				$scope.error = error;
			});
		};

		// edit
		$scope.edit = function(){
			$http.post('edit-article', $scope.article)
			.success(function(res){
				$scope.success = 'Edit article success!';
				delete $scope.error;
			})
			.error(function(error){
				delete $scope.success;
				$scope.error = error;
			});
		}

		// delete
		$scope.del = function(article){
			if(confirm('Would you like to delete?')){
				$http.post('del-article', article)
				.success(function(res){
					$scope.success = 'Del article success!';
					delete $scope.error;
					// var key = mainFunction.array_in_id(res._id, $rootScope.articles);
					// $rootScope.articles.splice(key, 1);
				})
				.error(function(error){
					delete $scope.success;
					$scope.error = error;
				});
			}
		};

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

		// edit && view
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

		// order by
		$scope.predicate = 'update_date';
		$scope.reverse = true;

		$scope.order = function(predicate) {
			$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
			$scope.predicate = predicate;
		};
	}]);
}());