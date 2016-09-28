// Created By Dimitris Borbotsialos
// This application is not intended for piracy but to familiarize with the Ionic Framework.

premiereApp.controller('MovieAppCtrl', function ($scope, $location, $http, $ionicLoading, $cordovaNetwork, $ionicPopup, $rootScope, $ionicModal, $ionicScrollDelegate) {

    document.addEventListener("deviceready", function () {


        // listen for Offline event
        // If Offline show popup and exit app
        $rootScope.$on('$cordovaNetwork:offline', function () {
            $ionicLoading.hide();
            $ionicPopup.confirm({
                title: "Internet Disconnected",
                content: "The internet is disconnected on your device.",
                buttons: [
                    {
                        text: '<b>Exit</b>',
                        type: 'button-dark',
                        onTap: function () {
                            ionic.Platform.exitApp();
                        }
                    }
                ]
            })
        })

    }, false);


    $scope.nextPage = 2; // Initiate number of page for the loadmore() function

    $scope.headeTitle = "";
    $scope.searchData = {}; // Initiate search

    //Show loading animation on first render
    $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });

    $scope.movies = []; // Initiate movies object

    // get Movies from the service
    $scope.loadMovies = function () {
        $http.get('https://yts.ag/api/v2/list_movies.json?limit=40&sort_by=year')
            .then(function (res) {
                if (res.data.data.movies != undefined) {
                    $scope.movies = res.data.data.movies; // Import movies object from returned data
                    $ionicLoading.hide(); // Hide loading animation when data is loaded
                    $scope.loader = "show"; // Show "Load more" button
                } else {
                    $scope.loader = "hide"; // If service returns empty hide "Load more" button
                }
            });

    };

    // This function is called every time you press the "Load more" button and requests the next page data
    $scope.loadMore = function () {
        $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner></ion-spinner>'
        });
        $http.get("https://yts.ag/api/v2/list_movies.json?limit=40&sort_by=year&page=" + $scope.nextPage + "&genre=" + $scope.headeTitle)
            .then(function (more) {
                if (more.data.data.movies != undefined) {
                    $scope.movies = $scope.movies.concat(more.data.data.movies); // Append movies object from returned data
                    $ionicLoading.hide(); // Hide loading animation when data is loaded
                    $scope.nextPage += 1; // Increment number of page
                } else {
                    // If service returns empty hide "Load more" button
                    $ionicLoading.hide(); // Hide loading animation when data is loaded
                    $scope.loader = "hide";
                }
                $scope.noSearchResults = false; // This is to show or hide a message when no data are returned from search
            });

    };

    // Select a Genre / Category
    $scope.selectCategory = function (category) {
        // Select for the default data
        if (category == "Latest") {
            $scope.headeTitle = "Latest";
            category = "";
        }
        $scope.headeTitle = category; // Set bar title
        $scope.closeCatModal(); // Hide the Category modal
        $ionicScrollDelegate.scrollTop(); // Automatically scroll to the top of the view
        $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner></ion-spinner>'
        });
        $http.get('https://yts.ag/api/v2/list_movies.json?limit=40&sort_by=year&page=1&genre=' + category)
            .then(function (res) {
                $scope.movies = res.data.data.movies; // Import movies object from returned data
                $ionicLoading.hide(); // Hide loading animation when data is loaded
                $scope.loader = "show";
                $scope.noSearchResults = false;
            });
        $scope.nextPage = 2;
    };

    // Search for a movie
    $scope.searchMovie = function () {
        $scope.closeSearchModal();
        $ionicScrollDelegate.scrollTop();
        $scope.headeTitle = $scope.searchData.value; // Set bar title with search word
        $ionicLoading.show({
            template: '<p>Loading...</p><ion-spinner></ion-spinner>'
        });

        //Get Search results
        $http.get('https://yts.ag/api/v2/list_movies.json?limit=40&sort_by=year$&query_term=' + $scope.searchData.value)
            .then(function (res) {
                if (res.data.data.movies != undefined) { // check if object has data
                    // If yes
                    $scope.noSearchResults = false;
                    $scope.movies = res.data.data.movies; // Import movies object from returned data
                    $ionicLoading.hide();
                    $scope.loader = "hide"; // Hide "Load More" Button.
                } else {
                    // If no results found, then
                    $scope.movies = ""; // clear the view
                    $scope.noSearchResults = true; // Show no results message
                    $ionicLoading.hide();
                    $scope.loader = "hide"; // Hide "Load More" Button
                }

            });
    };

    // Search by Category / Genre modal
    $ionicModal.fromTemplateUrl('categories-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openCatModal = function () {
        $scope.modal.show();
    };
    $scope.closeCatModal = function () {
        $scope.modal.hide();
    };

    // Search with keyword modal
    $ionicModal.fromTemplateUrl('search-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalSearch = modal;
    });
    $scope.openSearchModal = function () {
        $scope.modalSearch.show();
    };
    $scope.closeSearchModal = function () {
        $scope.modalSearch.hide();
    };

});


