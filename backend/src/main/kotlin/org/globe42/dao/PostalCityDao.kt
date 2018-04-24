package org.globe42.dao

import org.globe42.domain.PostalCity
import org.springframework.data.jpa.repository.JpaRepository

/**
 * DAO for [org.globe42.domain.PostalCity]
 * @author JB Nizet
 */
interface PostalCityDao : JpaRepository<PostalCity, Long>, PostalCityDaoCustom
