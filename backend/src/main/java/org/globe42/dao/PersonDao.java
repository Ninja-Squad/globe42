package org.globe42.dao;

import java.util.List;

import org.globe42.domain.ActivityType;
import org.globe42.domain.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * DAO for the {@link org.globe42.domain.Person} entity
 * @author JB Nizet
 */
public interface PersonDao extends JpaRepository<Person, Long>, PersonDaoCustom {
    @Query("select person from Participation participation"
        + " join participation.person person"
        + " where participation.activityType = :activityType")
    List<Person> findParticipants(@Param("activityType") ActivityType activityType);
}
