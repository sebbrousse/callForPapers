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
    .controller('Step2Ctrl', ['$scope', '$state', function($scope, $state) {
        $scope.$watch(function() {
            return $scope.form.sessionName.$valid && $scope.form.description.$valid && $scope.form.references.$valid && ($scope.$parent.formData.session.difficulty > 0) && $scope.form.track.$valid && $scope.form.type.$valid && $scope.form.coSpeaker.$valid;
        }, function(isValid) {
            $scope.$parent.formData.steps.isValid[1] = isValid;
        });

        $scope.verify = false;
        $scope.doVerify = function() {
            $scope.verify = true;
            if ($scope.$parent.formData.steps.isValid[1] && $scope.$parent.formData.steps.isValid[0]) {
                $state.go('app.form.step3');
            }
        };
    }]);
