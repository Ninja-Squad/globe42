package org.globe42.web.persons;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.globe42.dao.PersonDao;
import org.globe42.domain.ActivityType;
import org.globe42.domain.Participation;
import org.globe42.domain.Person;
import org.globe42.test.BaseTest;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

/**
 * Unit tests for {@link ParticipationController}
 * @author JB Nizet
 */
public class ParticipationControllerTest extends BaseTest {
    @Mock
    private PersonDao mockPersonDao;

    @InjectMocks
    private ParticipationController controller;

    private Person person;
    private Participation mealParticipation;

    @Before
    public void prepare() {
        person = new Person(42L);
        mealParticipation = new Participation(34L);
        mealParticipation.setActivityType(ActivityType.MEAL);
        person.addParticipation(mealParticipation);
        when(mockPersonDao.findById(person.getId())).thenReturn(Optional.of(person));
    }

    @Test
    public void shouldList() {
        List<ParticipationDTO> result = controller.list(person.getId());

        assertThat(result).extracting(ParticipationDTO::getId).containsExactly(mealParticipation.getId());
        assertThat(result).extracting(ParticipationDTO::getActivityType).containsExactly(mealParticipation.getActivityType());
    }

    @Test
    public void shouldCreate() {
        ParticipationCommandDTO command = new ParticipationCommandDTO(ActivityType.SOCIAL_MEDIATION);
        ParticipationDTO result = controller.create(person.getId(), command);

        assertThat(result.getActivityType()).isEqualTo(command.getActivityType());
        assertThat(person.getParticipations()).extracting(Participation::getActivityType)
                                              .containsOnly(ActivityType.MEAL, ActivityType.SOCIAL_MEDIATION);
    }

    @Test
    public void shouldDelete() {
        controller.delete(person.getId(), mealParticipation.getId());

        assertThat(person.getParticipations()).isEmpty();
    }
}
