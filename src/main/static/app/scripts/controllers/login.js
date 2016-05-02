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

angular.module('CallForPaper').controller('LoginCtrl', function($scope, $auth, tracks, talkformats) {
    $scope.loading = false;
    $scope.alreadyLinked = false;
    $scope.tracks = tracks;
    $scope.talkFormats = talkformats;


    $scope.authenticate = function(provider) {
        $scope.loading = true;
        $auth.authenticate(provider).then(function() {
            // Signed In.
            $scope.$emit('authenticate');
            $scope.loading = false;
        }).catch(function(response) {
            // Not signed In.
            $scope.loading = false;
            if (response.status === 409) {
                $scope.alreadyLinked = true;
            }
        });
    };

    $scope.badCredentials = false;
    $scope.login = function() {
        $scope.loading = true;
        $auth.login({
                email: $scope.email,
                password: $scope.password
            })
            .then(function() {
                $scope.loading = false;
                $scope.$emit('authenticate');
            })
            .catch(function(response) {
                $scope.loading = false;
                if (response.status === 401) {
                    $scope.badCredentials = true;
                }
            });
    };
});
