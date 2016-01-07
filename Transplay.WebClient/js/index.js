'use strict';
angular.module('particalApp', ['ngAnimate'])
    .controller('particalController', ['$scope', '$http', function ($scope, $http) {
        $scope.template = { name: 'wellcome', url: '/partical/welcome.html' };

        $scope.goRegister = function () {
            $scope.template = { name: 'register', url: '/partical/register.html' };
        };
        $scope.goLogin = function () {
            $scope.template = { name: 'login', url: '/partical/login.html' };
        };

        $scope.Register = function () {
            var account = new Object;
            account.userName = $scope.AccountRegister.Email;
            account.password = $scope.AccountRegister.Password;
            account.confirmPassword = $scope.AccountRegister.Repassword;

            $http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
            $http.post('http://localhost:11962/api/account/register', account).success(function (data, $scope) {
                alert('Thanh cong');
            });
        };

        $scope.Login = function () {
            var account = new Object;
            account.grant_type = 'password';
            account.username = $scope.AccountLogin.Email;
            account.password = $scope.AccountLogin.Password;

            $http.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';

            $http.post('http://localhost:11962/token', account).success(function (data, $scope) {
                alert('Thanh cong');
            });
        };

        //===================================================================================
        
        
        $scope.LoginFacebook =
            function () {
                
            }
       
    }]);