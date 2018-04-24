package org.globe42.web.incomes;

import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import org.globe42.dao.IncomeSourceTypeDao;
import org.globe42.domain.IncomeSourceType;
import org.globe42.web.exception.BadRequestException;
import org.globe42.web.exception.ErrorCode;
import org.globe42.web.exception.NotFoundException;
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

    @GetMapping("/{typeId}")
    public IncomeSourceTypeDTO get(@PathVariable("typeId") Long typeId) {
        return incomeSourceTypeDao.findById(typeId)
                .map(IncomeSourceTypeDTO::new)
                .orElseThrow(() -> new NotFoundException("No income source type with ID " + typeId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IncomeSourceTypeDTO create(@Validated @RequestBody IncomeSourceTypeCommandDTO command) {
        if (incomeSourceTypeDao.existsByType(command.getType())) {
            throw new BadRequestException(ErrorCode.INCOME_SOURCE_TYPE_NAME_ALREADY_EXISTS);
        }

        IncomeSourceType type = new IncomeSourceType();
        copyCommandToType(command, type);
        return new IncomeSourceTypeDTO(incomeSourceTypeDao.save(type));
    }

    @PutMapping("/{typeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@PathVariable("typeId") Long typeId, @Validated @RequestBody IncomeSourceTypeCommandDTO command) {
        IncomeSourceType type = incomeSourceTypeDao.findById(typeId).orElseThrow(NotFoundException::new);

        incomeSourceTypeDao.findByType(command.getType()).filter(other -> !other.getId().equals(typeId)).ifPresent(other -> {
            throw new BadRequestException(ErrorCode.INCOME_SOURCE_TYPE_NAME_ALREADY_EXISTS);
        });

        copyCommandToType(command, type);
    }

    private void copyCommandToType(IncomeSourceTypeCommandDTO command, IncomeSourceType type) {
        type.setType(command.getType());
    }
}
