function HttpWrapper($http, $q) {
    var service = {};

    service.get = function (url, params) {
        return request('get',url,params);
    }

    service.post = function(url,params) {
        return request('post',url,params);
    }

    /**
     * Wrap a http call
     * @param url
     * @param params
     * @param method
     * @returns {Function|promise}
     */
   function request(method,url, params) {

        if(angular.isUndefined(params))
            params = {};

        var deferred = $q.defer();
        $http({
                url: 'service.php/' + url,
                method: method,
                params: params
            }
        ).success(function (response) {
                deferred.resolve(response);
            })
            .error(function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    }

    return service;
}