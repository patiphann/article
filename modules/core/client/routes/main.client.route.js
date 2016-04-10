(function(){
	angular.module('core', ['ui.router', 'ui.bootstrap', 'angular-loading-bar', 'ngAnimate', 'ngFileUpload', 'btford.socket-io'])
	.config(function($stateProvider, $urlRouterProvider){

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('main', {
			url : '/',
			templateUrl : 'core/client/views/main.client.view.html'
		}).state('signUp', {
			url : '/signup',
			templateUrl : 'users/client/views/signup.client.view.html'
		}).state('editProfile', {
			url : '/edit-profile',
			templateUrl : 'users/client/views/edit.profile.client.view.html'
		}).state('newArticle', {
			url : '/new-article',
			templateUrl : 'articles/client/views/new.article.client.view.html'
		}).state('listArticle', {
			url : '/list-article',
			templateUrl : 'articles/client/views/list.article.client.view.html'
		}).state('editArticle', {
			url: '/edit-article/:articleId',
			templateUrl : 'articles/client/views/edit.article.client.view.html'
		}).state('viewArticle', {
			url: '/view-article/:articleId',
			templateUrl : 'articles/client/views/view.article.client.view.html',
			controller : 'articleController'
		}).state('viewArticleMain', {
			url: '/view-article-main/:articleId',
			templateUrl : 'articles/client/views/view.article.client.view.html',
			controller : 'MainController'
		});
	});
}());