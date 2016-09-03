angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $location, $http,  $ionicLoading) {

    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });

    $scope.isItemActive = function(item) {
        return $location.path().indexOf(item.href) > -1;
    };

    $scope.images = [];

    $scope.loadImages = function() {
        $http.get('https://yts.ag/api/v2/list_movies.json?limit=40&sort_by=date_added,rating')
            .then(function(res){
                $scope.movies = res.data.data.movies;
                $ionicLoading.hide();
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
            $scope.genres = $scope.movie.genres.join();
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
});
