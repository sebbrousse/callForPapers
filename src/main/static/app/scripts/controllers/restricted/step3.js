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
    .controller('Step3Ctrl', ['$scope', '$modal', function($scope, $modal) {
        $scope.$watch(function() {
            var financial = $scope.$parent.formData.help.financial;
            var hotel = $scope.$parent.formData.help.hotel;
            var hotelDate = $scope.form.hotelDate.$valid;
            var travel = $scope.$parent.formData.help.travel;
            var travelFrom = $scope.form.travelFrom.$valid;
            if (financial === true) {
                if (!hotel && !travel) {
                    return false;
                } else {
                    return !(hotel && !hotelDate) && !(travel && !travelFrom);
                }
            } else if (financial === false) {
                return true;
            } else {
                return false;
            }
        }, function(isValid) {
            $scope.$parent.formData.steps.isValid[2] = isValid;
        });

        $scope.verify = false;
        $scope.doVerify = function() {
            $scope.verify = true;
            if ($scope.$parent.formData.steps.isValid[2] && $scope.$parent.formData.steps.isValid[1] && $scope.$parent.formData.steps.isValid[0]) {
                // open confirmation modal
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/restricted/form/modal.html',
                    controller: 'ModalInstanceCtrl'
                });
                modalInstance.result.then(function() {
                    $scope.$parent.processForm();
                }, function() {
                    // cancel
                });
            } else {
                //form not valid
            }
        };
    }])
    .controller('ModalInstanceCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {
        $scope.ok = function() {
            $modalInstance.close();
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
    }]);
