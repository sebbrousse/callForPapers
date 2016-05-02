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

angular.module('CallForPaper').factory('Sessions', function(Restangular) {
    var Sessions = Restangular.service('restricted/sessions');

    Sessions.get = function get(id) {
        return Sessions.one(id).get();
    };

    Sessions.save = function save(session) {
        if (session.id) {
            return Sessions.one(session.id).customPUT(session); // "restangularized" session capabilities are not used because session object may be a draft
        } else {
            return Sessions.post(session);
        }
    };

    return Sessions;
});


angular.module('CallForPaper').factory('CoSessions', function(Restangular) {
    var coSessions = Restangular.service('restricted/cosessions');

    coSessions.get = function get(id) {
        return coSessions.one(id).get();
    };


    return coSessions;
});
