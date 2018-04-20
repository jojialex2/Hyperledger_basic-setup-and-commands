(function () {
    'use strict';
	
	var app = angular
        .module('loginApp')
        .controller('LoginController', function Controller($window, AuthenticationService, $mdToast) {
			var vm = this;
			vm.loading = false;
			vm.login = function(){
				vm.loading = true;
				AuthenticationService.Login(vm.uname, vm.pwd, function (response) {
					if(response.data && response.data.token) 
						$window.location.href = '/home';
					else {
						var type = "error-toast";
						var errorMessage = response.data.message;
						vm.loading = false;
						$mdToast.show(
							$mdToast.simple()
								.textContent(errorMessage)
								.position('top right')
								.hideDelay(3000)
								.theme(type)
						);
					}
				});
			};
		});
})();