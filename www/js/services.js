// Service for getting movie details
premiereApp.factory('GetMovie', ['$http', function ($http) {
    return {
        getMovie: function (id) {
            return $http.get('https://yts.ag/api/v2/movie_details.json', {
                params: {movie_id: id, with_images: true, with_cast: true}
            })
        }
    };
}]);

// Service for getting suggestions
premiereApp.factory('GetSuggestions', ['$http', function ($http) {
    return {
        getSuggestions: function (id) {
            return $http.get('https://yts.ag/api/v2/movie_suggestions.json', {
                params: {movie_id: id}
            })
        }
    };
}]);

// Service for getting movie subtitles
premiereApp.factory('GetSubs', ['$http', function ($http) {
    return {
        getSubs: function (imdb) {
            return $http.get('http://api.yifysubtitles.com/subs/' + imdb);
        }
    };
}]);