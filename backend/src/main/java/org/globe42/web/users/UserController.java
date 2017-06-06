package org.globe42.web.users;

import javax.transaction.Transactional;

import org.globe42.dao.UserDao;
import org.globe42.domain.User;
import org.globe42.web.exception.NotFoundException;
import org.globe42.web.security.CurrentUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller used to handle users
 * @author JB Nizet
 */
@RestController
@Transactional
@RequestMapping("/api/users")
public class UserController {

    private final CurrentUser currentUser;
    private final UserDao userDao;

    public UserController(CurrentUser currentUser, UserDao userDao) {
        this.currentUser = currentUser;
        this.userDao = userDao;
    }

    @GetMapping("/me")
    public CurrentUserDTO getCurrentUser() {
        User user = userDao.findById(currentUser.getUserId()).orElseThrow(NotFoundException::new);
        return new CurrentUserDTO(user);
    }
}
