package org.globe42.web.persons;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.globe42.dao.PersonDao;
import org.globe42.domain.Person;
import org.globe42.domain.WeddingEvent;
import org.globe42.domain.WeddingEventType;
import org.globe42.test.BaseTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

/**
 * Unit tests for {@link WeddingEventController}
 * @author JB Nizet
 */
public class WeddingEventControllerTest extends BaseTest {
    @Mock
    private PersonDao mockPersonDao;

    @InjectMocks
    private WeddingEventController controller;

    private Person person;
    private WeddingEvent firstWedding;
    private WeddingEvent firstDivorce;

    @BeforeEach
    public void prepare() {
        person = new Person(42L);
        firstWedding = new WeddingEvent(34L);
        firstWedding.setDate(LocalDate.of(2000, 2, 28));
        firstWedding.setType(WeddingEventType.WEDDING);

        firstDivorce = new WeddingEvent(35L);
        firstDivorce.setDate(LocalDate.of(2002, 3, 28));
        firstDivorce.setType(WeddingEventType.DIVORCE);

        person.addWeddingEvent(firstWedding);
        person.addWeddingEvent(firstDivorce);
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));
    }

    @Test
    public void shouldList() {
        List<WeddingEventDTO> result = controller.list(person.getId());

        assertThat(result).extracting(WeddingEventDTO::getId).containsExactly(firstWedding.getId(), firstDivorce.getId());
        assertThat(result).extracting(WeddingEventDTO::getDate).containsExactly(firstWedding.getDate(), firstDivorce.getDate());
        assertThat(result).extracting(WeddingEventDTO::getType).containsExactly(firstWedding.getType(), firstDivorce.getType());
    }

    @Test
    public void shouldCreate() {
        WeddingEventCommandDTO command = new WeddingEventCommandDTO(LocalDate.of(2018, 3, 1),
                                                                    WeddingEventType.WEDDING);
        WeddingEventDTO result = controller.create(person.getId(), command);

        assertThat(result.getDate()).isEqualTo(command.getDate());
        assertThat(result.getType()).isEqualTo(command.getType());
        assertThat(person.getWeddingEvents()).hasSize(3);
    }

    @Test
    public void shouldDelete() {
        controller.delete(person.getId(), firstDivorce.getId());

        assertThat(person.getWeddingEvents()).hasSize(1);
    }
}
