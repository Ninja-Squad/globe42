package org.globe42.web.activities;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.globe42.dao.PersonDao;
import org.globe42.domain.ActivityType;
import org.globe42.domain.Person;
import org.globe42.test.BaseTest;
import org.globe42.web.persons.PersonIdentityDTO;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

/**
 * Unit tests for {@link ActivityTypeController}
 * @author JB Nizet
 */
public class ActivityTypeControllerTest extends BaseTest {
    @Mock
    private PersonDao mockPersonDao;

    @InjectMocks
    private ActivityTypeController controller;

    @Test
    public void shouldListParticipants() {
        Person person = new Person(42L);
        when(mockPersonDao.findParticipants(ActivityType.MEAL)).thenReturn(Arrays.asList(person));

        List<PersonIdentityDTO> result = controller.list(ActivityType.MEAL);
        assertThat(result).extracting(PersonIdentityDTO::getId).containsExactly(42L);
    }
}
