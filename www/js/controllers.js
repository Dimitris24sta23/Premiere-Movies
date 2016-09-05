angular.module('starter.controllers', ['ngCordova'])

.controller('AppCtrl', function($scope, $location, $http,  $ionicLoading, $cordovaNetwork, $ionicPopup, $rootScope) {

    document.addEventListener("deviceready", function () {

        var isOnline = $cordovaNetwork.isOnline();

        $rootScope.$on('$cordovaNetwork:online', function(event, networkState){

        });

        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            $ionicLoading.hide();
            $ionicPopup.confirm({
                title: "Internet Disconnected",
                content: "The internet is disconnected on your device.",
                buttons: [
                    {
                        text: '<b>Exit</b>',
                        type: 'button-dark',
                        onTap: function(e) {
                            ionic.Platform.exitApp();
                        }
                    }
                ]
            })
        })

    }, false);


    $scope.nextPage = 2;

    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });

    $scope.isItemActive = function(item) {
        return $location.path().indexOf(item.href) > -1;
    };

    $scope.movies = [];

    $scope.loadImages = function() {
        $http.get('https://yts.ag/api/v2/list_movies.json?limit=40&sort_by=year')
            .then(function(res){
                $scope.movies = res.data.data.movies;
                $ionicLoading.hide();
                $scope.loader = "show";
            });

    }

    $scope.loadMore = function() {
        $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner></ion-spinner>'
        });
        $http.get("https://yts.ag/api/v2/list_movies.json?limit=40&sort_by=year&page=" + $scope.nextPage)
            .then(function(more){
                $scope.movies = $scope.movies.concat(more.data.data.movies);
                $ionicLoading.hide();
                $scope.nextPage += 1;
            });

    }


})


.controller('MovieDetails', function($scope, $stateParams, $http, $window, $ionicLoading) {
    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
    var productID = $stateParams.id;
    $scope.loadMovieDetails = function() {
        $http.get('https://yts.ag/api/v2/movie_details.json', {
            params: { movie_id: productID, with_images: true, with_cast: true }
        }).then(function(res){
            $scope.movie = res.data.data.movie;
            $scope.genres = $scope.movie.genres.join(", ");
            $window.torrentLink =  $scope.movie.torrents[0].url;
            $ionicLoading.hide();
        });
    }


})

.filter('hrefToJS', function ($sce, $sanitize) {
    return function (text) {
        var regex = /href="([\S]+)"/g;
        var newString = $sanitize(text).replace(regex, "onClick=\"window.open('$1', '_blank', 'location=yes')\"");
        return $sce.trustAsHtml(newString);
    }
})


