package org.globe42.web.cities;

import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import org.globe42.dao.PostalCityDao;
import org.globe42.domain.PostalCity;
import org.globe42.web.persons.CityDTO;
import org.globe42.web.security.AdminOnly;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller used to search for postal cities, and to import them.
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = "/api/cities")
@Transactional
public class PostalCityController {

    public static final int LIMIT = 10;

    private final PostalCityDao postalCityDao;
    private final PostalCityUploadParser uploadParser;

    public PostalCityController(PostalCityDao postalCityDao, PostalCityUploadParser uploadParser) {
        this.postalCityDao = postalCityDao;
        this.uploadParser = uploadParser;
    }

    @GetMapping(params = "query")
    public List<CityDTO> search(@RequestParam("query") String query) {
        List<PostalCity> cities;
        if (isNumeric(query)) {
            cities = postalCityDao.findByPostalCode(query, LIMIT);
        }
        else {
            cities = postalCityDao.findByCity(query, LIMIT);
        }

        return cities.stream().map(CityDTO::new).collect(Collectors.toList());
    }

    /**
     * Uploads a file, parses it, removes all the data in the postal_city table, and inserts all the cities
     * contained in the file.
     *
     * You can use the following command line to upload a file and invoke this method:
     * <pre
     *   curl -X POST -H "Authorization: Bearer $your-admin-token" $url/api/cities/uploads -T ~/Downloads/laposte_hexasmal.csv
     * </pre>
     */
    @PostMapping("/uploads")
    @AdminOnly
    @ResponseStatus(HttpStatus.CREATED)
    public void upload(@RequestBody byte[] data) {
        List<PostalCity> cities = uploadParser.parse(data);

        postalCityDao.deleteAll();
        postalCityDao.saveAllEfficiently(cities);
    }

    private boolean isNumeric(String query) {
        return query.chars().allMatch(c -> c >= '0' && c <= '9');
    }
}
