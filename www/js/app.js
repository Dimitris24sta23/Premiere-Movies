// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var movieApp = angular.module('movieApp', ['ionic', 'starter.controllers','ngSanitize'])

movieApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

movieApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.movies', {
        url: '/movies',
        views: {
          'menuContent': {
            templateUrl: 'templates/movies.html'
          }
        }
    })

      .state('app.news', {
          url: '/news',
          views: {
              'menuContent': {
                  templateUrl: 'templates/news.html'
              }
          }
      })

      .state('app.favorites', {
          url: '/favorites',
          views: {
              'menuContent': {
                  templateUrl: 'templates/favorites.html'
              }
          }
      })

      .state('app.downloads', {
          url: '/downloads',
          views: {
              'menuContent': {
                  templateUrl: 'templates/downloads.html'
              }
          }
      })

      .state('app.settings', {
          url: '/settings',
          views: {
              'menuContent': {
                  templateUrl: 'templates/settings.html'
              }
          }
      })

      .state('app.movie', {
          url: '/movie/:id',
          views: {
              'menuContent': {
                  templateUrl: 'templates/movie.html',
                  controller: 'MovieDetails'
              }
          }
      })

      .state('app.credits', {
        url: '/credits',
        views: {
            'menuContent': {
                templateUrl: 'templates/credits.html'
            }
        }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/movies');
});
