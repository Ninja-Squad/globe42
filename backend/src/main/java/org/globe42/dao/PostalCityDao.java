package org.globe42.dao;

import org.globe42.domain.PostalCity;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * DAO for {@link org.globe42.domain.PostalCity}
 * @author JB Nizet
 */
public interface PostalCityDao extends JpaRepository<PostalCity, Long>, PostalCityDaoCustom {

}
