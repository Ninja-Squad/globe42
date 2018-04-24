package org.globe42.web.charges;

import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;

import org.globe42.dao.ChargeCategoryDao;
import org.globe42.domain.ChargeCategory;
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
 * REST controller used to deal with the CRUD of charge categories.
 * @author JB Nizet
 */
@RestController
@RequestMapping(value = "/api/charge-categories")
@Transactional
public class ChargeCategoryController {

    private final ChargeCategoryDao chargeCategoryDao;

    public ChargeCategoryController(ChargeCategoryDao chargeCategoryDao) {
        this.chargeCategoryDao = chargeCategoryDao;
    }

    @GetMapping
    public List<ChargeCategoryDTO> list() {
        return chargeCategoryDao.findAll().stream().map(ChargeCategoryDTO::new).collect(Collectors.toList());
    }

    @GetMapping("/{categoryId}")
    public ChargeCategoryDTO get(@PathVariable("categoryId") Long categoryId) {
        return chargeCategoryDao.findById(categoryId)
                .map(ChargeCategoryDTO::new)
                .orElseThrow(() -> new NotFoundException("No charge category with ID " + categoryId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ChargeCategoryDTO create(@Validated @RequestBody ChargeCategoryCommandDTO command) {
        if (chargeCategoryDao.existsByName(command.getName())) {
            throw new BadRequestException(ErrorCode.CHARGE_CATEGORY_NAME_ALREADY_EXISTS);
        }

        ChargeCategory type = new ChargeCategory();
        copyCommandToType(command, type);
        return new ChargeCategoryDTO(chargeCategoryDao.save(type));
    }

    @PutMapping("/{categoryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@PathVariable("categoryId") Long categoryId, @Validated @RequestBody ChargeCategoryCommandDTO command) {
        ChargeCategory type = chargeCategoryDao.findById(categoryId).orElseThrow(NotFoundException::new);

        chargeCategoryDao.findByName(command.getName()).filter(other -> !other.getId().equals(categoryId)).ifPresent(other -> {
            throw new BadRequestException(ErrorCode.INCOME_SOURCE_TYPE_NAME_ALREADY_EXISTS);
        });

        copyCommandToType(command, type);
    }

    private void copyCommandToType(ChargeCategoryCommandDTO command, ChargeCategory type) {
        type.setName(command.getName());
    }
}
