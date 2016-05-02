/*
 * Copyright (c) 2016 BreizhCamp
 * [http://breizhcamp.org]
 *
 * This file is part of CFP.io.
 *
 * CFP.io is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

angular.module('CallForPaper')
    .factory('authHttpResponseInterceptor', ['$q', '$injector', '$filter', function($q, $injector, $filter) {
        /**
         * Intercep every request and popup a notification if error
         */

        // Debounce error notifications
        var backendcommunication = _.throttle(function() {
            $injector.get('Notification').error({
                message: $filter('translate')('error.backendcommunication'),
                delay: 3000
            });
        }, 3000);

        var noInternet = _.throttle(function() {
            $injector.get('Notification').error({
                message: $filter('translate')('error.noInternet'),
                delay: 3000
            });
        }, 3000);

        return {
            response: function(response) {
                return response || $q.when(response);
            },
            responseError: function(rejection) {
                if (rejection.status === 0) {
                    noInternet();
                } else if (rejection.status === 401) {
                    $injector.get('$state').go('app.login');
                } else if (rejection.status === 403) {
                    $injector.get('$state').go('403');
                } else if (rejection.status === 404) {
                    $injector.get('$state').go('404');
                } else if (rejection.status === 409) {
                    // Nothing
                } else if (rejection.status === 400) {
                    // Nothing
                } else {
                    backendcommunication();
                }
                return $q.reject(rejection);
            }
        };
    }]);
