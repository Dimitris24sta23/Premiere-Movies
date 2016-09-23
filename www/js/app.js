// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var premiereApp = angular.module('premiere', ['ionic', 'ngSanitize','ngTouch','ionic-native-transitions','ngCordova','ngRoute'])

premiereApp.run(function($ionicPlatform) {
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


    // Initiate Watchlist in localstorage
    if (window.localStorage.getItem("watchlist") === null) {
        var watchlist = {
            data : []
        };

        window.localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }

});

premiereApp.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider,$ionicNativeTransitionsProvider) {

  $ionicConfigProvider.scrolling.jsScrolling(false);

    $ionicNativeTransitionsProvider.setDefaultOptions({
        //duration: 400, // in milliseconds (ms), default 400,
        //slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
        //iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
        //androiddelay: 100, // same as above but for Android, default -1
        //winphonedelay: -1, // same as above but for Windows Phone, default -1,
        //fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
        //fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
        //triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
        //backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
    });

    $ionicNativeTransitionsProvider.setDefaultTransition({
        type: 'slide',
        direction: 'left'
    });

    $ionicNativeTransitionsProvider.setDefaultBackTransition({
        type: 'slide',
        direction: 'right'
    });

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

      .state('app.watchlist', {
          cache: false,
          url: '/watchlist',
          views: {
              'menuContent': {
                  templateUrl: 'templates/watchlist.html',
                  controller: 'WatchList'
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
          cache: false,
          url: '/movie/:id',
          views: {
              'menuContent': {
                  templateUrl: 'templates/movie.html',
                  controller: 'MovieDetails',
                  resolve: {
                      movie: function ($stateParams,GetMovie,$ionicLoading) {
                          $ionicLoading.show({
                              template: '<p>Loading...</p><ion-spinner></ion-spinner>'
                          });
                          return GetMovie.getMovie($stateParams.id)
                      }
                  }
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
