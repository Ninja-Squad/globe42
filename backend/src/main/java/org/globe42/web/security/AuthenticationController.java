package org.globe42.web.security;

import javax.transaction.Transactional;

import org.globe42.dao.UserDao;
import org.globe42.domain.User;
import org.globe42.web.exception.UnauthorizedException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller used to authenticate users
 * @author JB Nizet
 */
@RestController
@RequestMapping("/api/authentication")
@Transactional
public class AuthenticationController {

    private final UserDao userDao;
    private final PasswordDigester passwordDigester;
    private final JwtHelper jwtHelper;

    public AuthenticationController(UserDao userDao,
                                    PasswordDigester passwordDigester,
                                    JwtHelper jwtHelper) {
        this.userDao = userDao;
        this.passwordDigester = passwordDigester;
        this.jwtHelper = jwtHelper;
    }

    @PostMapping
    public UserDTO authenticate(@RequestBody CredentialsDTO credentials) {
        User user = userDao.findByLogin(credentials.getLogin()).orElseThrow(UnauthorizedException::new);
        if (!passwordDigester.match(credentials.getPassword(), user.getPassword())) {
            throw new UnauthorizedException();
        }

        return new UserDTO(user, jwtHelper.buildToken(user.getId()));
    }
}
