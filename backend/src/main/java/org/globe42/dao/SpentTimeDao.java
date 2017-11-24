package org.globe42.dao;

import org.globe42.domain.SpentTime;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * DAO for {@link SpentTime}
 * @author JB Nizet
 */
public interface SpentTimeDao extends JpaRepository<SpentTime, Long> {
}
