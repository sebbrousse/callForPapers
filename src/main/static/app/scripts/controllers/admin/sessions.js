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

angular.module('CallForPaper').controller('AdminSessionsCtrl', function($scope, translateFilter, NgTableParams, $q, format, talkformats, tracks, sessions, stats) {

    $scope.talkFormats = talkformats;
    $scope.format = format;

    $scope.stats = stats;

    $scope.sessions = sessions;

    $scope.difficulties = [{id: '', title: ''}].concat(_.map(_.range(1, 4), function(difficulty) {
        return {
            id: difficulty,
            title: translateFilter('talk.difficulty.' + difficulty)
        };
    }));

    $scope.tracks = [{id: '', title: ''}].concat(_.map(tracks, function(track) {
        return {
            id: track.libelle,
            title: track.libelle
        };
    }));

    $scope.tableParams = new NgTableParams({
        count: 10,
        sorting: {added: 'desc'}
    }, {
        data: sessions
    });

    /**
     * Filter tables according to checkbox state
     * @return {void}
     */
    $scope.handleNotReviewed = function() {
        if ($scope.notReviewed === true) {
            $scope.tableParams.filter().reviewed = false;
        } else {
            $scope.tableParams.filter().reviewed = '';
        }
    };
});
