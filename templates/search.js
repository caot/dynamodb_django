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
    /* angular.element

    Note: Keep in mind that this function will not find elements by tag name /
    CSS selector. For lookups by tag name, try instead angular.element(document).find(...)
    or $document.find(), or use the standard DOM APIs, e.g. document.querySelectorAll().

    https://docs.angularjs.org/api/ng/function/angular.element
    */
    var formData = new FormData(document.querySelector('form'))

    // https://withintent.uncorkedstudios.com/multipart-form-data-file-upload-with-angularjs-c23bf6eeb298
    // http://jsfiddle.net/JeJenny/ZG9re/
    $http.post('/search', formData, {
//      method: 'POST',
//      url: '/search',
      headers: {
         'Content-Type': undefined,
        transformRequest: angular.identity,
        'X-Requested-With': 'XMLHttpRequest',
        // Accept: 'application/json'
      },
//      body: formData,
      /*params: {
        net_worth: $scope.person.net_worth,
        location: $scope.person.location,
        csrfmiddlewaretoken: $scope.csrfmiddlewaretoken
      }*/
    }).then(function success(response) {
      $scope.items = response.data.Items;
      console.log($scope.items);
    }, function error(response) {
      $scope.status = 'Error: ' + response.statusText;
      console.log('error: ' + $scope.status);
    });
  };

}]);
