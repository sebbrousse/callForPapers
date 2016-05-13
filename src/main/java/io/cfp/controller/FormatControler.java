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

import io.cfp.dto.FormatDto;
import io.cfp.entity.Event;
import io.cfp.entity.Format;
import io.cfp.entity.Role;
import io.cfp.repository.EventRepository;
import io.cfp.repository.FormatRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.stream.Collectors;

import static org.springframework.web.bind.annotation.RequestMethod.*;

/**
 * @author <a href="mailto:nicolas.deloof@gmail.com">Nicolas De Loof</a>
 */
@RestController
@RequestMapping(value = "/api/formats", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class FormatControler {

    @Autowired
    private FormatRepo formats;

    @Autowired
    private EventRepository events;

    @RequestMapping(method = GET)
    public Collection<FormatDto> all() {
        return formats
            .findByEventId(Event.current())
            .stream()
            .map( t -> new FormatDto(t) )
            .collect(Collectors.toList());
    }

    @RequestMapping(value = "/{id}", method = GET)
    public FormatDto getOne(@PathVariable int id) {
        return new FormatDto(formats.findByIdAndEventId(id, Event.current()));
    }

    @RequestMapping(method = POST)
    @Secured(Role.ADMIN)
    @ResponseStatus(HttpStatus.CREATED)
    public FormatDto create(@RequestBody FormatDto format) {
        return new FormatDto(
            formats.save(
                new Format()
                    .withEvent(events.findOne(Event.current()))
                    .withName(format.getName())
                    .withDuration(format.getDuration())
                    .withDescription(format.getDescription())
            ));
    }

    @RequestMapping(value = "/{id}", method = PUT)
    @Secured(Role.ADMIN)
    public void update(@PathVariable int id, @RequestBody FormatDto format) {
        formats.save(
            formats.getOne(id)
                .withName(format.getName())
                .withDuration(format.getDuration())
                .withDescription(format.getDescription())
        );
    }

    @RequestMapping(value = "/{id}", method = DELETE)
    @Secured(Role.ADMIN)
    public void delete(@PathVariable int id) {
        formats.delete(id);
    }
}
