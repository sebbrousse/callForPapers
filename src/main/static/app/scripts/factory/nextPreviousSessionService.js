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
    .factory('NextPreviousSessionService', ['localStorageService', function(localStorageService) {
        var nextPreviousSessionService = {};

        var scope = this;

        scope.sessionsByType = {
            sessions: [],
            sessionscodelab: [],
            sessionsconference: []
        };

        var type = '';
        /**
         * Load sessions
         **/
        if (localStorageService.isSupported) {
            var typeString = localStorageService.get('nextPreviousSessionType');
            if (typeString !== null) {
                type = typeString;
            }
            var sessionsString = localStorageService.get('nextPreviousSession' + type);
            try {
                if (sessionsString !== null) {
                    scope.sessionsByType['sessions' + type] = angular.fromJson(sessionsString);
                }
            } catch (e) {
            }
        }

        nextPreviousSessionService.setType = function(typeTmp) {
            type = typeTmp;
            localStorageService.set('nextPreviousSessionType', type);
        };

        nextPreviousSessionService.getType = function() {
            return localStorageService.get('nextPreviousSessionType');
        };

        nextPreviousSessionService.setSessions = function(array, typeTmp) {
            var sessionsTmp = array.map(function(session) {
                return session.added;
            });
            scope.sessionsByType['sessions' + typeTmp] = sessionsTmp;
            localStorageService.set('nextPreviousSession' + typeTmp, sessionsTmp);
        };

        nextPreviousSessionService.getNextSessions = function(currentSessionId) {
            var index = scope.sessionsByType['sessions' + type].indexOf(parseInt(currentSessionId, 10));
            if (index !== -1) {
                if (index < scope.sessionsByType['sessions' + type].length - 1) {
                    return scope.sessionsByType['sessions' + type][index + 1];
                }
            }
            return null;
        };
        nextPreviousSessionService.getPreviousSessions = function(currentSessionId) {
            var index = scope.sessionsByType['sessions' + type].indexOf(parseInt(currentSessionId, 10));
            if (index !== -1) {
                if (index > 0) {
                    return scope.sessionsByType['sessions' + type][index - 1];
                }
            }
            return null;
        };

        return nextPreviousSessionService;
    }]);
