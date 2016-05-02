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

angular.module('CallForPaper').controller('AdminSessionCtrl', function(tracks, talkformats, talk, $scope, $stateParams, $filter, $translate, AdminSession, AdminComment, AdminRate, $modal, $state, CommonProfilImage, AuthService, NextPreviousSessionService, translateFilter, hotkeys, AdminContact, Notification, $q, $sanitize, nextToRate) {
    $scope.tab = $stateParams.tab;
    $scope.saveDraftButtonHidden = true;

    $scope.nextToRate = nextToRate;

    /*
     SESSION
     */
    //$scope.session = talk;
    $scope.adminEmail = null;
    $scope.session = talk;
    $scope.talk = talk;
    $scope.tracks = tracks;
    $scope.talkFormats = talkformats;
    $scope.cospeakers = [];

    if (talk) {
        $scope.cospeakers = talk.cospeakers.map(function(speaker) {
            return speaker.email;
        });
        var length = tracks.length;

        for (var i = 0; i < length; i++) {
            if (tracks[i].id === talk.trackId) {
                $scope.selectedTrack = tracks[i];
                break;
            }
        }
    }

    $scope.updateTrack = function() {
        $scope.talk.trackId = this.selectedTrack.id;
        $scope.talk.trackLabel = this.selectedTrack.libelle;
    };

    function validate(talk) {
        // Validation is only about some required fields
        return _.every(['format', 'name', 'description', 'difficulty', 'trackId'], function(field) {
            return Boolean(talk[field]);
        });
    }

    /**
     * get comments of the session
     * @return {[AdminComment]}
     */
    var updateComments = function() {
        AdminComment.getByRowId({
            rowId: $stateParams.id
        }, function(comments) {
            //TODO quel route ? setTimeout(setViewed, 1000);
            $scope.comments = _.map(comments, function(comment) {
                comment.comment = $sanitize(comment.comment);
                return comment;
            });
        });
    };

    var updateTalk = function(session) {
        $scope.sending = true;

        $scope.changeTrackButtonAnimationDisabled = false;
        AdminSession.update({id: $stateParams.id}, session).$promise.then(function(sessionTmp) {
            updateComments();
            $scope.sending = false;
            $scope.talk.track = sessionTmp.track;
            Notification.success({
                message: $filter('translate')('admin.trackModified'),
                delay: 3000
            });
            $scope.changeTrackButtonAnimationDisabled = true;

        }, function(error) {
            $scope.sending = false;

            $scope.changeTrackButtonAnimationDisabled = true;
            processError(error);

        });
    };

    function save(talk) {
        if (validate(talk)) {
            $scope.sending = true;
            talk.cospeakers = $scope.cospeakers.map(function(email) {
                return {email: email.text};
            });
            updateTalk(talk);
        } else {
            $scope.talkInvalid = true;
            return $q.reject();
        }
    }


    function processError(error) {
        $scope.sending = false;
        if (error.status === 400) {
            if (error.data.errorCode === 1) {
                Notification.error(translateFilter('step2.cospeakerNotFound', {value: error.data.errorCodeBody.email}));
            } else {
                Notification.error(translateFilter('verify.notVerified'));
            }

            return;
        }
        $scope.sendError = true;
    }

    $scope.submit = function submit(talk) {
        save(talk);
    };


    // For gravatar
    $scope.adminEmail = AuthService.user.email;

    /**
     * Get next/previous session ID according to previous filter
     * @return {number}
     */
    $scope.previous = NextPreviousSessionService.getNextSessions($stateParams.id);
    $scope.next = NextPreviousSessionService.getPreviousSessions($stateParams.id);

    hotkeys.bindTo($scope)
        .add({
            combo: 'left',
            description: $filter('translate')('admin.previous'),
            callback: function() {
                if ($scope.previous) {
                    $state.go('admin.session', {id: $scope.previous});
                }
            }
        })
        .add({
            combo: 'right',
            description: $filter('translate')('admin.next'),
            callback: function() {
                if ($scope.next) {
                    $state.go('admin.session', {id: $scope.next});
                }
            }
        })
        .add({
            combo: 'up',
            description: $filter('translate')('admin.main'),
            callback: function() {
                if ($scope.next) {
                    $state.go('admin.sessions');
                }
            }
        });

    updateComments();

    $scope.commentButtonDisabled = false;

    /**
     * Post current comment in textarea
     * @return {AdminComment} posted comment
     */
    $scope.postComment = function() {
        $scope.commentButtonDisabled = true;
        AdminComment.save({rowId: $stateParams.id}, {
            'comment': $scope.commentMsg,
            'rowId': $stateParams.id
        }, function() {
            $scope.commentMsg = '';
            $scope.commentButtonDisabled = false;
            updateComments();
        }, function() {
            $scope.commentButtonDisabled = false;
        });
    };

    /**
     * Delete comment
     * @param  {AdminComment} comment to edit
     * @return {AdminComment} blank comment
     */
    var deleteComment = function(comment) {
        AdminComment.delete({rowId: $stateParams.id, id: comment.id}, function() {
            updateComments();
        }, function() {
        });
    };

    /**
     * Open confirmation modal
     * @param  {AdminComment} comment to edit
     * @return  {void}
     */
    $scope.deleteComment = function(localComment) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/admin/deleteModal.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
                comment: function() {
                    return localComment.comment;
                }
            }
        });
        modalInstance.result.then(function() {
            deleteComment(localComment);
        }, function() {
            // cancel
        });
    };

    /**
     * get rates of the session
     * @return {[AdminRate]}
     */
    var updateRates = function() {
        AdminRate.getByRowId({
            'rowId': $stateParams.id
        }, function(ratesTmp) {
            // number of votes
            var votedCount = ratesTmp.reduce(function(x, y) {
                var i = y.rate !== 0 ? 1 : 0;
                return i + x;
            }, 0);
            // average
            $scope.mean = ratesTmp.reduce(function(x, y) {
                    return y.rate + x;
                }, 0) / (votedCount === 0 ? 1 : votedCount);

            $scope.rates = ratesTmp.filter(function(element) {
                return element.user.email !== AuthService.user.email;
            });
        });
    };
    updateRates();

    $scope.yourRate = {
        rate: 0,
        hate: false,
        love: false,
        id: undefined
    };
    /**
     * Obtain current user rate
     * @param  {long : rowId}
     * @return {AdminRate}
     */
    AdminRate.getByRowIdAndUserId({
        'rowId': $stateParams.id,
    }, function(rateTmp) {
        if (rateTmp.id !== undefined) {
            $scope.yourRate = rateTmp;
            if ($scope.yourRate.rate === 0) {
                $scope.noVote = true;
            }
            if ($scope.yourRate.hate || $scope.yourRate.love) {
                $scope.changed = true;
            }
            $scope.hate = $scope.yourRate.hate;
            $scope.love = $scope.yourRate.love;
        }
    });

    $scope.rateButtonDisabled = false;

    /*
     *	Post new rate
     */
    $scope.postRate = function() {
        $scope.rateButtonDisabled = true;
        if ($scope.yourRate.id === undefined) {
            AdminRate.save({
                'rate': $scope.yourRate.rate,
                'hate': $scope.yourRate.hate,
                'love': $scope.yourRate.love,
                'talkId': $stateParams.id
            }, function(c) {
                $scope.yourRate.id = c.id;
                $scope.rateButtonDisabled = false;
                updateRates();
            });
        } else {
            AdminRate.update({
                'id': $scope.yourRate.id
            }, {
                'rate': $scope.yourRate.rate,
                'hate': $scope.yourRate.hate,
                'love': $scope.yourRate.love,
                'rowId': $stateParams.id
            }, function() {
                $scope.rateButtonDisabled = false;
                updateRates();
            });
        }
    };

    /**
     * Delete current session
     * @return {void}
     */
    $scope.deleteSession = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/admin/modal.html',
            controller: 'ModalInstanceCtrl'
        });
        modalInstance.result.then(function() {
            AdminSession.delete({
                id: $stateParams.id
            }, function() {
                $state.go('admin.sessions');
            });
        }, function() {
            // cancel
        });
    };

    /**
     * Handle checkbox/ratiung states
     */
    const NO_VOTE = 1;
    const LOVE = 2;
    const HATE = 3;
    $scope.changed = false;
    var voteState = function(state) {
        $scope.changed = true;
        switch (state) {
            case NO_VOTE:
                if ($scope.noVote === true) {
                    $scope.yourRate.rate = 0;
                    $scope.yourRate.hate = false;
                    $scope.yourRate.love = false;
                    $scope.hate = false;
                    $scope.love = false;
                } else {
                    $scope.yourRate.rate = 0;
                    $scope.noVote = false;
                    $scope.hate = false;
                    $scope.love = false;
                }
                break;
            case HATE:
                if ($scope.hate === true) {
                    $scope.yourRate.rate = 1;
                    $scope.yourRate.hate = true;
                    $scope.yourRate.love = false;
                    $scope.love = false;
                    $scope.noVote = false;
                } else {
                    $scope.yourRate.rate = 0;
                    $scope.noVote = false;
                    $scope.hate = false;
                    $scope.love = false;
                }
                break;
            case LOVE:
                if ($scope.love === true) {
                    $scope.yourRate.rate = 5;
                    $scope.yourRate.hate = false;
                    $scope.yourRate.love = true;
                    $scope.hate = false;
                    $scope.noVote = false;
                } else {
                    $scope.yourRate.rate = 0;
                    $scope.noVote = false;
                    $scope.hate = false;
                    $scope.love = false;
                }
                break;
        }
    };

    /**
     * Reset all other checkbox and vote 0
     * @return {void}
     */
    $scope.handleNoVote = function() {
        voteState(NO_VOTE);
    };

    /**
     * Reset all other checkbox and vote 1
     * @return {void}
     */
    $scope.handleHate = function() {
        voteState(HATE);
    };

    /**
     * Reset all other checkbox and vote 5
     * @return {void}
     */
    $scope.handleLove = function() {
        voteState(LOVE);
    };

    /**
     * Reset checkbox on vote
     * @return {void}
     */
    $scope.$watch(function() {
        return $scope.yourRate.rate;
    }, function() {
        if ($scope.yourRate.rate !== 0 && !$scope.changed) {
            $scope.changed = false;
            $scope.noVote = false;
            $scope.yourRate.hate = false;
            $scope.hate = false;
            $scope.yourRate.love = false;
            $scope.love = false;
        }
        $scope.changed = false;
    });


    /**
     * CONTACT
     */

    /**
     * get contacts of the session
     * @return {[AdminContact]}
     */
    var updateContacts = function() {
        AdminContact.getByRowId({
            rowId: $stateParams.id
        }, function(contacts) {
            //TODO quel route ? setTimeout(setViewed, 1000);
            $scope.contacts = _.map(contacts, function(contact) {
                contact.comment = $sanitize(contact.comment);
                return contact;
            });
        });
    };
    updateContacts();

    $scope.contactButtonDisabled = false;

    /**
     * Post current contact in textarea
     * @return {AdminContact} posted contact
     */
    $scope.postContact = function() {
        $scope.contactButtonDisabled = true;
        AdminContact.save({rowId: $stateParams.id}, {
            'comment': $scope.contactMsg,
            'rowId': $stateParams.id
        }, function() {
            $scope.contactMsg = '';
            $scope.contactButtonDisabled = false;
            updateContacts();
        }, function() {
            $scope.contactButtonDisabled = false;
        });
    };

    /**
     * PUT contact on server
     * @return {AdminContact} edited contact
     */
    var putContact = function(contact) {
        AdminContact.update({
            rowId: $stateParams.id,
            id: contact.id
        }, contact, function() {
            updateContacts();
        }, function() {
        });
    };

    /**
     * Open modal for editing
     * @param  {AdminContact} contact to edit
     * @return {AdminContact} edited contact text
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
