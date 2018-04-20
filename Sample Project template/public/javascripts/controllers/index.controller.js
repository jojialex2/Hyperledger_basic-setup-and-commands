(function () {
    'use strict';
	
	var app = angular
        .module('loginApp')
        .controller('IndexController', function Controller($state) {
			var vm = this;
			$state.go('login');
		});
})();