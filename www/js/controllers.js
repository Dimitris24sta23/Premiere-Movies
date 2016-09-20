angular.module('premiere.controllers', ['ngCordova'])

.controller('AppCtrl', function($scope, $location, $http, $ionicLoading, $cordovaNetwork, $ionicPopup, $rootScope, $ionicModal, $ionicScrollDelegate) {

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

    $scope.headeTitle = "";
    $scope.searchData = {};

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
        $http.get("https://yts.ag/api/v2/list_movies.json?limit=40&sort_by=year&page=" + $scope.nextPage + "&genre=" + $scope.headeTitle)
            .then(function(more){
                $scope.movies = $scope.movies.concat(more.data.data.movies);
                $ionicLoading.hide();
                $scope.nextPage += 1;
            });

    }

    $ionicModal.fromTemplateUrl('categories-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openCatModal = function() {
        $scope.modal.show();
    };
    $scope.closeCatModal = function() {
        $scope.modal.hide();
    };

    $ionicModal.fromTemplateUrl('search-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modalSearch = modal;
    });
    $scope.openSearchModal = function() {
        $scope.modalSearch.show();
    };
    $scope.closeSearchModal = function() {
        $scope.modalSearch.hide();
    };

    $scope.selectCategory = function(category){
        if (category == "Latest"){
            $scope.headeTitle = "Latest";
            category = "";
        }
        $scope.headeTitle = category;
        $scope.closeCatModal();
        $ionicScrollDelegate.scrollTop();
        $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner></ion-spinner>'
        });
        $http.get('https://yts.ag/api/v2/list_movies.json?limit=40&sort_by=year&page=1&genre='+category)
            .then(function(res){
                $scope.movies = res.data.data.movies;
                $ionicLoading.hide();
                $scope.loader = "show";
            });
        $scope.nextPage = 2;
    };


    $scope.searchMovie = function(){
        $scope.closeSearchModal();
        $ionicScrollDelegate.scrollTop();
        $scope.headeTitle = $scope.searchData.value;
        $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner></ion-spinner>'
        });
        $http.get('https://yts.ag/api/v2/list_movies.json?limit=40&sort_by=year$&query_term='+$scope.searchData.value)
            .then(function(res){
                $scope.movies = res.data.data.movies;
                $ionicLoading.hide();
                $scope.loader = "hide";
            });
        $scope.nextPage = 2;
    };

})


.factory('GetMovie', ['$http', function($http){
    return {
        getMovie: function(id) {
            return $http.get('https://yts.ag/api/v2/movie_details.json', {
                params: { movie_id: id, with_images: true, with_cast: true }})
        }
    };
}])

.factory('GetSubs', ['$http', function($http){
    return {
        getSubs: function(imdb) {
            return $http.get('http://api.yifysubtitles.com/subs/'+ imdb);
            //return $http.get('js/subs.json');
        }
    };
}])

.controller('GenreController', function($scope,$ionicLoading,$http) {
    $scope.genres = [
        //"Popular",
        "Action",
        "Adventure",
        "Animation",
        "Biography",
        "Comedy",
        "Crime",
        "Documentary",
        "Drama",
        "Family",
        "Fantasy",
        "Film-Noir",
        "History",
        "Horror",
        "Music",
        "Musical",
        "Mystery",
        "Romance",
        "Sci-Fi",
        "Sport",
        "Thriller",
        "War",
        "Western"
    ]

})


.controller('MovieDetails', function($scope, $stateParams, $http, $window, $ionicLoading, $ionicModal, movie, GetSubs) {

    $scope.movie = movie.data.data.movie;
    $scope.genres = $scope.movie.genres.join(", ");
    $window.youtubeLink =  "https://www.youtube.com/watch?v=" + $scope.movie.yt_trailer_code;
    $scope.torrents = $scope.movie.torrents;

    GetSubs.getSubs($scope.movie.imdb_code).success(function (subs_data) {

            $scope.subs_gr = subs_data.subs[Object.keys(subs_data.subs)[0]]['greek'];
            $scope.subs_en = subs_data.subs[Object.keys(subs_data.subs)[0]]['english'];

        });

    $ionicLoading.hide();

    $scope.getTorrents = function(){
        $scope.quality = {
            value: $scope.torrents[0].quality
        };

        $scope.torrents = $scope.torrents.sort(function(a, b) {
            return a.quality - b.quality;
        });

        //console.log($scope.torrents)
    };


    $scope.checkQuality = function(value) {
        $scope.torrents.forEach(function(index){
            if (index.quality == value){
                $window.torrentLink = index.url;
            }
        });
    };

    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };


    $scope.getTorrents();


    $scope.openurl = function(url){
        window.open(url, '_system', 'location=yes'); return false;
    }


})


.filter('hrefToJS', function ($sce, $sanitize) {
    return function (text) {
        var regex = /href="([\S]+)"/g;
        var newString = $sanitize(text).replace(regex, "onClick=\"window.open('$1', '_blank', 'location=yes')\"");
        return $sce.trustAsHtml(newString);
    }
})


