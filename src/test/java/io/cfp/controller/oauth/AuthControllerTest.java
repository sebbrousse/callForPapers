package io.cfp.controller.oauth;

import io.cfp.config.auth.AuthSettings;
import io.cfp.config.email.EmailingSettings;
import io.cfp.config.global.GlobalSettings;
import io.cfp.controller.config.security.SecurityConfig;
import io.cfp.domain.recaptcha.ReCaptchaCheckerReponse;
import io.cfp.entity.User;
import io.cfp.repository.CfpConfigRepo;
import io.cfp.service.admin.config.ApplicationConfigService;
import io.cfp.service.auth.AuthUtils;
import io.cfp.service.email.EmailingService;
import io.cfp.service.recaptcha.ReCaptchaChecker;
import io.cfp.service.user.UserService;
import io.cfp.utils.Utils;
import ma.glasnost.orika.MapperFacade;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.WebIntegrationTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;


@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = AuthControllerTest.Config.class)
@WebIntegrationTest("server.port:0")
public class AuthControllerTest {

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private ReCaptchaChecker reCaptchaChecker;

    @Autowired
    private UserService userService;

    private MockMvc mockMvc;

    @Before
    public void setUp() {

        AuthUtils.TOKEN_SECRET = "gJ0WgGQgk82F1cYMQ7TJ7MFwGMtDqRnDHC12TDs9gt1C05XU0U7DzMO2Lx9HgaHb";

        this.mockMvc = webAppContextSetup(wac)
            .apply(springSecurity())
            .build();
    }

    @Test
    public void should_allow_signup() throws Exception {
        String userToRegister = Utils.getContent("/json/auth/new_user.json");

        // captcha is ok
        ReCaptchaCheckerReponse captchaOk = new ReCaptchaCheckerReponse();
        captchaOk.setSuccess(true);
        when(reCaptchaChecker.checkReCaptcha(anyString(), anyString())).thenReturn(captchaOk);

        // user does not already exist
        when(userService.findByemail(anyString())).thenReturn(null);

        // user has been saved
        User user = new User();
        user.setEmail("EMAIL");
        when(userService.save(any(User.class))).thenReturn(user);

        mockMvc.perform(post("/auth/signup").content(userToRegister)
            .accept(MediaType.APPLICATION_JSON)
            .contentType(MediaType.APPLICATION_JSON_UTF8))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.token").exists());
    }

    @Configuration
    @Import(SecurityConfig.class)
    static class Config {

        @Bean
        public UserService userService() {
            return mock(UserService.class);
        }

        @Bean // field injection of UserService
        public MapperFacade mapper() {
            return mock(MapperFacade.class);
        }

        @Bean // field injection of EmailingService
        public ApplicationConfigService applicationConfigService() {
            return mock(ApplicationConfigService.class);
        }

        @Bean // field injection of ApplicationConfigService
        public CfpConfigRepo cfpConfigRepo() {
            return mock(CfpConfigRepo.class);
        }

        @Bean // field injection of EmailingService
        public GlobalSettings globalSettings() {
            return mock(GlobalSettings.class);
        }

        @Bean // field injection of EmailingService
        public EmailingSettings emailingSettings() {
            return mock(EmailingSettings.class);
        }

        @Bean // field injection of EmailingService
        public JavaMailSenderImpl javaMailSender() {
            return mock(JavaMailSenderImpl.class);
        }

        @Bean
        public EmailingService emailingService() {
            return mock(EmailingService.class);
        }

        @Bean
        public AuthSettings AuthSettings() {
            return mock(AuthSettings.class);
        }

        @Bean
        public ReCaptchaChecker reCaptchaChecker() {
            return mock(ReCaptchaChecker.class);
        }

        @Bean
        public AuthController authController() {
            return new AuthController();
        }

    }
}
