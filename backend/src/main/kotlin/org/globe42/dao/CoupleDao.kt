package org.globe42.dao;

import org.globe42.domain.Couple;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * DAO for {@link org.globe42.domain.Couple}
 * @author JB Nizet
 */
public interface CoupleDao extends JpaRepository<Couple, Long> {
}
