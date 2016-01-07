'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Home', []);
angular.module('Register', []);

angular.module('BasicHttpAuthExample', [
    'Authentication',
    'Home',
    'Register',
    'ngRoute',
    'ngCookies',
    'oc.lazyLoad'
])

.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'modules/login/login.html'
        })
        .when('/register', {
            controller: 'RegisterController',
            templateUrl: 'modules/register/register.html',
        })
        .when('/about', {

            templateUrl: 'modules/about/welcome.html'
        })
                .when('/search', {
                    controller: 'SearchController',
                    templateUrl: 'modules/search/search.html'
                })
        .when('/', {
            controller: 'HomeController',
            templateUrl: 'modules/home/home.html'
        })

        .otherwise({ redirectTo: '/login' });
}])

.run(['$rootScope', '$location', '$cookieStore', '$http', '$ocLazyLoad',
function ($rootScope, $location, $cookieStore, $http, $ocLazyLoad) {

    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in
        if (($location.path() !== '/register' && $location.path() !== '/about')) {
            if (($location.path() !== '/login') && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        }
        $ocLazyLoad.load('material.min.js');
    });


    $rootScope.$on('$routeChangeSuccess', function (event, next, current) {
        //$window.location.reload();
    });
}]);