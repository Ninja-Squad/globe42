package org.globe42.dao;

import org.globe42.domain.Charge;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * DAO for the {@link Charge} entity
 * @author JB Nizet
 */
public interface ChargeDao extends JpaRepository<Charge, Long> {
}
