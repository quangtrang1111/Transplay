'use strict';

angular.module('Authentication')

.controller('LoginController',
    ['$scope', '$rootScope', '$location', '$route','$http', 'AuthenticationService',
    function ($scope, $rootScope, $location, $route, $http, AuthenticationService) {

        $scope.login = function () {

            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials();
                    $location.path('/');
                    $route.reload();
                } else {
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
        };

        
        //=========================================================
        // Nạp Javascript SDK
        (function (thisdocument, scriptelement, id) {
            var js, fjs = thisdocument.getElementsByTagName(scriptelement)[0];
            if (thisdocument.getElementById(id)) return;

            js = thisdocument.createElement(scriptelement); js.id = id;
            js.src = "//connect.facebook.net/vi_VN/sdk.js"; //you can use 
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        window.fbAsyncInit = function () {
            FB.init({
                appId: '447895588711837', // APP ID ứng dụng của bạn
                cookie: true,  // Kích hoạt cookies

                xfbml: true,  // plugins xã hội
                version: 'v2.1' // Sử dụng version 2.1
            });

            // Xử lý hàm callback
            FB.getLoginStatus(function (response) {
                statusChangeCallback(response);
            });

        };

        // Kết quả từ FB.getLoginStatus().
        function statusChangeCallback(response) {
            if (response.status === 'connected') {
                // Đăng nhập vào ứng dụng của bạn và facebook.
                //$location.path('/');
            } else if (response.status === 'not_authorized') {
                // Người dùng đăng nhập từ một địa chỉ khác.
                
            }
        };

        function getMyFb(jsonFB) {
            var link = urlHost + "api/Account/getfacebookresponse?code=" + jsonFB.authResponse.accessToken;
            var accessToken = jsonFB.authResponse.accessToken;
            
            $http.get(link)
                .success(function (response) {
                    
                    FB.api('/me', function (newjsonFB) {
                        
                        AuthenticationService.Login(newjsonFB.email, accessToken, function (response) {
                            if (response.success) {
                                //alert("đã đăng nhập facebook");
                                AuthenticationService.SetCredentials();
                                $location.path('/');
                                $route.reload();
                            } else {
                                $scope.error = response.message;
                            }
                        });

                    });
                    
                }).error(function (response) {
                    alert("đăng nhập facebook thất bại")
                });
        }

        $scope.loginFacebook = function () {
            FB.login(function (response) {
                // Xử lý các kết quả
                if (response.status === 'connected') {
                    
                    getMyFb(response);
                }
            }, { scope: 'public_profile,email' });
        };
    }]);