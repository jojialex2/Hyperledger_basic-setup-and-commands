var loginApp = angular.module('loginApp', ['ui.router','ngMessages', 'ngMaterial'])
		.config(config);
	
function config($stateProvider, $mdIconProvider, $mdThemingProvider) {
	
	$mdIconProvider.fontSet('md', 'material-icons');
	$mdIconProvider
       .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
	   .defaultIconSet('img/icons/sets/core-icons.svg', 24);
	    
	$mdThemingProvider.theme('default')
          .primaryPalette("blue")
          .accentPalette('pink')
          .warnPalette('red');
		  
	$mdThemingProvider.theme("success-toast");
	$mdThemingProvider.theme("error-toast");
	
	var loginState = {
		name: 'login',
		url: '/login',
		templateUrl: '/views/partials/login.view.html'
	}

	var registerState = {
		name: 'register',
		url: '/register',
		templateUrl: '/views/partials/register.view.html'
	}

	$stateProvider.state(loginState);
	$stateProvider.state(registerState);
}