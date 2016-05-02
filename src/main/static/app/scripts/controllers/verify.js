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
    .controller('VerifyCtrl', ['$scope', '$auth', 'Verify', '$stateParams', function($scope, $auth, Verify, $stateParams) {
        $scope.verified = false;
        $scope.alreadyVerified = false;
        $scope.notVerified = false;

        /**
         * Verify user account
         * @param  {userId}
         * @param  {verificationToken}
         */
        Verify.get($stateParams.id, $stateParams.token)
            .success(function(data) {
                $auth.setToken(data.token, true);
                $scope.verified = true;
            })
            .error(function(data, status) {
                if (status === 409) {
                    $scope.alreadyVerified = true;
                } else {
                    $scope.notVerified = true;
                }
            });
    }]);
