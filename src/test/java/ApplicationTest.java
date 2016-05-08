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

import io.cfp.controller.ApplicationController;
import io.cfp.dto.ApplicationSettings;
import io.cfp.service.admin.config.ApplicationConfigService;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.context.WebApplicationContext;

import com.jayway.restassured.module.mockmvc.RestAssuredMockMvc;

import static com.jayway.restassured.module.mockmvc.RestAssuredMockMvc.given;
import static org.hamcrest.core.IsEqual.equalTo;
import static org.mockito.Mockito.when;


/**
 * Created by tmaugin on 08/04/2015.
 */
@RunWith(MockitoJUnitRunner.class)
public class ApplicationTest {

    @Mock
    private ApplicationConfigService applicationConfigService;

    private ApplicationController applicationController;

    @Before
    public void setUp() {
        applicationController = new ApplicationController();
        ReflectionTestUtils.setField(applicationController, "applicationConfigService", applicationConfigService);
        RestAssuredMockMvc.standaloneSetup(applicationController);
    }

    @Test
    public void test1_getApplication() {

        ApplicationSettings applicationSettings = new ApplicationSettings();
        when(applicationConfigService.getAppConfig()).thenReturn(applicationSettings);

        given()
                .contentType("application/json")
                .when()
                .get("/api/application")
                .then()
                .statusCode(200)
                .body("size()", equalTo(7));
    }


}
