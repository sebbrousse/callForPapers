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

(function() {
    'use strict';
    angular.module('internationalPhoneNumber', []).directive('internationalPhoneNumber', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            require: '^ngModel',
            scope: {
                ngModel: '=',
                defaultCountry: '@'
            },
            link: function(scope, element, attrs, ctrl) {
                var handleWhatsSupposedToBeAnArray, options, read, watchOnce;
                read = function() {
                    //return ctrl.$setViewValue(element.val());
                };
                handleWhatsSupposedToBeAnArray = function(value) {
                    if (value instanceof Array) {
                        return value;
                    } else {
                        return value.toString().replace(/[ ]/g, '').split(',');
                    }
                };
                options = {
                    autoFormat: true,
                    autoHideDialCode: true,
                    defaultCountry: '',
                    nationalMode: false,
                    numberType: '',
                    onlyCountries: void 0,
                    preferredCountries: ['us', 'gb'],
                    responsiveDropdown: false,
                    utilsScript: ''
                };
                angular.forEach(options, function(value, key) {
                    var option;
                    if (!(attrs.hasOwnProperty(key) && angular.isDefined(attrs[key]))) {
                        return;
                    }
                    option = attrs[key];
                    if (key === 'preferredCountries') {
                        options.preferredCountries = handleWhatsSupposedToBeAnArray(option);
                        return options.preferredCountries;
                    } else if (key === 'onlyCountries') {
                        options.onlyCountries = handleWhatsSupposedToBeAnArray(option);
                        return options.onlyCountries;
                    } else if (typeof value === 'boolean') {
                        options[key] = option === 'true';
                        return options[key];
                    } else {
                        options[key] = option;
                        return options[key];
                    }
                });
                watchOnce = scope.$watch('ngModel', function(newValue) {
                    return scope.$$postDigest(function() {
                        options.defaultCountry = scope.defaultCountry;
                        if (newValue !== null && newValue !== void 0 && newValue !== '') {
                            element.val(newValue);
                        }
                        element.intlTelInput(options);
                        if (!(attrs.skipUtilScriptDownload !== void 0 || options.utilsScript)) {
                            element.intlTelInput('loadUtils', '/lib/utils.js');
                        }
                        return watchOnce();
                    });
                });
                ctrl.$formatters.push(function(value) {
                    if (!value) {
                        return value;
                    } else {
                        $timeout(function() {
                            return element.intlTelInput('setNumber', value);
                        }, 0);
                        return element.val();
                    }
                });
                ctrl.$parsers.push(function(value) {
                    if (!value) {
                        return value;
                    }
                    return value.replace(/[^\d]/g, '');
                });
                ctrl.$validators.internationalPhoneNumber = function(value) {
                    if (!value) {
                        return value;
                    } else {
                        return element.intlTelInput('isValidNumber');
                    }
                };
                element.on('blur keyup change', function() {
                    return scope.$apply(read);
                });
                return element.on('$destroy', function() {
                    element.intlTelInput('destroy');
                    return element.off('blur keyup change');
                });
            }
        };
    }]);

}).call(this);
