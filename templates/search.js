"use strict";

angular.module('myApp', [], function($interpolateProvider) {
  $interpolateProvider.startSymbol('[{');
  $interpolateProvider.endSymbol('}]');
}).config(['$httpProvider', function($httpProvider) {
  // https://github.com/angular/angular.js/issues/1004
  // drop X-Requested-With header from the default $http config #1004
  // $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}])
.controller('FormController', ['$scope', '$http', function($scope, $http) {
  $scope.search = function() {
	var req = {
      method: 'POST',
      url: '/search',
      headers: {
        'Content-Type': undefined,
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json'
      },
      params: { 
      	net_worth: $scope.person.net_worth,
      	location: $scope.person.location,
      	csrfmiddlewaretoken: $scope.csrfmiddlewaretoken
      }
    };
	    $http(req).then(function success(response) {
    	$scope.items = response.data.Items;
    	console.log($scope.items);
    }, function error(response) {
        $scope.status = 'Error: ' + response.statusText;
        console.log('error: ' + $scope.status);
    });
  };
    
}]);
