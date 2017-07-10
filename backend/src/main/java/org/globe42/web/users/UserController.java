package org.globe42.web.users;

import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import org.globe42.dao.UserDao;
import org.globe42.domain.User;
import org.globe42.web.exception.BadRequestException;
import org.globe42.web.exception.NotFoundException;
import org.globe42.web.security.CurrentUser;
import org.globe42.web.security.PasswordDigester;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller used to handle users and their passwords
 * @author JB Nizet
 */
@RestController
@Transactional
@RequestMapping("/api/users")
public class UserController {

    private final CurrentUser currentUser;
    private final UserDao userDao;
    private final PasswordGenerator passwordGenerator;
    private final PasswordDigester passwordDigester;

    public UserController(CurrentUser currentUser,
                          UserDao userDao,
                          PasswordGenerator passwordGenerator,
                          PasswordDigester passwordDigester) {
        this.currentUser = currentUser;
        this.userDao = userDao;
        this.passwordGenerator = passwordGenerator;
        this.passwordDigester = passwordDigester;
    }

    @GetMapping("/me")
    public CurrentUserDTO getCurrentUser() {
        User user = userDao.findById(currentUser.getUserId()).orElseThrow(NotFoundException::new);
        return new CurrentUserDTO(user);
    }

    @PutMapping("/me/passwords")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(@Validated @RequestBody ChangePasswordCommandDTO command) {
        User user = userDao.findById(currentUser.getUserId()).orElseThrow(NotFoundException::new);
        user.setPassword(passwordDigester.hash(command.getNewPassword()));
    }

    @GetMapping
    public List<UserDTO> list() {
        return userDao.findAll().stream().map(UserDTO::new).collect(Collectors.toList());
    }

    @GetMapping("/{userId}")
    public UserDTO get(@PathVariable("userId") Long userId) {
        return userDao.findById(userId).map(UserDTO::new).orElseThrow(NotFoundException::new);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserWithPasswordDTO create(@Validated @RequestBody UserCommandDTO command) {
        if (userDao.existsByLogin(command.getLogin())) {
            throw new BadRequestException("This login is already used by another user");
        }

        User user = new User();
        copyCommandToUser(command, user);

        String generatedPassword = passwordGenerator.generatePassword();
        user.setPassword(passwordDigester.hash(generatedPassword));

        userDao.save(user);

        return new UserWithPasswordDTO(user, generatedPassword);
    }

    @PutMapping("/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@PathVariable("userId") Long userId, @Validated @RequestBody UserCommandDTO command) {
        User user = userDao.findById(userId).orElseThrow(() -> new NotFoundException("No user with ID " + userId));

        userDao.findByLogin(command.getLogin()).filter(other -> !other.getId().equals(userId)).ifPresent(other -> {
            throw new BadRequestException("This login is already used by another user");
        });

        copyCommandToUser(command, user);
    }

    @DeleteMapping("/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("userId") Long userId) {
        userDao.findById(userId).ifPresent(userDao::delete);
    }

    @PostMapping("/{userId}/password-resets")
    @ResponseStatus(HttpStatus.CREATED)
    public UserWithPasswordDTO resetPassword(@PathVariable("userId") Long userId) {
        User user = userDao.findById(userId).orElseThrow(() -> new NotFoundException("No user with ID " + userId));
        String generatedPassword = passwordGenerator.generatePassword();
        user.setPassword(passwordDigester.hash(generatedPassword));
        return new UserWithPasswordDTO(user, generatedPassword);
    }

    private void copyCommandToUser(UserCommandDTO command, User user) {
        user.setLogin(command.getLogin());
    }
}
