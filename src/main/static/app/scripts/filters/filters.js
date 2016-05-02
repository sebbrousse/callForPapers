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

angular.module('customFilters', [])
    /**
     * Truncate too long string to  255 chars
     * @param  {string}
     * @return {a $sce.trustAs() value}
     */
    .filter('truncate', ['$sce', function($sce) {
        return function(input) {
            if (!angular.isString(input)) {
                return input;
            }
            if (input.length > 255) {
                return $sce.trustAsHtml(input.substring(0, 255) + '…');
            } else {
                return $sce.trustAsHtml(input);
            }
        };
    }])
    /**
     * Create twitter http link (<a href...) from a string
     * @param  {string}
     * @return {a $sce.trustAs() value}
     */
    .filter('createLinks', ['$sce', function($sce) {
        return function(str) {
            if (!angular.isString(str)) {
                return str;
            }
            var strTmp = str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/(http[^\s]+)/g, '<a target="_blank" href="$1">$1</a>');
            var strTmp2 = strTmp.replace(/(^|[^@\w])@(\w{1,15})\b/g, '<a target="_blank" href="http://twitter.com/$2">@$2</a>');
            return $sce.trustAsHtml(strTmp2);
        };
    }])
    /**
     * Remove all accents
     * @param  {string}
     * @return {string}
     */
    .filter('removeAccents', function removeAccents() {
        return function(source) {
            if (!angular.isString(source)) {
                return source;
            }
            var accent = [
                    /[\300-\306]/g, /[\340-\346]/g, // A, a
                    /[\310-\313]/g, /[\350-\353]/g, // E, e
                    /[\314-\317]/g, /[\354-\357]/g, // I, i
                    /[\322-\330]/g, /[\362-\370]/g, // O, o
                    /[\331-\334]/g, /[\371-\374]/g, // U, u
                    /[\321]/g, /[\361]/g, // N, n
                    /[\307]/g, /[\347]/g, // C, c
                ],
                noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];

            for (var i = 0; i < accent.length; i++) {
                source = source.replace(accent[i], noaccent[i]);
            }
            return source;
        };
    })
    .filter('capitalize', function() {
        return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        };
    })
    /**
     * Remove markdown
     * @param  {string}
     * @return {string}
     */
    .filter('mdToPlaintext', ['marked', function(marked) {
        return function(text) {
            if (!angular.isString(text)) {
                return text;
            }
            return String(marked(text)).replace(/<[^>]+>/gm, '');
        };
    }]);

