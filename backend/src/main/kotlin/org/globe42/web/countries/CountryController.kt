package org.globe42.web.countries

import org.globe42.dao.CountryDao
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import javax.transaction.Transactional

/**
 * Controller used to list countries (used as nationalities).
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = ["/api/countries"])
@Transactional
class CountryController(private val countryDao: CountryDao) {

    @GetMapping
    fun list(): List<CountryDTO> {
        return countryDao.findAllSortedByName().map(::CountryDTO)
    }
}
