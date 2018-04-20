var app = angular.module('mainApp', ['ui.router', 'ngAnimate', 'ngMaterial', 'ngMessages', 'material.components.expansionPanels', 'md.data.table'])
		.config(config)
		.run(function($rootScope, $templateCache) {
			$rootScope.$on('$viewContentLoaded', function() {
			   $templateCache.removeAll();
			});

			$rootScope.$on('$routeChangeStart', function(event, next, current) {
				if (typeof(current) !== 'undefined'){
					$templateCache.remove(current.templateUrl);
				}
			});

			$rootScope.$on( '$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
				console.log( 'Resolve Error: ', error);
			  });
		 });;
				
function config($stateProvider, $mdThemingProvider, $mdIconProvider){
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

	/* Setting up route states */
	var dashboardState = {
		name: 'dashboardState',
		url: '/dashboard',
		templateUrl: '/views/partials/dashboard.view.html',
		controller: 'DashboardController',
		controllerAs: 'dbc',
		resolve: function($q, $timeout){
			var deferred = $q.defer();
			$timeout(function() {
				deferred.resolve('Hello!');
			}, 10);
			return deferred.promise;
		}
	}

	var setupState = {
		name: 'setupState',
		url: '/setup',
		templateUrl: '/views/partials/setup.view.html',
		controller: 'SetupController',
		controllerAs: 'sc',
		resolve: function($q, $timeout){
			var deferred = $q.defer();
			$timeout(function() {
				deferred.resolve('Hello!');
			}, 10);
			return deferred.promise;
		}
	}

	var setupCreateStreamState = {
		name: 'setupCreateStreamState',
		url: '/setupCreateStream',
		parent: setupState,
		templateUrl: '/views/partials/setup-createStream.view.html',
		controller: 'SetupCreateStreamController',
		controllerAs: 'scsc',
		resolve: function($q, $timeout){
			var deferred = $q.defer();
			$timeout(function() {
				deferred.resolve('Hello!');
			}, 10);
			return deferred.promise;
		}
	}

	var setupSavePermissionsState = {
		name: 'setupSavePermissionsState',
		parent: setupState,
		url: '/setupSavePermissions',
		templateUrl: '/views/partials/setup-savePermissions.view.html',
		controller: 'SetupSavePermissionsController',
		controllerAs: 'sspc',
		resolve: function($q, $timeout){
			var deferred = $q.defer();
			$timeout(function() {
				deferred.resolve('Hello!');
			}, 10);
			return deferred.promise;
		}
	}

	var streamState = {
		name: 'streamState',
		url: '/stream',
		templateUrl: '/views/partials/stream.view.html',
		controller: 'StreamController',
		controllerAs: 'smc',
		resolve: function($q, $timeout){
			var deferred = $q.defer();
			$timeout(function() {
				deferred.resolve('Hello!');
			}, 10);
			return deferred.promise;
		}
	}

	var streamsSubscriptionsState = {
		name: 'streamsSubscriptionsState',
		parent: streamState,
		url: '/streamsSubscriptions',
		templateUrl: '/views/partials/stream-subscriptions.view.html',
		controller: 'StreamsSubscriptionsController',
		controllerAs: 'smsc',
		resolve: {
			initialLoad: function($q, $timeout, RESTService){
				var deferred = $q.defer();
				$timeout(function() {
					deferred.resolve('Hello!');
				}, 10);
				return deferred.promise;
			}
		}
	}

	var streamReadStreamsState = {
		name: 'streamReadStreamsState',
		parent: streamState,
		url: '/streamReadStreams',
		templateUrl: '/views/partials/stream-readStreams.view.html',
		controller: 'StreamReadStreamsController',
		controllerAs: 'smrsc',
		resolve: function($q, $timeout){
			var deferred = $q.defer();
			$timeout(function() {
				deferred.resolve('Hello!');
			}, 10);
			return deferred.promise;
		}
	}

	var streamPublishStreamState = {
		name: 'streamPublishStreamState',
		parent: streamState,
		url: '/streamPublishStream',
		templateUrl: '/views/partials/stream-publishStream.view.html',
		controller: 'StreamPublishStreamController',
		controllerAs: 'smpsc',
		resolve: function($q, $timeout){
				var deferred = $q.defer();
				$timeout(function() {
					deferred.resolve('Hello!');
				}, 10);
				return deferred.promise;
			}
	}

	var streamPublishMultipleStreamState = {
		name: 'streamPublishMultipleStreamState',
		parent: streamState,
		url: '/streamPublishStream',
		templateUrl: '/views/partials/stream-publishMultipleStream.view.html',
		controller: 'StreamPublishMultipleStreamController',
		controllerAs: 'smpmsc',
		resolve: function($q, $timeout){
				var deferred = $q.defer();
				$timeout(function() {
					deferred.resolve('Hello!');
				}, 10);
				return deferred.promise;
			}
	}

	var reportingState = {
		name: 'reportingState',
		url: '/reporting',
		templateUrl: '/views/partials/reporting.view.html',
		controller: 'ReportingController',
		controllerAs: 'rc',
		resolve: function($q, $timeout){
			var deferred = $q.defer();
			$timeout(function() {
				deferred.resolve('Hello!');
			}, 10);
			return deferred.promise;
		}
	}

	// Dashboard route
	$stateProvider.state(dashboardState);

	// Setup routes
	$stateProvider
		.state(setupState)
		.state(setupCreateStreamState)
		.state(setupSavePermissionsState);

	// Stream routes
	$stateProvider
		.state(streamState)
		.state(streamsSubscriptionsState)
		.state(streamReadStreamsState)
		.state(streamPublishStreamState)
		.state(streamPublishMultipleStreamState);

	// Reporting routes
	$stateProvider
		.state(reportingState)
}
