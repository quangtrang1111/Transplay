'use strict';

var phonecatApp = angular.module('phonecatApp', [
  'ngRoute',
  'phonecatControllers'
]);

phonecatApp.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('a', {
            templateUrl: 'partial/welcome.html',
            controller: 'Welcome'
        }).
        otherwise({
            redirectTo: 'partial/welcome.html'
        });
  }]);
