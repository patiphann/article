var app = angular.module('core');

// socket
app.factory('Socket', ['socketFactory',
    function(socketFactory) {
        return socketFactory({
            prefix: '',
            ioSocket: io.connect()
        });
    }
]);

// main function
app.factory('mainFunction', function() {
    return {
        array_in_id: function(search, obj) {
        	var resK	= '';

			if(obj.length > 0){
				for(var key in obj){
					if(obj[key]._id === search){
						resK = key;
						return resK;
					}
				}
			}

			return resK;
        }
    };
})

// run
app.run(function($rootScope, $location, $http, mainFunction, Socket){

	$http.defaults.headers.common['x-access-token'] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE0NTk2ODM3MDl9.xdoBrquL0K8JnmLOMu7wyWNIDTOY78_6PdXyDgwNfI8';

	// create
	Socket.on('article.created', function (data) {
		// show list
		if($rootScope.articles !== undefined){
			$rootScope.articles.unshift(data);
		}
	});
	
	// remove
	Socket.on('article.remove', function (data) {
		if($rootScope.articles !== undefined){
			var key = mainFunction.array_in_id(data._id, $rootScope.articles);

			if(key !== ''){
				$rootScope.articles.splice(key, 1);
			}
		}

		$rootScope.lastEdit = 'Deleted data';
	});

	// view and edit
	Socket.on('article.show', function (data) {
		$rootScope.lastEdit = '';

		// another client edit show
		if($rootScope.user === undefined){
			$rootScope.lastEdit = 'Last update by '+data.update_name;
		}else{
			if($rootScope.user._id != data.update_by){
				$rootScope.lastEdit = 'Last update by '+data.update_name;
			}
		}

		// another client
		if($rootScope.lastEdit !== ''){
			if(confirm("Data is update by " + data.update_name + "!\nDo you want to change?")){
				// list
				if($rootScope.articles !== undefined){
					var key = mainFunction.array_in_id(data._id, $rootScope.articles);

					if(key !== ''){
						$rootScope.articles[key] = data;
					}
				}

				$rootScope.article = data;
			}
		// is me
		}else{
			$rootScope.article = data;
		}
	});
});