premiereApp.controller('MovieDetails', function ($scope, $stateParams, $http, $window, $ionicLoading, $ionicModal, loadMovie, GetSubs, GetSuggestions) {

    // Get movie details object. The service was called using resolve (app.js) and passed by the "loadmovie" parameter here
    $scope.movie = loadMovie.data.data.movie;

    $scope.genres = $scope.movie.genres.join(", "); // join genres and separate with comma

    $window.youtubeLink = "https://www.youtube.com/watch?v=" + $scope.movie.yt_trailer_code; //Create youtube trailer link

    $scope.torrents = $scope.movie.torrents; // Get torrent object

    // Get movie subtitles using api.yifysubtitles.com service passing the IMDB code of the movie.
    // Note that it will not work in the browser due to Cross-origin policy (CORS). In android app works fine
    // yts.ag/api for getting movies is open so it has no problem with CORS
    GetSubs.getSubs($scope.movie.imdb_code).success(function (subs_data) {
        $scope.subs_gr = subs_data.subs[Object.keys(subs_data.subs)[0]]['greek']; // Get Greek subs
        $scope.subs_en = subs_data.subs[Object.keys(subs_data.subs)[0]]['english']; // Get English subs
        // You can see supported languages here: http://api.yifysubtitles.com/subs/tt3065204
    });

    $ionicLoading.hide();

    // Get the available torrents of the movie
    $scope.getTorrents = function () {
        $scope.quality = {
            value: $scope.torrents[0].quality
        };

        //Sort torrents by quality
        $scope.torrents = $scope.torrents.sort(function (a, b) {
            return a.quality - b.quality;
        });
    };

    // From torrents popup select a torrent
    $scope.checkQuality = function (value) {
        $scope.torrents.forEach(function (index) { // check each torrent in object
            if (index.quality == value) { // If quality equals the selected quality
                $window.torrentLink = index.url; // Update download button with the selected torrent link
            }
        });
    };

    // Modal for selecting quality
    $ionicModal.fromTemplateUrl('torrents-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function () {
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };


    $scope.getTorrents(); // Get torrents on load

    // Function to open external links in app
    $scope.openurl = function (url, ext) {
        window.open(ext + url, '_system', 'location=yes');
        return false;
    };

    // Set Watchlist button as active
    $scope.activeWishBtn = function () {
        $scope.classWishBtn = "button-balanced";
        $scope.watchlistText = "Remove from watchlist";
        $scope.wishIcon = "ion-ios-minus-outline";
    };

    // Set Watchlist button as inactive
    $scope.inactiveWishBtn = function () {
        $scope.classWishBtn = "button-dark";
        $scope.watchlistText = "Add to watchlist";
        $scope.wishIcon = "ion-ios-plus-outline";
    };

    // Get watchlist data from localStorage
    $scope.watchlistData = JSON.parse(window.localStorage.getItem("watchlist"));

    // Add or remove movies in watchlist
    $scope.watchlist = function () {

        // Set current movie details
        var watchlist_item = {
            "id": $scope.movie.id,
            "title": $scope.movie.title,
            "imdb": $scope.movie.rating,
            "poster": $scope.movie.medium_cover_image
        };

        // Check if this movie already exists in watchlist
        if ($scope.watchlistData.data.some(function (item) {
                return item.id === $scope.movie.id
            })) {

            // If movie exists then find the position in the object
            for (var i in $scope.watchlistData.data) {
                console.log($scope.watchlistData.data[i]);
                if ($scope.watchlistData.data[i].id == $scope.movie.id) {
                    var position = i;
                }
            }

            $scope.watchlistData.data.splice(position, 1); // Remove the movie from the object
            window.localStorage.setItem('watchlist', JSON.stringify($scope.watchlistData)); // Write the new object in localStorage

            $scope.inactiveWishBtn(); // Make button inactive
        } else {
            // If movie not exists
            $scope.activeWishBtn(); // Make button active
            $scope.watchlistData.data.push(watchlist_item); // Push the current movie in the object
            window.localStorage.setItem('watchlist', JSON.stringify($scope.watchlistData)); // Write the new object in localStorage
        }

    };

    // On load, check if this movie already exists in Watchlist and set the state of the Watchlist button.
    if (window.localStorage.getItem("watchlist") === null) {
        $scope.inactiveWishBtn();
    } else {
        if ($scope.watchlistData.data.some(function (item) {
                return item.id === $scope.movie.id
            })) {
            $scope.activeWishBtn();
        } else {
            $scope.inactiveWishBtn();

        }
    }

    // Get suggestions for the current movie
    GetSuggestions.getSuggestions($scope.movie.id).success(function (suggestions) {
        $scope.Suggestions = suggestions.data.movies; // Load data from service
        $ionicLoading.hide();
    });


    //Set the options for the screenshots slider
    $scope.options = {
        loop: false,
        effect: 'fade',
        speed: 500
    };
    $scope.data = {};
    $scope.$watch('data.slider', function (nv, ov) {
        $scope.slider = $scope.data.slider;
    });

    $scope.$on("$ionicSlides.sliderInitialized", function (event, data) {
        $scope.slider = data.slider;
    });

    $scope.$on("$ionicSlides.slideChangeStart", function (event, data) {
        console.log('Slide change is beginning');
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function (event, data) {
        // note: the indexes are 0-based
        $scope.activeIndex = data.activeIndex;
        $scope.previousIndex = data.previousIndex;
    });

    // Set up the screenshots modal
    $ionicModal.fromTemplateUrl('screenshots.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modalScreen = modal;
    });
    $scope.openScreenshotModal = function () {
        $scope.modalScreen.show();
    };
    $scope.closeScreenshotModal = function () {
        $scope.modalScreen.hide();
    };


});


premiereApp.controller('WatchList', function ($scope, $ionicLoading) {
    // Get movies added in Watchlist from localStorage
    $scope.wishlist = JSON.parse(window.localStorage.getItem("watchlist"));

    $scope.wishlist = $scope.wishlist.data; // Load movies from Watchlist

    if ($scope.wishlist.length == 0) {
        $scope.no_results = true; // If there are no movies in watchlist, show message
    }

    $ionicLoading.hide();

});


premiereApp.controller('GenreController', function ($scope) {
    // Genres, Categories object
    $scope.genres = [
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