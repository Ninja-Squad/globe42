package org.globe42.web.incomes;

import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import org.globe42.dao.IncomeSourceTypeDao;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller used to deal with the CRUD of income sources.
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = "/api/income-source-types")
@Transactional
public class IncomeSourceTypeController {

    private final IncomeSourceTypeDao incomeSourceTypeDao;

    public IncomeSourceTypeController(IncomeSourceTypeDao incomeSourceTypeDao) {
        this.incomeSourceTypeDao = incomeSourceTypeDao;
    }

    @GetMapping
    public List<IncomeSourceTypeDTO> list() {
        return incomeSourceTypeDao.findAll().stream().map(IncomeSourceTypeDTO::new).collect(Collectors.toList());
    }
}
