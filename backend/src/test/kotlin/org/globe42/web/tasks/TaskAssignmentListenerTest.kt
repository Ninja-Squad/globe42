package org.globe42.web.tasks

import com.nhaarman.mockitokotlin2.*
import org.globe42.dao.TaskDao
import org.globe42.dao.UserDao
import org.globe42.domain.Task
import org.globe42.domain.User
import org.globe42.email.EmailSender
import org.globe42.test.Mockito
import org.globe42.web.security.CurrentUser
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import java.util.*

/**
 * Unit tests for [TaskAssignmentListener]
 * @author JB Nizet
 */
@Mockito
class TaskAssignmentListenerTest {

    @Mock
    lateinit var mockUserDao: UserDao

    @Mock
    lateinit var mockCurrentUser: CurrentUser

    @Mock
    lateinit var mockTaskDao: TaskDao

    @Mock
    lateinit var mockEmailSender: EmailSender

    @InjectMocks
    lateinit var listener: TaskAssignmentListener

    @Test
    fun `shouldn't do anything if current user is new assignee`() {
        whenever(mockCurrentUser.userId).thenReturn(42L)

        listener.taskAssigned(
            TaskAssignmentEvent(
                taskId = 1L,
                newAssigneeId = 42L
            )
        )

        verify(mockEmailSender, never()).sendEmailAsync(any(), any(), any())
    }

    @Test
    fun `shouldn't do anything if new assignee has disabled notifications`() {
        whenever(mockCurrentUser.userId).thenReturn(678L)
        val newwAssignee = User(42L).apply {
            email = "john@doe.com"
            taskAssignmentEmailNotificationEnabled = false
        }
        whenever(mockUserDao.findNotDeletedById(newwAssignee.id!!)).thenReturn(newwAssignee)
        listener.taskAssigned(
            TaskAssignmentEvent(
                taskId = 1L,
                newAssigneeId = newwAssignee.id!!
            )
        )

        verify(mockEmailSender, never()).sendEmailAsync(any(), any(), any())
    }

    @Test
    fun `shouldn't do anything if new assignee has no email`() {
        whenever(mockCurrentUser.userId).thenReturn(678L)
        val newwAssignee = User(42L).apply {
            email = null
            taskAssignmentEmailNotificationEnabled = true
        }
        whenever(mockUserDao.findNotDeletedById(newwAssignee.id!!)).thenReturn(newwAssignee)
        listener.taskAssigned(
            TaskAssignmentEvent(
                taskId = 1L,
                newAssigneeId = newwAssignee.id!!
            )
        )

        verify(mockEmailSender, never()).sendEmailAsync(any(), any(), any())
    }

    @Test
    fun `should send email`() {
        whenever(mockCurrentUser.userId).thenReturn(678L)
        val newwAssignee = User(42L).apply {
            email = "john@doe.com"
            taskAssignmentEmailNotificationEnabled = true
        }
        whenever(mockUserDao.findNotDeletedById(newwAssignee.id!!)).thenReturn(newwAssignee)
        whenever(mockUserDao.findNotDeletedById(678L)).thenReturn(User(678L).apply {
            login = "jack"
        })
        whenever(mockTaskDao.findById(1L)).thenReturn(Optional.of(Task(1L).apply {
            title = "task title"
        }))

        listener.taskAssigned(
            TaskAssignmentEvent(
                taskId = 1L,
                newAssigneeId = newwAssignee.id!!
            )
        )

        verify(mockEmailSender).sendEmailAsync(
            eq("john@doe.com"),
            eq("Une tâche vous a été assignée : task title"),
            argThat { contains("task title") && contains("par jack") }
        )
    }
}
