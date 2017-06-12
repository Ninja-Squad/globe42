package org.globe42.web.incomes;

import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import org.globe42.dao.IncomeSourceTypeDao;
import org.globe42.domain.IncomeSourceType;
import org.globe42.web.exception.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IncomeSourceTypeDTO create(@Validated @RequestBody IncomeSourceTypeCommandDTO command) {
        if (incomeSourceTypeDao.existsByType(command.getType())) {
            throw new BadRequestException("This type is already used by another income source type");
        }

        IncomeSourceType type = new IncomeSourceType();
        copyCommandToType(command, type);
        return new IncomeSourceTypeDTO(incomeSourceTypeDao.save(type));
    }

    private void copyCommandToType(IncomeSourceTypeCommandDTO command, IncomeSourceType type) {
        type.setType(command.getType());
    }
}
