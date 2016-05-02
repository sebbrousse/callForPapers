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
    .controller('AdminConfigCtrl', ['$scope','$filter', '$http', 'Application',
        function($scope,$filter, $http, Application) {

            $scope.submission = false;
            Application.get(function(config) {
                $scope.submission = config.open;
                $scope.config = config;
                $scope.config.start = $scope.toDate(config.date);
                $scope.config.release = $scope.toDate(config.releaseDate);
                $scope.config.decision = $scope.toDate(config.decisionDate);
            });

            $scope.toDate = function(stringDate){
                 var datePartials = stringDate.split('/');
                 return new Date(datePartials[2], datePartials[1] - 1, datePartials[0]);
            };

            /**
             * Enable or disable submission of new talks
             * @param  {boolean} enable or disable submissions
             * @return {void}
             */
            $scope.toggleSubmit = function(value) {
                $http.post('/api/admin/config/enableSubmissions', {
                    key: value
                }).then(function() {
                }, function() {
                    $scope.submission = !value;
                });
            };


            $scope.saveConfig = function(){
                $scope.config.date = $filter('date')($scope.config.start,'dd/MM/yyyy');
                $scope.config.releaseDate = $filter('date')($scope.config.release,'dd/MM/yyyy');
                $scope.config.decisionDate = $filter('date')($scope.config.decision,'dd/MM/yyyy');
                $http.post('/api/admin/application', $scope.config).then(function() {
                }, function() {
                });

            };
        }
    ]);
