package org.globe42.web.tasks

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.TaskDao
import org.globe42.dao.UserDao
import org.globe42.domain.Task
import org.globe42.domain.User
import org.globe42.email.EmailSender
import org.globe42.web.security.CurrentUser
import org.junit.jupiter.api.Test
import java.util.*

/**
 * Unit tests for [TaskAssignmentListener]
 * @author JB Nizet
 */
class TaskAssignmentListenerTest {

    val mockUserDao = mockk<UserDao>()

    val mockCurrentUser = mockk<CurrentUser>()

    val mockTaskDao = mockk<TaskDao>()

    val mockEmailSender = mockk<EmailSender>(relaxUnitFun = true)

    val listener = TaskAssignmentListener(mockUserDao, mockCurrentUser, mockTaskDao, mockEmailSender)

    @Test
    fun `shouldn't do anything if current user is new assignee`() {
        every { mockCurrentUser.userId } returns 42L

        listener.taskAssigned(
            TaskAssignmentEvent(
                taskId = 1L,
                newAssigneeId = 42L
            )
        )

        verify(inverse = true) { mockEmailSender.sendEmailAsync(any(), any(), any()) }
    }

    @Test
    fun `shouldn't do anything if new assignee has disabled notifications`() {
        every { mockCurrentUser.userId } returns 678L
        val newwAssignee = User(42L).apply {
            email = "john@doe.com"
            taskAssignmentEmailNotificationEnabled = false
        }
        every { mockUserDao.findNotDeletedById(newwAssignee.id!!) } returns newwAssignee
        listener.taskAssigned(
            TaskAssignmentEvent(
                taskId = 1L,
                newAssigneeId = newwAssignee.id!!
            )
        )

        verify(inverse = true) { mockEmailSender.sendEmailAsync(any(), any(), any()) }
    }

    @Test
    fun `shouldn't do anything if new assignee has no email`() {
        every { mockCurrentUser.userId } returns 678L
        val newwAssignee = User(42L).apply {
            email = null
            taskAssignmentEmailNotificationEnabled = true
        }
        every { mockUserDao.findNotDeletedById(newwAssignee.id!!) } returns newwAssignee
        listener.taskAssigned(
            TaskAssignmentEvent(
                taskId = 1L,
                newAssigneeId = newwAssignee.id!!
            )
        )

        verify(inverse = true) { mockEmailSender.sendEmailAsync(any(), any(), any()) }
    }

    @Test
    fun `should send email`() {
        every { mockCurrentUser.userId } returns 678L
        val newwAssignee = User(42L).apply {
            email = "john@doe.com"
            taskAssignmentEmailNotificationEnabled = true
        }
        every { mockUserDao.findNotDeletedById(newwAssignee.id!!) } returns newwAssignee
        every { mockUserDao.findNotDeletedById(678L) } returns User(678L).apply {
            login = "jack"
        }
        every { mockTaskDao.findById(1L) } returns Optional.of(Task(1L).apply {
            title = "task title"
        })

        listener.taskAssigned(
            TaskAssignmentEvent(
                taskId = 1L,
                newAssigneeId = newwAssignee.id!!
            )
        )

        verify {
            mockEmailSender.sendEmailAsync(
                eq("john@doe.com"),
                eq("Une tâche vous a été assignée : task title"),
                withArg { assertThat(it).contains("task title").contains("par jack") }
            )
        }
    }
}
