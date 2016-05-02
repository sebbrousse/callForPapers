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
    .factory('AuthService', ['$q', 'AdminUser', '$window', '$state', '$auth', 'jwtHelper', function($q, AdminUser, $window, $state, $auth, jwtHelper) {
        var authService = {};
        authService.user = null;

        /**
         * Initialise user
         * @return {void}
         */
        authService.init = function() {
            AdminUser.getCurrentUser(function(userInfo) {
                authService.user = userInfo;
            });
        };

        /**
         * Get login url with custom redirection url
         * @param  {"redirection" : "wantedUrl"}
         * @return {string : url}
         */
        authService.getCustomLoginUrl = function(data) {
            var promise = $q.defer();
            AdminUser.getLoginUrl(data, function(uri) {
                promise.resolve(uri);
            }, function() {
                promise.reject();
            });
            return promise.promise;
        };

        /**
         * Get logout url with custom redirection url
         * @param  {"redirection" : "wantedUrl"}
         * @return {string : url}
         */
        authService.getCustomLogoutUrl = function(data) {
            var promise = $q.defer();
            AdminUser.getLogoutUrl(data, function(uri) {
                promise.resolve(uri);
            }, function() {
                promise.reject();
            });
            return promise.promise;
        };

        /**
         * Get logout url with root url as redirection
         * @return {string : url}
         */
        authService.getLogoutUri = function() {
            if (authService.user !== null && authService.user.connected === true) {
                return authService.user.uri;
            }
            return null;
        };

        /**
         * Get login url with root url as redirection
         * @return {string : url}
         */
        authService.getLogintUri = function() {
            if (authService.user !== null && authService.user.connected === false) {
                return authService.user.uri;
            }
            return null;
        };


        /**
         * Redirect user if not admin
         */
        authService.isAutorizedAdmin = ['$q', '$window', '$state', function($q, $window, $state) {
            var deferred = $q.defer();
            authService.getCurrentUser().then(function(userInfo) {
                // connected
                if (userInfo.connected === true) {
                    // admin
                    if (userInfo.admin === true) {
                        deferred.resolve();
                        // not admin
                    } else {
                        // not autorized
                        $state.go('403');
                        deferred.reject();
                    }
                } else {
                    // login with admin redirection
                    authService.getCustomLoginUrl({
                        redirect: '/#/admin'
                    }).then(function(login) {
                        if (login.uri !== null) {
                            // go to login page
                            $window.location.href = login.uri;
                            deferred.reject();
                        }
                    }, function() {
                        // error
                        $state.go('app.login');
                        deferred.reject();
                    });
                }
            });
            return deferred.promise;
        }];

        /**
         * Redirect user if not connected to google and can't configure the app
         */
        authService.isAutorizedConfig = ['$q', '$window', '$state', function($q, $window, $state) {
            var deferred = $q.defer();
            authService.getCurrentUser().then(function(userInfo) {
                // connected
                if (userInfo.connected === true) {
                    if (userInfo.config === true) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                        $state.go('config.403');
                    }
                } else {
                    // login with admin redirection
                    authService.getCustomLoginUrl({
                        redirect: '/#/config'
                    }).then(function(login) {
                        if (login.uri !== null) {
                            // go to login page
                            $window.location.href = login.uri;
                            deferred.reject();
                        }
                    }, function() {
                        // error
                        $state.go('app.login');
                        deferred.reject();
                    });
                }
            });
            return deferred.promise;
        }];

        /**
         * Verify if the user is currently logged and has confirmed his email (or logged with provider)
         */
        authService.verified = ['$q', '$location', '$auth', 'jwtHelper', function($q, $location, $auth, jwtHelper) {
            var deferred = $q.defer();
            if (!$auth.isAuthenticated()) {
                $location.path('/login');
            } else {
                if (jwtHelper.isTokenExpired($auth.getToken())) {
                    $location.path('/login');
                } else if ($auth.getPayload().verified === false) {
                    $location.path('/login');
                } else {
                    deferred.resolve();
                }
            }
            return deferred.promise;
        }];

        /**
         * Verify if the user is currently logged and has confirmed his email (or logged with provider)
         */
        authService.isVerified = function() {
            if (!$auth.isAuthenticated()) {
                return false;
            } else {
                if (jwtHelper.isTokenExpired($auth.getToken())) {
                    return false;
                } else if ($auth.getPayload().verified === false) {
                    return false;
                } else {
                    return true;
                }
            }
        };
        /**
         * Verify if the user is currently logged
         */
        authService.authenticated = ['$q', '$location', '$auth', 'jwtHelper', function($q, $location, $auth, jwtHelper) {
            var deferred = $q.defer();
            if (!$auth.isAuthenticated()) {
                $location.path('/login');
            } else {
                if (jwtHelper.isTokenExpired($auth.getToken())) {
                    $location.path('/login');
                } else {
                    deferred.resolve();
                }
            }
            return deferred.promise;
        }];

        /**
         * Login the user and redirect to the given state
         * @param  {string : stateName}
         * @param  {string : stateNameIfAdmin}
         * @return {void}
         */
        authService.login = function(state, stateAdmin) {
            authService.getCurrentUser().then(function(user) {
                if (user.connected === false) {
                    $window.location.href = user.uri;
                } else {
                    if (user.admin === true) {
                        $state.go(stateAdmin);
                    } else {
                        $state.go(state);
                    }
                }
            });
        };


        /**
         * Logout the user and redirect to the given state
         * @param  {string : stateName}
         * @return {void}
         */
        authService.logout = function(state) {
            authService.getCurrentUser().then(function(user) {
                if (user.connected === true) {
                    $window.location.href = user.uri;
                } else {
                    $state.go(state);
                }
            });
        };

        /**
         * Get current logged in user info
         * @return { connected : bool, admin : bool, uri : string(login/out url depending on the connected state)}
         */
        authService.getCurrentUser = function() {
            var promise = $q.defer();
            AdminUser.getCurrentUser(function(userInfo) {
                authService.user = userInfo;
                promise.resolve(userInfo);
            }, function() {
                promise.reject();
            });
            return promise.promise;
        };
        return authService;
    }]);
