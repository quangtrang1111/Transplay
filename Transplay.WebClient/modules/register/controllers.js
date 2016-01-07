/// <reference path="C:\Users\quang\Documents\Transplay\Source\Transplay\Transplay.WebClient\js/material.min.js" />
/// <reference path="C:\Users\quang\Documents\Transplay\Source\Transplay\Transplay.WebClient\js/material.min.js" />
'use strict';

angular.module('Register')

.controller('RegisterController',
    ['$scope', '$location', '$http', 'AuthenticationService',
    function ($scope, $location, $http, AuthenticationService) {
        
        $scope.Register = function () {

            var link = urlHost + "api/Account/Register";
            var user = new Object;
            user.userName = $scope.AccountRegister.Email;
            user.Password = $scope.AccountRegister.Password;
            user.confirmPassword = $scope.AccountRegister.Repassword;

            //AuthenticationService.ClearCredentials();
            $http.defaults.headers.post['Content-Type'] = 'application/json';
            $http.post(link, user)
                .success(function (response) {
                    alert("đang ký thành công");
                    $location.path('/login');
                }).error(function (response) {
                    alert("đang ký thất bại")
                });

        }
    }]);