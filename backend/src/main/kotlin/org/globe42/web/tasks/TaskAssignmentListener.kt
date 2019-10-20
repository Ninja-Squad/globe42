package org.globe42.web.tasks

import org.globe42.dao.TaskDao
import org.globe42.dao.UserDao
import org.globe42.email.EmailSender
import org.globe42.web.security.CurrentUser
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import org.springframework.transaction.event.TransactionalEventListener

/**
 * Component listening to task assignment events, in order to send them email notifications if necessary
 * @author JB Nizet
 */
@Component
@Transactional
class TaskAssignmentListener(
    val userDao: UserDao,
    val currentUser: CurrentUser,
    val taskDao: TaskDao,
    val emailSender: EmailSender
) {

    @TransactionalEventListener(TaskAssignmentEvent::class)
    fun taskAssigned(event: TaskAssignmentEvent) {
        if (event.newAssigneeId == currentUser.userId) {
            return
        }

        val newAssignee = userDao.findNotDeletedById(event.newAssigneeId) ?: return
        if (newAssignee.taskAssignmentEmailNotificationEnabled) {
            newAssignee.email?.let { email ->
                sendEmail(email, event)
            }
        }
    }

    private fun sendEmail(email: String, event: TaskAssignmentEvent) {
        val assigner = userDao.findNotDeletedById(currentUser.userId!!) ?: return
        val task = taskDao.findByIdOrNull(event.taskId) ?: return

        emailSender.sendEmailAsync(
            to = email,
            subject = "Une tâche vous a été assignée : ${task.title}",
            message = """
                |Bonjour !
                |
                |Une tâche vous a été assignée par ${assigner.login} :
                |
                |    ${task.title}
                |
                |Vous pouvez consultez les détails de cette tâche sur
                |https://bd.globe42.fr/tasks/mine.
                |
                |Ciao !
                |
                |--
                |L'application Globe42
                |
            """.trimMargin()
        )
    }
}
