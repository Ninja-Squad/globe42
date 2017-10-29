package org.globe42.dao;

import org.globe42.domain.SpentTime;
import org.globe42.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * DAO for {@link SpentTime}
 * @author JB Nizet
 */
public interface SpentTimeDao extends JpaRepository<SpentTime, Long> {

    @Query("update SpentTime spentTime set spentTime.creator = null where spentTime.creator = :user")
    @Modifying
    void resetCreatorOnSpentTimesCreatedBy(@Param("user") User user);
}
