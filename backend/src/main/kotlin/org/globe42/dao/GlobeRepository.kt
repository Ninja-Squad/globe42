package org.globe42.dao

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.NoRepositoryBean

/**
 * Custom base repository interface, used mainly to avoid having to use an extension function for findByIdOrNull,
 * in order to be able to mock it in an easier way (see https://github.com/mockk/mockk/issues/369#issuecomment-544242489)
 * @author JB Nizet
 */
@NoRepositoryBean
interface GlobeRepository<T: Any, ID: Any>: JpaRepository<T, ID> {
    fun findByIdOrNull(id: ID): T? = findById(id).orElse(null)
}
