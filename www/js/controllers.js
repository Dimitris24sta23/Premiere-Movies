angular.module('premiere.controllers', ['ngCordova'])

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
            $window.youtubeLink =  "https://www.youtube.com/watch?v=" + $scope.movie.yt_trailer_code;
            $ionicLoading.hide();
        });
    }


})


.controller('WebTorrent', function($scope,$window,$ionicLoading) {
    var torrentId = 'magnet:?xt=urn:btih:ab3f1350ebe4563a710545d0e33e09a7b7943ecf&dn=awakening-new-zealand-4k.mp4&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io&ws=https%3A%2F%2Ffastcast.nz%2Fdownloads%2Fawakening-new-zealand-4k.mp4&ws=https%3A%2F%2Fwebseed.btorrent.xyz%2Fawakening-new-zealand-4k.mp4';

    var client = new WebTorrent();
    $ionicLoading.hide();
// HTML elements
    var $body = document.body
    var $progressBar = document.querySelector('#progressBar')
    var $numPeers = document.querySelector('#numPeers')
    var $downloaded = document.querySelector('#downloaded')
    var $total = document.querySelector('#total')
    var $remaining = document.querySelector('#remaining')
    var $uploadSpeed = document.querySelector('#uploadSpeed')
    var $downloadSpeed = document.querySelector('#downloadSpeed')

// Download the torrent
    client.add(torrentId, function (torrent) {

        // Stream the file in the browser
        torrent.files[0].appendTo('#output')

        // Trigger statistics refresh
        torrent.on('done', onDone)
        setInterval(onProgress, 500)
        onProgress()

        // Statistics
        function onProgress () {
            // Peers
            $numPeers.innerHTML = torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers')

            // Progress
            var percent = Math.round(torrent.progress * 100 * 100) / 100
            $progressBar.style.width = percent + '%'
            $downloaded.innerHTML = prettyBytes(torrent.downloaded)
            $total.innerHTML = prettyBytes(torrent.length)

            // Remaining time
            var remaining
            if (torrent.done) {
                remaining = 'Done.'
            } else {
                remaining = moment.duration(torrent.timeRemaining / 1000, 'seconds').humanize()
                remaining = remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.'
            }
            $remaining.innerHTML = remaining

            // Speed rates
            $downloadSpeed.innerHTML = prettyBytes(torrent.downloadSpeed) + '/s'
            $uploadSpeed.innerHTML = prettyBytes(torrent.uploadSpeed) + '/s'
        }
        function onDone () {
            $body.className += ' is-seed'
            onProgress()
        }
    })

// Human readable bytes util
    function prettyBytes(num) {
        var exponent, unit, neg = num < 0, units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        if (neg) num = -num
        if (num < 1) return (neg ? '-' : '') + num + ' B'
        exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
        num = Number((num / Math.pow(1000, exponent)).toFixed(2))
        unit = units[exponent]
        return (neg ? '-' : '') + num + ' ' + unit
    }

})


.filter('hrefToJS', function ($sce, $sanitize) {
    return function (text) {
        var regex = /href="([\S]+)"/g;
        var newString = $sanitize(text).replace(regex, "onClick=\"window.open('$1', '_blank', 'location=yes')\"");
        return $sce.trustAsHtml(newString);
    }
})


