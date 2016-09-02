angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $location) {
    $scope.isItemActive = function(item) {
        return $location.path().indexOf(item.href) > -1;
    };


})
