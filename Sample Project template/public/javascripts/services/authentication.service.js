(function () {
    'use strict';

    angular
        .module('loginApp')
        .factory('AuthenticationService', AuthenticationService);

    function AuthenticationService($http, $rootScope) {
        var service = {};

        service.Login = Login;

        return service;

        function Login(username, password, callback) {
	
			$http.post('/authenticate', { "username": username, "password": password })
                .then(function (response) {
                	if(response.data.token){
                		console.log("Authenticated successfully. ", response.data.token);
                	} else {
                		console.log("Authentication Failed! ");
                	}
                    callback(response);
                })
				.catch(function(response){
					console.log("Authentication Error:", response.data);
					callback(response);
				});
        }
    };
})();