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

angular.module('CallForPaper').provider('ProfileValidator', function() {

    function isValid(user) {
        return Boolean(user.firstname && user.lastname && user.bio && user.email);
    }

    return {
        '$get': function() {
            return {
                isValid: isValid
            };
        },
        isValid: function() {
            return /*@ngInject*/ function(user, $q) {
                return isValid(user) ? $q.when(true) : $q.reject('profile.incomplete');
            };
        }
    };
});
