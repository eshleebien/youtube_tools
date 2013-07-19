myApp = angular.module('copyAnnotations',['filters','vidFilter','ngUpload']).
	config(['$routeProvider',function($routeProvider)
	{
		$routeProvider.
			when('/', 
			{
				templateUrl: 'views/cya.html',
				controller: loginCtrl
			}).
			when('/home', 
			{
				templateUrl: 'views/cya2.html',
				controller: CopyYoutubeAnnotationCtrl
			}).
			otherwise(
			{
				redirectTo: '/'
			});
			
	}]);