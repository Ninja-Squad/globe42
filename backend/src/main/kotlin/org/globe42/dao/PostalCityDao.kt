package org.globe42.dao

import org.globe42.domain.PostalCity

/**
 * DAO for [org.globe42.domain.PostalCity]
 * @author JB Nizet
 */
interface PostalCityDao : GlobeRepository<PostalCity, Long>, PostalCityDaoCustom
