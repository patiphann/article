var app = angular.module('core');

// socket
app.factory('Socket', ['socketFactory',
    function(socketFactory) {
        return socketFactory({
            prefix: '',
            ioSocket: io.connect('http://localhost:3000')
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
	});

	// view and edit
	Socket.on('article.show', function (data) {
		// another client edit show
		if($rootScope.user._id != data.update_by){
			$rootScope.lastEdit = 'Last update by '+data.update_name;
		}
		
		$rootScope.article = data;
	});
});