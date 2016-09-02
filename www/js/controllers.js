angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $location, $http) {
    $scope.isItemActive = function(item) {
        return $location.path().indexOf(item.href) > -1;
    };

    $scope.images = [];

    $scope.loadImages = function() {
        $http.get('js/list_movies.json')
            .then(function(res){
                $scope.movies = res.data.data.movies;
            });

    }


})
