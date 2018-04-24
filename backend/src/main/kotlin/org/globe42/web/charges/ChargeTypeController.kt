package org.globe42.web.charges;

import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import org.globe42.dao.ChargeCategoryDao;
import org.globe42.dao.ChargeTypeDao;
import org.globe42.domain.ChargeCategory;
import org.globe42.domain.ChargeType;
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
 * REST controller used to deal with the CRUD of charge types.
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = "/api/charge-types")
@Transactional
public class ChargeTypeController {

    private final ChargeTypeDao chargeTypeDao;
    private final ChargeCategoryDao chargeCategoryDao;

    public ChargeTypeController(ChargeTypeDao chargeTypeDao,
                                  ChargeCategoryDao chargeCategoryDao) {
        this.chargeTypeDao = chargeTypeDao;
        this.chargeCategoryDao = chargeCategoryDao;
    }

    @GetMapping
    public List<ChargeTypeDTO> list() {
        return chargeTypeDao.findAll().stream().map(ChargeTypeDTO::new).collect(Collectors.toList());
    }

    @GetMapping("/{typeId}")
    public ChargeTypeDTO get(@PathVariable("typeId") Long typeId) {
        return chargeTypeDao.findById(typeId)
                            .map(ChargeTypeDTO::new)
                            .orElseThrow(() -> new NotFoundException("No charge type with ID " + typeId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ChargeTypeDTO create(@Validated @RequestBody ChargeTypeCommandDTO command) {
        if (chargeTypeDao.existsByName(command.getName())) {
            throw new BadRequestException(ErrorCode.INCOME_SOURCE_NAME_ALREADY_EXISTS);
        }

        ChargeType source = new ChargeType();
        copyCommandToSource(command, source);
        return new ChargeTypeDTO(chargeTypeDao.save(source));
    }

    @PutMapping("/{typeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@PathVariable("typeId") Long typeId, @Validated @RequestBody ChargeTypeCommandDTO command) {
        ChargeType source = chargeTypeDao.findById(typeId).orElseThrow(NotFoundException::new);

        chargeTypeDao.findByName(command.getName()).filter(other -> !other.getId().equals(typeId)).ifPresent(other -> {
            throw new BadRequestException(ErrorCode.CHARGE_TYPE_NAME_ALREADY_EXISTS);
        });

        copyCommandToSource(command, source);
    }

    private void copyCommandToSource(ChargeTypeCommandDTO command, ChargeType source) {
        source.setName(command.getName());
        source.setCategory(loadChargeCategory(command.getCategoryId()));
        source.setMaxMonthlyAmount(command.getMaxMonthlyAmount());
    }

    private ChargeCategory loadChargeCategory(Long categoryId) {
        return chargeCategoryDao.findById(categoryId).orElseThrow(NotFoundException::new);
    }
}
