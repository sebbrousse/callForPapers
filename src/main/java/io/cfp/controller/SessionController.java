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

package io.cfp.controller;

import io.cfp.domain.exception.CospeakerNotFoundException;
import io.cfp.domain.exception.NotVerifiedException;
import io.cfp.dto.TalkUser;
import io.cfp.entity.Role;
import io.cfp.entity.Talk;
import io.cfp.entity.User;
import io.cfp.repository.UserRepo;
import io.cfp.service.TalkUserService;
import io.cfp.service.email.EmailingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class SessionController extends RestrictedController {

    @Autowired
    private EmailingService emailingService;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private TalkUserService talkService;

    /**
     * Add a session
     */
    @RequestMapping(value="/proposals", method=RequestMethod.POST)
    @Secured(Role.AUTHENTICATED)
    @ResponseStatus(HttpStatus.CREATED)
    public TalkUser submitTalk(HttpServletRequest req, @Valid @RequestBody TalkUser talkUser) throws Exception, CospeakerNotFoundException  {
        User user = retrieveUser(req);
        TalkUser savedTalk = talkService.submitTalk(user.getId(), talkUser);

        if (user != null && savedTalk != null) {
            Locale userPreferredLocale = req.getLocale();
            emailingService.sendConfirmed(user, savedTalk, userPreferredLocale);
        }

        return savedTalk;
    }

    /**
     * Get all session for the current user
     */
    @RequestMapping(value = "/proposals", method = RequestMethod.GET)
    @Secured(Role.AUTHENTICATED)
    public List<TalkUser> listTalks(HttpServletRequest req) throws NotVerifiedException {
        User user = retrieveUser(req);

        return talkService.findAll(user.getId(), Talk.State.CONFIRMED, Talk.State.ACCEPTED, Talk.State.REFUSED);
    }

    /**
     * Get a session
     */
    @RequestMapping(value = "/proposals/{talkId}", method = RequestMethod.GET)
    @Secured(Role.AUTHENTICATED)
    public TalkUser getGoogleSpreadsheet(HttpServletRequest req, @PathVariable Integer talkId) throws NotVerifiedException {
        User user = retrieveUser(req);

        return talkService.getOne(user.getId(), talkId);
    }

    /**
     * Change a draft to a session
     */
    @RequestMapping(value= "/proposals/{talkId}", method=RequestMethod.PUT)
    @Secured(Role.AUTHENTICATED)
    public TalkUser submitDraftToTalk(HttpServletRequest req, @Valid @RequestBody TalkUser talkUser, @PathVariable Integer talkId) throws Exception, CospeakerNotFoundException {
        User user = retrieveUser(req);

        talkUser.setId(talkId);
        TalkUser savedTalk = talkService.submitDraftToTalk(user.getId(), talkUser);

        if (user != null && savedTalk != null) {
            Locale userPreferredLocale = req.getLocale();
            emailingService.sendConfirmed(user, savedTalk, userPreferredLocale);
        }

        return savedTalk;
    }

    /**
     * Add a new draft
     */
    @RequestMapping(value="/drafts", method=RequestMethod.POST)
    @Secured(Role.AUTHENTICATED)
    @ResponseStatus(HttpStatus.CREATED)
    public TalkUser addDraft(HttpServletRequest req, @Valid @RequestBody TalkUser talkUser) throws NotVerifiedException, CospeakerNotFoundException {
        User user = retrieveUser(req);
        return talkService.addDraft(user.getId(), talkUser);
    }

    /**
     * Get all drafts for current user
     */
    @RequestMapping(value = "/drafts", method = RequestMethod.GET)
    @Secured(Role.AUTHENTICATED)
    public List<TalkUser> listDrafts(HttpServletRequest req) throws NotVerifiedException {
        User user = retrieveUser(req);

        return talkService.findAll(user.getId(), Talk.State.DRAFT);
    }

    /**
     * Get a draft
     */
    @RequestMapping(value = "/drafts/{talkId}", method = RequestMethod.GET)
    @Secured(Role.AUTHENTICATED)
    public TalkUser getDraft(HttpServletRequest req, @PathVariable Integer talkId) throws NotVerifiedException {
        User user = retrieveUser(req);

        return talkService.getOne(user.getId(), talkId);
    }

    /**
     * Delete a draft
     */
    @RequestMapping(value = "/drafts/{talkId}", method = RequestMethod.DELETE)
    @Secured(Role.AUTHENTICATED)
    public TalkUser deleteDraft(HttpServletRequest req, @PathVariable Integer talkId) throws NotVerifiedException {
        User user = retrieveUser(req);

        return talkService.deleteDraft(user.getId(), talkId);
    }

    /**
     * Edit a draft
     */
    @RequestMapping(value= "/drafts/{talkId}", method=RequestMethod.PUT)
    @Secured(Role.AUTHENTICATED)
    public TalkUser editDraft(HttpServletRequest req, @Valid @RequestBody TalkUser talkUser, @PathVariable Integer talkId) throws NotVerifiedException, CospeakerNotFoundException {
        User user = retrieveUser(req);

        talkUser.setId(talkId);
        return talkService.editDraft(user.getId(), talkUser);
    }

    /**
     * Get all co-draft for the current user
     */
    @RequestMapping(value="/codrafts", method= RequestMethod.GET)
    @Secured(Role.AUTHENTICATED)
    public List<TalkUser> getCoDrafts(HttpServletRequest req) throws NotVerifiedException {
        User user = retrieveUser(req);
        return talkService.findAllCospeakerTalks(user.getId(), Talk.State.DRAFT);
    }

    /**
     * Get a co-draft for the current user
     */
    @RequestMapping(value="/codrafts/{talkId}", method= RequestMethod.GET)
    @Secured(Role.AUTHENTICATED)
    public TalkUser getCoDraft(HttpServletRequest req, @PathVariable Integer talkId) throws NotVerifiedException {
        User user = retrieveUser(req);
        TalkUser talk = talkService.getOneCospeakerTalk(user.getId(), talkId);
        return talk;
    }

    /**
     * Get all co-session for the current user
     */
    @RequestMapping(value="/cosessions", method= RequestMethod.GET)
    @Secured(Role.AUTHENTICATED)
    public List<TalkUser> getCoSessions(HttpServletRequest req) throws NotVerifiedException {
        User user = retrieveUser(req);
        return talkService.findAllCospeakerTalks(user.getId(), Talk.State.CONFIRMED, Talk.State.ACCEPTED, Talk.State.REFUSED);
    }

    /**
     * Get a co-session for the current user
     */
    @RequestMapping(value = "/cosessions/{talkId}", method = RequestMethod.GET)
    @Secured(Role.AUTHENTICATED)
    public TalkUser getCoSession(HttpServletRequest  req, @PathVariable Integer talkId) throws NotVerifiedException {
        User user = retrieveUser(req);
        TalkUser talk = talkService.getOneCospeakerTalk(user.getId(), talkId);

        return talk;
    }
}
