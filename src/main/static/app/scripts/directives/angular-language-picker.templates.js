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

angular.module('templates-k8LanguagePicker', ['lang-picker-button.html', 'lang-picker.html']);

angular.module("lang-picker-button.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("lang-picker-button.html",
        "<a href ng-click=\"open()\" class=\"\">\n" +
        "  <span ng-transclude></span>\n" +
        "</a>\n" +
        "");
}]);

angular.module("lang-picker.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("lang-picker.html",
        "<div class=\"modal-body modal-lang-picker\">\n" +
        "  <h3>{{'languageModal.choose' | translate}}</h3>\n" +
        "  <div class=\"form-group\">\n" +
        "    <input class=\"form-control\" type=\"search\" ng-model=\"langSearch\" placeholder=\"{{'languageModal.search' | translate}}\">\n" +
        "  </div>\n" +
        "  <h4>{{'languageModal.count1' | translate}} {{langInfo.length}} {{'languageModal.count2' | translate}}</h4>\n" +
        "  <div class=\"row\">\n" +
        "    <div class=\"col-xs-6 col-sm-4 col-lg-3\" ng-repeat=\"lang in langInfo | filter:langSearch | limitTo: limit\">\n" +
        "      <a href=\"#\" ng-click=\"onLanguageChange({lang: lang.lang})\" class=\"ellipsis lang-picker-lang\">\n" +
        "        {{lang.nativeName}}\n" +
        "      </a>\n" +
        "    </div>\n" +
        "    <div ng-if=\"langInfo.length - limit > 0\" class=\"col-xs-6 col-sm-3 col-lg-2\">\n" +
        "      + {{langInfo.length - limit}} {{'languageModal.more' | translate}}\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>\n" +
        "\n" +
        "<button class=\"btn btn-link btn-close\" ng-click=\"close()\">\n" +
        "  <span class=\"fa fa-times\"></span>\n" +
        "  <span class=\"sr-only\">{{'languageModal.close' | translate}}</span>\n" +
        "</button>\n" +
        "");
}]);
