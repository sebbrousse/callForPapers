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

angular.module('bs-has', [])
    .factory('bsProcessValidator', ['$timeout', function($timeout) {
        return function(scope, element, ngClass, bsClass) {
            $timeout(function() {
                var input = element.find('input');
                if (!input.length) {
                    input = element.find('select');
                }
                if (!input.length) {
                    input = element.find('textarea');
                }
                if (!input.length) {
                    input = element.find('span[rating]');
                }
                if (input.length) {
                    scope.$watch(function() {
                        return input.hasClass(ngClass) && (input.hasClass('ng-dirty') || input.hasClass('ng-verify'));
                    }, function(isValid) {
                        element.toggleClass(bsClass, isValid);
                    });
                }
            });
        };
    }])
    .factory('bsSubmitValidator', ['$timeout', function($timeout) {
        return function(scope, element, ngClass, bsClass) {
            $timeout(function() {
                var input = element.find('input');
                if (!input.length) {
                    input = element.find('select');
                }
                if (!input.length) {
                    input = element.find('textarea');
                }
                if (!input.length) {
                    input = element.find('span[rating]');
                }
                if (input.length) {
                    scope.$watch(element.attr('verify'), function(value) {
                        if (value) {
                            element.toggleClass(bsClass, input.hasClass(ngClass));
                        }
                    });
                }
            }, 100);
        };
    }])
    .directive('bsHasSuccess', ['bsProcessValidator', function(bsProcessValidator) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                bsProcessValidator(scope, element, 'ng-valid', 'has-success');
            }
        };
    }])
    .directive('bsHasError', ['bsProcessValidator', function(bsProcessValidator) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                bsProcessValidator(scope, element, 'ng-invalid', 'has-error');
            }
        };
    }])
    .directive('bsHas', ['bsProcessValidator', 'bsSubmitValidator', function(bsProcessValidator, bsSubmitValidator) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                bsProcessValidator(scope, element, 'ng-valid', 'has-success');
                bsProcessValidator(scope, element, 'ng-invalid', 'has-error');
                bsSubmitValidator(scope, element, 'ng-invalid', 'has-error');
            }
        };
    }]);
