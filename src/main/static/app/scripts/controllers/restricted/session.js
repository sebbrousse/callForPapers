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
    .controller('RestrictedSessionCtrl', function($scope, $stateParams, $filter, RestrictedSession,RestrictedCoSession, CommonProfilImage, RestrictedContact, $modal, Config, talkformats, isCoSession) {
        $scope.tab = $stateParams.tab;

        $scope.session = null;

        $scope.talkformats=talkformats;
        
        $scope.cospeakers = [];


        
        
        /**
         * Get talk
         * @return {RestrictedSession}
         */
        if(isCoSession)
        {
           RestrictedCoSession.get({
                id: $stateParams.id
            }).$promise.then(function(sessionTmp) {
                $scope.session = sessionTmp;
    
                // Add link to social
                $scope.session.socialLinks = [];
                if (sessionTmp.speaker.social !== null) {
                    var links = sessionTmp.speaker.social.split(',').map(function(value) {
                        return $filter('createLinks')(value);
                    });
                    $scope.session.socialLinks = links;
                }
                if (sessionTmp.speaker.twitter !== null) {
                    $scope.session.speaker.twitter = $filter('createLinks')(sessionTmp.speaker.twitter);
                }
                if (sessionTmp.speaker.googleplus !== null) {
                    $scope.session.speaker.googleplus = $filter('createLinks')(sessionTmp.speaker.googleplus);
                }
                if (sessionTmp.speaker.github !== null) {
                    $scope.session.speaker.github = $filter('createLinks')(sessionTmp.speaker.github);
                }
                $scope.session.keyDifficulty = (['beginner', 'confirmed', 'expert'])[sessionTmp.difficulty - 1];
    
    
                $scope.session.speaker.profilImageUrl = $scope.session.speaker.socialProfilImageUrl;
                
                $scope.cospeakers = $scope.session.cospeakers.map(function(speaker) {
                    return speaker.email;
                });
          });
                
                
        }
        else {
            RestrictedSession.get({
                id: $stateParams.id
            }).$promise.then(function(sessionTmp) {
                $scope.session = sessionTmp;
    
                // Add link to social
                $scope.session.socialLinks = [];
                if (sessionTmp.speaker.social !== null) {
                    var links = sessionTmp.speaker.social.split(',').map(function(value) {
                        return $filter('createLinks')(value);
                    });
                    $scope.session.socialLinks = links;
                }
                if (sessionTmp.speaker.twitter !== null) {
                    $scope.session.speaker.twitter = $filter('createLinks')(sessionTmp.speaker.twitter);
                }
                if (sessionTmp.speaker.googleplus !== null) {
                    $scope.session.speaker.googleplus = $filter('createLinks')(sessionTmp.speaker.googleplus);
                }
                if (sessionTmp.speaker.github !== null) {
                    $scope.session.speaker.github = $filter('createLinks')(sessionTmp.speaker.github);
                }
                $scope.session.keyDifficulty = (['beginner', 'confirmed', 'expert'])[sessionTmp.difficulty - 1];
    
    
                $scope.session.speaker.profilImageUrl = $scope.session.speaker.socialProfilImageUrl;
                
                $scope.cospeakers = $scope.session.cospeakers.map(function(speaker) {
                    return speaker.email;
                });
            });
                
               
        }
        

        /**
         * CONTACT
         */

        /**
         * get contacts of the session
         * @return {[RestrictedContact]}
         */
        var updateContacts = function() {
            RestrictedContact.getByRowId({
                rowId: $stateParams.id
            }, function(contactsTmp) {
                $scope.contacts = contactsTmp;
            });
        };
        updateContacts();

        $scope.captchaShow = true;
        $scope.recaptchaId = Config.recaptchaPublicKey;
        $scope.captcha = null;
        $scope.setResponse = function(response) {
            // send the `response` to your server for verification.
            $scope.captcha = response;
        };

        $scope.contactButtonDisabled = false;
        /**
         * Post current contact in textarea
         * @return {RestrictedContact} posted contact
         */
        $scope.postContact = function() {
            $scope.contactButtonDisabled = true;
            RestrictedContact.save({rowId: $stateParams.id}, {
                'comment': $scope.contactMsg,
                'captcha': $scope.captcha
            }, function() {
                $scope.captchaShow = !$scope.captchaShow;
                $scope.contactMsg = '';
                $scope.contactButtonDisabled = false;
                updateContacts();
            }, function() {
                $scope.captchaShow = !$scope.captchaShow;
                $scope.contactButtonDisabled = false;
            });
        };

        /**
         * PUT contact on server
         * @return {RestrictedContact} edited contact
         */
        var putContact = function(contact) {
            RestrictedContact.update({
                rowId: $stateParams.id,
                id: contact.id
            }, contact, function() {
                updateContacts();
            }, function() {
            });
        };

        /**
         * Open modal for editing
         * @param  {RestrictedContact} contact to edit
         * @return {RestrictedContact} edited contact text
         */
        $scope.editContact = function(localContact) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'views/admin/editModal.html',
                controller: 'EditModalInstanceCtrl',
                resolve: {
                    comment: function() {
                        return localContact.comment;
                    }
                }
            });
            modalInstance.result.then(function(comment) {
                localContact.comment = comment;
                putContact(localContact);
            }, function() {
                // cancel
            });
        };

    });
