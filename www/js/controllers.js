premiereApp.controller('AppCtrl', function($scope, $location, $http, $ionicLoading, $cordovaNetwork, $ionicPopup, $rootScope, $ionicModal, $ionicScrollDelegate) {

    document.addEventListener("deviceready", function () {

        //var isOnline = $cordovaNetwork.isOnline();

        $rootScope.$on('$cordovaNetwork:online', function(event, networkState){

        });

        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function(){
            $ionicLoading.hide();
            $ionicPopup.confirm({
                title: "Internet Disconnected",
                content: "The internet is disconnected on your device.",
                buttons: [
                    {
                        text: '<b>Exit</b>',
                        type: 'button-dark',
                        onTap: function() {
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

    $scope.loadMovies = function() {
        $http.get('https://yts.ag/api/v2/list_movies.json?limit=40&sort_by=year')
            .then(function(res){
                if (res.data.data.movies != undefined) {
                    $scope.movies = res.data.data.movies;
                    $ionicLoading.hide();
                    $scope.loader = "show";
                } else {
                    $scope.loader = "hide";
                }
            });

    };

    $scope.loadMore = function() {
        $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner></ion-spinner>'
        });
        $http.get("https://yts.ag/api/v2/list_movies.json?limit=40&sort_by=year&page=" + $scope.nextPage + "&genre=" + $scope.headeTitle)
            .then(function(more){
                if (more.data.data.movies != undefined) {
                    $scope.movies = $scope.movies.concat(more.data.data.movies);
                    $ionicLoading.hide();
                    $scope.nextPage += 1;
                } else {
                    $ionicLoading.hide();
                    $scope.loader = "hide";
                }
                $scope.noSearchResults = false;
            });

    };

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
                $scope.noSearchResults = false;
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

                if (res.data.data.movies != undefined) {
                    $scope.noSearchResults = false;
                    $scope.movies = res.data.data.movies;
                    $ionicLoading.hide();
                    $scope.loader = "hide";
                } else {
                    $scope.movies = "";
                    $scope.noSearchResults = true;
                    $ionicLoading.hide();
                    $scope.loader = "hide";
                }

            });
        $scope.nextPage = 2;
    };

});


premiereApp.controller('MovieDetails', function($scope, $stateParams, $http, $window, $ionicLoading, $ionicModal, movie, GetSubs, GetSuggestions) {

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


    $scope.openurl = function(url,ext){
        window.open(ext+url, '_system', 'location=yes'); return false;
    };


    $scope.activeWishBtn = function(){
        $scope.classWishBtn = "button-balanced";
        $scope.watchlistText = "Remove from watchlist";
        $scope.wishIcon = "ion-ios-minus-outline";
    };

    $scope.inactiveWishBtn = function(){
        $scope.classWishBtn = "button-dark";
        $scope.watchlistText = "Add to watchlist";
        $scope.wishIcon = "ion-ios-plus-outline";
    };

    $scope.watchlistData = JSON.parse(window.localStorage.getItem("watchlist"));

    $scope.watchlist = function(){

        var watchlist_item = {
            "id": $scope.movie.id,
            "title": $scope.movie.title,
            "imdb" : $scope.movie.rating,
            "poster" : $scope.movie.medium_cover_image
        };

        if ($scope.watchlistData.data.some(function(item) { return item.id === $scope.movie.id })) {
            //alert("Exists!")

            for (var i in $scope.watchlistData.data){
                console.log($scope.watchlistData.data[i]);
                if ($scope.watchlistData.data[i].id == $scope.movie.id){
                   var position = i;
                }
            }

            $scope.watchlistData.data.splice(position, 1);
            window.localStorage.setItem('watchlist',JSON.stringify($scope.watchlistData));

            $scope.inactiveWishBtn();
        } else {
            //alert("not exists");
            $scope.activeWishBtn();
            $scope.watchlistData.data.push(watchlist_item);
            //console.log(watchlist);
            window.localStorage.setItem('watchlist',JSON.stringify($scope.watchlistData));
        }

    };


    if (window.localStorage.getItem("watchlist") === null) {

        $scope.inactiveWishBtn();

    } else {

        if ($scope.watchlistData.data.some(function (item) {
                return item.id === $scope.movie.id
            })) {
            $scope.activeWishBtn();
            //alert("Exists!")
        } else {
            //alert("not exists");
            $scope.inactiveWishBtn();

        }
    }


    GetSuggestions.getSuggestions($scope.movie.id).success(function (suggestions) {
        $scope.Suggestions = suggestions.data.movies;
        $ionicLoading.hide();
    });



});


premiereApp.controller('WatchList', function($scope,$ionicLoading) {

    $scope.wishlist = JSON.parse(window.localStorage.getItem("watchlist"));

    $scope.wishlist = $scope.wishlist.data;

    if ($scope.wishlist.length == 0) {
        $scope.no_results = true;
    }

    $ionicLoading.hide();
    
});


premiereApp.controller('GenreController', function($scope) {
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

});


