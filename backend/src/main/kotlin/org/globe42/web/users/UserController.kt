package org.globe42.web.users

import org.globe42.dao.UserDao
import org.globe42.domain.User
import org.globe42.web.exception.BadRequestException
import org.globe42.web.exception.ErrorCode
import org.globe42.web.exception.NotFoundException
import org.globe42.web.security.AdminOnly
import org.globe42.web.security.CurrentUser
import org.globe42.web.security.PasswordDigester
import org.springframework.http.HttpStatus
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import javax.transaction.Transactional

/**
 * Controller used to handle users and their passwords
 * @author JB Nizet
 */
@RestController
@Transactional
@RequestMapping("/api/users")
class UserController(
    private val currentUser: CurrentUser,
    private val userDao: UserDao,
    private val passwordGenerator: PasswordGenerator,
    private val passwordDigester: PasswordDigester
) {

    @GetMapping("/me")
    fun getCurrentUser(): CurrentUserDTO {
        val user = userDao.findNotDeletedById(currentUser.userId!!) ?: throw NotFoundException()
        return CurrentUserDTO(user)
    }

    @GetMapping("/me/profile")
    fun getCurrentUserProfile(): ProfileDTO {
        val user = userDao.findNotDeletedById(currentUser.userId!!) ?: throw NotFoundException()
        return ProfileDTO(user)
    }

    @PutMapping("/me/profile")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun updateCurrentUserProfile(@Validated @RequestBody command: ProfileCommandDTO) {
        userDao.findNotDeletedById(currentUser.userId!!)?.apply {
            email = command.email
            taskAssignmentEmailNotificationEnabled = command.taskAssignmentEmailNotificationEnabled
        } ?: throw NotFoundException()
    }

    @PutMapping("/me/passwords")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun changePassword(@Validated @RequestBody command: ChangePasswordCommandDTO) {
        val user = userDao.findNotDeletedById(currentUser.userId!!) ?: throw NotFoundException()
        user.password = passwordDigester.hash(command.newPassword)
    }

    @GetMapping
    @AdminOnly
    fun list(): List<UserDTO> {
        return userDao.findNotDeleted().map(::UserDTO)
    }

    @GetMapping("/{userId}")
    @AdminOnly
    fun get(@PathVariable("userId") userId: Long): UserDTO {
        return userDao.findNotDeletedById(userId)?.let(::UserDTO) ?: throw NotFoundException()
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @AdminOnly
    fun create(@Validated @RequestBody command: UserCommandDTO): UserWithPasswordDTO {
        if (userDao.existsByLogin(command.login)) {
            throw BadRequestException(ErrorCode.USER_LOGIN_ALREADY_EXISTS)
        }

        val user = User()
        copyCommandToUser(command, user)

        val generatedPassword = passwordGenerator.generatePassword()
        user.password = passwordDigester.hash(generatedPassword)

        userDao.save(user)

        return UserWithPasswordDTO(user, generatedPassword)
    }

    @PutMapping("/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @AdminOnly
    fun update(@PathVariable("userId") userId: Long, @Validated @RequestBody command: UserCommandDTO) {
        val user = userDao.findNotDeletedById(userId) ?: throw NotFoundException("No user with ID " + userId)

        userDao.findNotDeletedByLogin(command.login)
            ?.takeIf { other -> other.id != userId }
            ?.let { _ -> throw BadRequestException(ErrorCode.USER_LOGIN_ALREADY_EXISTS) }

        copyCommandToUser(command, user)
    }

    @DeleteMapping("/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @AdminOnly
    fun delete(@PathVariable("userId") userId: Long) {
        userDao.findNotDeletedById(userId)?.let { user -> user.deleted = true }
    }

    @PostMapping("/{userId}/password-resets")
    @ResponseStatus(HttpStatus.CREATED)
    @AdminOnly
    fun resetPassword(@PathVariable("userId") userId: Long): UserWithPasswordDTO {
        val user = userDao.findNotDeletedById(userId) ?: throw NotFoundException("No user with ID " + userId)
        val generatedPassword = passwordGenerator.generatePassword()
        user.password = passwordDigester.hash(generatedPassword)
        return UserWithPasswordDTO(user, generatedPassword)
    }

    private fun copyCommandToUser(command: UserCommandDTO, user: User) {
        with(user) {
            login = command.login
            admin = command.admin
        }
    }
}
