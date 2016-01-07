'use strict';
var searchKey = '';

angular.module('Home')

    .controller('SearchController',
    ['$scope', '$http','$rootScope', '$route', '$location',
    function ($scope, $http, $rootScope, $route, $location) {
        $scope.AccountEmail = $rootScope.globals.currentUser.username;
        loadScores();
        searchWord(searchKey);

        function searchWord(keyword) {
            $scope.Words = [];
            var link = urlHost + "api/Word/searchword?keyword=";
            $http.get(link + keyword)
                .success(function (response) {
                    $scope.Words = response;
                }).error(function (response) {
                    alert('Không tìm thấy kết quả nào');
                });
        }

        function loadScores() {
            var link = urlHost + "api/Account/getprofile";
            $http.defaults.headers.post['Content-type'] = "application/json";
            $http.post(link, '"' + $scope.AccountEmail + '"')
                .success(function (response) {
                    $scope.AccountScores = response.scores;
                }).error(function (response) {
                    console.log('Lấy thông tin lỗi: ' + response.message);
                    window.location.reload();
                });
        }

        $scope.Logout = function () {
            AuthenticationService.ClearCredentials();
            $location.path('/login');
            $route.reload();
        }

        $scope.Reload = function () {
            window.location.reload();
        }

        $scope.Search = function () {
            searchWord($scope.Keyword);
        }
    }])

.controller('HomeController',
    ['$scope', '$rootScope', '$http', 'AuthenticationService', '$location', '$route',
    function ($scope, $rootScope, $http, AuthenticationService, $location, $route) {

        $scope.AccountEmail = $rootScope.globals.currentUser.username;
        loadScores();

        function loadScores() {
            var link = urlHost + "api/Account/getprofile";
            $http.defaults.headers.post['Content-type'] = "application/json";
            $http.post(link, '"' + $scope.AccountEmail + '"')
                .success(function (response) {
                    $scope.AccountScores = response.scores;
                }).error(function (response) {
                    console.log('Lấy thông tin lỗi: ' + response.message);
                    window.location.reload();
                });
        }

        $scope.Logout = function () {
            AuthenticationService.ClearCredentials();
            $location.path('/login');
            $route.reload();
        }

        $scope.Reload = function () {
            window.location.reload();
        }

        $scope.Search = function () {
            searchKey = $scope.Keyword;
            $location.path('/search');
            $route.reload();

            //var link = urlHost + "api/Word/searchword?keyword=";

            //$http.get(link + $scope.Keyword)
            //    .success(function (response) {
                    
            //    }).error(function (response) {
            //        alert(response.message)
            //    });
        }

        var link = urlHost + "api/Word/getallid";
        var listID = new Object;
        var currentIndex = 0;

        $scope.Process = 0;
        $scope.LearnWord = 0;
        $scope.CountWord = 0;

        $http.get(link)
                .success(function (response) {
                    if (response.length != 0) {
                        listID = response;
                        loadWord(listID[currentIndex]);
                        $scope.CountWord = listID.length;
                    }

                }).error(function (response) {
                    alert(response.message)
                });

        function loadWord(id) {

            var link = urlHost + "api/Word/getword?id=";
            $scope.Word = new Object;

            $http.get(link + id)
                .success(function (response) {
                    $scope.Message = '';

                    $scope.Word.name = response.name.trim();
                    $scope.Word.mean = response.means.trim();
                    $scope.Word.image = response.picture;

                    var editArray = [];
                    var data = $scope.Word.name.split("");

                    for (var i = 0; i < data.length; i++) {
                        var item0 = {
                            "index": i,
                            "value": ''
                        };
                        editArray.push(item0);
                    }
                    $scope.Word.Letters = editArray;

                    $scope.Word.Randoms = [];
                    var arrayRandom = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
                    for (var i = 0; i < data.length + 5; i++) {
                        var item = {
                            "index": i,
                            "value": arrayRandom[Math.floor((Math.random() * 23) + 0)]
                        };
                        $scope.Word.Randoms.push(item);
                    }

                    var tempRamdom = [];
                    for (var i = 0; i < data.length; i++) {
                        var u = Math.floor((Math.random() * (data.length + 5)) + 0);
                        do {
                            var c = 0;

                            for (var j = 0; j < tempRamdom.length; j++) {
                                if (tempRamdom[j] == u) {
                                    u = Math.floor((Math.random() * (data.length + 5)) + 0);
                                    c = 1;
                                    break;
                                }
                            }

                        }
                        while (c == 1);
                        tempRamdom.push(u);
                    }

                    for (var i = 0; i < tempRamdom.length + 5; i++) {

                        $scope.Word.Randoms[tempRamdom[i]].index = tempRamdom[i];
                        $scope.Word.Randoms[tempRamdom[i]].value = (data[i] == ' ') ? '_' : data[i];
                    }

                }).error(function (response) {
                    console.log('Lấy từ lỗi: ' + response.message);
                });
        }

        $scope.Select = function (index) {
            if ($scope.Word.Randoms[index].value != '') {
                var i = 0;
                for (; i < $scope.Word.Letters.length; i++) {
                    if ($scope.Word.Letters[i].value == '') {
                        $scope.Word.Letters[i].value = $scope.Word.Randoms[index].value;
                        $scope.Word.Randoms[index].value = '';
                        break;
                    }
                }

                if (i == $scope.Word.Letters.length - 1) {
                    for (var j = 0; j < $scope.Word.name.length; j++) {
                        if ($scope.Word.name[j] != $scope.Word.Letters[j].value) {
                            if ($scope.Word.Letters[j].value == '_' && $scope.Word.name[j] != ' ') {
                                return;
                            }                            
                        }
                    }

                    listID.splice(currentIndex, 1);
                    currentIndex--;
                    $scope.LearnWord = $scope.CountWord - listID.length;
                    $scope.Process = Math.round($scope.LearnWord / $scope.CountWord * 10000) / 100;

                    var link = urlHost + "api/Account/addscore";
                    $http.defaults.headers.post['Content-type'] = "application/json";
                    $http.post(link, '"' + $scope.AccountEmail + '"')
                        .success(function (response) {
                            loadScores();
                            $scope.Message = "Chính xác! Click 'Next' để chuyển sang từ kế tiếp.";
                        }).error(function (response) {
                            alert(response.message)
                        });                    
                }
            }
        }

        $scope.Remove = function (index) {
            if ($scope.Word.Letters[index].value != '') {
                for (var i = 0; i < $scope.Word.Randoms.length; i++) {
                    if ($scope.Word.Randoms[i].value == '') {
                        $scope.Word.Randoms[i].value = $scope.Word.Letters[index].value;
                        $scope.Word.Letters[index].value = '';
                        break;
                    }
                }
            }
        }

        $scope.Next = function () {
            if (listID.length == 0) {
                alert('Chúc mừng bạn đã học hết tất cả các từ!');
            }
            else {
                currentIndex = (currentIndex + 1) % listID.length;
                loadWord(listID[currentIndex]);
            }
        };

        $scope.Speech = function () {

        };
    }]);
