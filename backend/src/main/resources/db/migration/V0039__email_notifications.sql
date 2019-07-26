ALTER TABLE guser
    ADD COLUMN email VARCHAR;
ALTER TABLE guser
    ADD COLUMN task_assignment_email_notification_enabled BOOLEAN;
UPDATE guser set task_assignment_email_notification_enabled = false;
ALTER TABLE guser
    ALTER task_assignment_email_notification_enabled SET NOT NULL;
