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
    .controller('Step1Ctrl', ['$scope', '$state', function($scope, $state) {
        $scope.$watch(function() {
            return $scope.form.email.$valid && $scope.form.lastname.$valid && $scope.form.firstname.$valid &&
                ($scope.form.phone.$valid || $scope.$parent.formData.speaker.phone === '') &&
                $scope.form.company.$valid && $scope.form.bio.$valid && $scope.form.social.$valid &&
                $scope.form.twitter.$valid && $scope.form.googleplus.$valid && $scope.form.github.$valid;
        }, function(isValid) {
            $scope.$parent.formData.steps.isValid[0] = isValid;
        });

        $scope.$watch(function() {
            if ($scope.$parent.formData.speaker.socialArray !== undefined) {
                return $scope.$parent.formData.speaker.socialArray.length;
            }
        }, function() {
            if ($scope.$parent.formData.speaker.socialArray !== undefined) {
                $scope.$parent.formData.speaker.social = $scope.$parent.formData.speaker.socialArray.map(function(elem) {
                    return elem.text;
                }).join(', ');
            }
        });

        $scope.verify = false;
        $scope.doVerify = function() {
            $scope.verify = true;
            if ($scope.$parent.formData.steps.isValid[0]) {
                $state.go('app.form.step2');
            }
        };

        /**
         * remove selected img, then current img, then social pimg
         * @return {[type]} [description]
         */
        $scope.removeImage = function() {
            if ($scope.$parent.formData.speaker.files && $scope.$parent.formData.speaker.files.length) {
                $scope.$parent.formData.speaker.files = [];
            } else if ($scope.$parent.formData.speaker.imageProfilKey) {
                $scope.$parent.formData.speaker.imageProfilKey = null;
            } else if ($scope.$parent.formData.speaker.socialProfilImageUrl) {
                $scope.$parent.formData.speaker.socialProfilImageUrl = null;
            }
        };

    }]);
