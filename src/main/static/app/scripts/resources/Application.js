'use strict';

angular.module('CallForPaper').factory('Application', ['$resource', function($resource) {
    return $resource('api/admin/application/:id', null, {});
}]);
