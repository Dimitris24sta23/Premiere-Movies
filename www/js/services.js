/**
 * Created by dimit_000 on 3/9/2016.
 */

// movie service
fastApp.factory('GetMovie', ['$http', function($http){

    var urlBase = 'https://yts.ag/api/v2/movie_details.json';
    var GetResults = {};

    GetResults.getProducts = function (searchQuery) {
        return $http.get(urlBase+'/results.json?query=' + searchQuery);
    };

    return GetResults;
}]);