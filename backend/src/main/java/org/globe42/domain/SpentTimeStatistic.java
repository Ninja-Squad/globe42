package org.globe42.domain;

/**
 * TODO include class javadoc here
 * @author JB Nizet
 */
public final class SpentTimeStatistic {
    private final TaskCategory category;
    private final User user;
    private final int minutes;

    public SpentTimeStatistic(TaskCategory category, User user, int minutes) {
        this.category = category;
        this.user = user;
        this.minutes = minutes;
    }

    public TaskCategory getCategory() {
        return category;
    }

    public User getUser() {
        return user;
    }

    public int getMinutes() {
        return minutes;
    }
}
