package org.globe42.web.incomes;

import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import org.globe42.dao.IncomeSourceDao;
import org.globe42.dao.IncomeSourceTypeDao;
import org.globe42.domain.IncomeSource;
import org.globe42.domain.IncomeSourceType;
import org.globe42.web.exception.BadRequestException;
import org.globe42.web.exception.ErrorCode;
import org.globe42.web.exception.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller used to deal with the CRUD of income sources.
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = "/api/income-sources")
@Transactional
public class IncomeSourceController {

    private final IncomeSourceDao incomeSourceDao;
    private final IncomeSourceTypeDao incomeSourceTypeDao;

    public IncomeSourceController(IncomeSourceDao incomeSourceDao,
                                  IncomeSourceTypeDao incomeSourceTypeDao) {
        this.incomeSourceDao = incomeSourceDao;
        this.incomeSourceTypeDao = incomeSourceTypeDao;
    }

    @GetMapping
    public List<IncomeSourceDTO> list() {
        return incomeSourceDao.findAll().stream().map(IncomeSourceDTO::new).collect(Collectors.toList());
    }

    @GetMapping("/{sourceId}")
    public IncomeSourceDTO get(@PathVariable("sourceId") Long sourceId) {
        return incomeSourceDao.findById(sourceId)
                              .map(IncomeSourceDTO::new)
                              .orElseThrow(() -> new NotFoundException("No income source with ID " + sourceId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IncomeSourceDTO create(@Validated @RequestBody IncomeSourceCommandDTO command) {
        if (incomeSourceDao.existsByName(command.getName())) {
            throw new BadRequestException(ErrorCode.INCOME_SOURCE_NAME_ALREADY_EXISTS);
        }

        IncomeSource source = new IncomeSource();
        copyCommandToSource(command, source);
        return new IncomeSourceDTO(incomeSourceDao.save(source));
    }

    @PutMapping("/{sourceId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@PathVariable("sourceId") Long sourceId, @Validated @RequestBody IncomeSourceCommandDTO command) {
        IncomeSource source = incomeSourceDao.findById(sourceId).orElseThrow(NotFoundException::new);

        incomeSourceDao.findByName(command.getName()).filter(other -> !other.getId().equals(sourceId)).ifPresent(other -> {
            throw new BadRequestException(ErrorCode.INCOME_SOURCE_NAME_ALREADY_EXISTS);
        });

        copyCommandToSource(command, source);
    }

    private void copyCommandToSource(IncomeSourceCommandDTO command, IncomeSource source) {
        source.setName(command.getName());
        source.setType(loadIncomeSourceType(command.getTypeId()));
        source.setMaxMonthlyAmount(command.getMaxMonthlyAmount());
    }

    private IncomeSourceType loadIncomeSourceType(Long typeId) {
        return incomeSourceTypeDao.findById(typeId).orElseThrow(NotFoundException::new);
    }
}
