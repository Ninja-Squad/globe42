package org.globe42.web.countries;

import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import org.globe42.dao.CountryDao;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller used to list countries (used as nationalities).
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = "/api/countries")
@Transactional
public class CountryController {

    private final CountryDao countryDao;

    public CountryController(CountryDao countryDao) {
        this.countryDao = countryDao;
    }

    @GetMapping
    public List<CountryDTO> list() {
        return countryDao.findAllSortedByName().stream().map(CountryDTO::new).collect(Collectors.toList());
    }
}
