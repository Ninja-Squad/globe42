package org.globe42.web.activities

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.globe42.dao.ActivityDao
import org.globe42.dao.PersonDao
import org.globe42.domain.Activity
import org.globe42.domain.ActivityType
import org.globe42.domain.IncomeSourceType
import org.globe42.domain.Person
import org.globe42.test.GlobeMvcTest
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import org.springframework.test.web.servlet.put
import java.time.LocalDate

/**
 * Uni tests for [ActivityController]
 * @author JB Nizet
 */
@GlobeMvcTest(ActivityController::class)
class ActivityControllerMvcTest(
    @Autowired val mockMvc: MockMvc,
    @Autowired val objectMapper: ObjectMapper
) {

    @MockkBean(relaxUnitFun = true)
    lateinit var mockActivityDao: ActivityDao

    @MockkBean
    lateinit var mockPersonDao: PersonDao

    lateinit var activity: Activity

    @BeforeEach
    fun prepare() {
        activity = Activity(42L).apply {
            date = LocalDate.of(2021, 2, 14)
            type = ActivityType.MEAL
            addParticipant(
                Person(10L).apply {
                    firstName = "JB"
                    lastName = "Nizet"
                    email = "jb@mail.com"
                    phoneNumber = "0987654321"
                }
            )
        }

        every { mockActivityDao.findByIdOrNull(activity.id!!) } returns activity
    }

    @Test
    fun `should list`() {
        val pageRequest = PageRequest.of(1, PAGE_SIZE)
        every { mockActivityDao.pageAll(pageRequest) } returns PageImpl(
            listOf(activity),
            pageRequest,
            1 + PAGE_SIZE.toLong()
        )

        mockMvc.get("/api/activities?page=1")
            .andExpect {
                status { isOk() }
                jsonPath("$.content[0].id") { value(42) }
                jsonPath("$.content[0].type") { value(ActivityType.MEAL.name) }
                jsonPath("$.content[0].date") { value("2021-02-14") }
                jsonPath("$.content[0].type") { value(ActivityType.MEAL.name) }
                jsonPath("$.content[0].participants[0].id") { value(10) }
                jsonPath("$.content[0].participants[0].firstName") { value("JB") }
                jsonPath("$.content[0].participants[0].lastName") { value("Nizet") }
            }
    }

    @Test
    fun `should list for a given type`() {
        val pageRequest = PageRequest.of(0, PAGE_SIZE)
        every { mockActivityDao.pageByType(ActivityType.MEAL, pageRequest) } returns PageImpl(
            listOf(activity),
            pageRequest,
            1
        )

        mockMvc.get("/api/activities?type=MEAL")
            .andExpect {
                status { isOk() }
                jsonPath("$.content[0].id") { value(42) }
            }
    }

    @Test
    fun `should get`() {
        mockMvc.get("/api/activities/${activity.id}")
            .andExpect {
                status { isOk() }
                jsonPath("$.id") { value(42) }
            }
    }

    @Test
    fun `should create`() {
        val person1 = Person(1L).apply {
            firstName = "JB"
            lastName = "Nizet"
        }
        val person2 = Person(2L).apply {
            firstName = "Claire"
            lastName =  "Brucy"
        }

        val command = ActivityCommandDTO(
            type = ActivityType.MEAL,
            date = LocalDate.of(2021, 2, 14),
            participantIds = setOf(person1.id!!, person2.id!!)
        )

        every { mockPersonDao.findByIdOrNull(person1.id!!) } returns person1
        every { mockPersonDao.findByIdOrNull(person2.id!!) } returns person2

        every { mockActivityDao.saveAndFlush(any()) } answers { arg<Activity>(0).apply { id = 42L } }

        mockMvc.post("/api/activities") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }
            .andExpect {
                status { isCreated() }
                jsonPath("$.id") { value(42) }
            }

        verify { mockActivityDao.saveAndFlush(
            withArg { activity ->
                assertThat(activity.type).isEqualTo(command.type)
                assertThat(activity.date).isEqualTo(command.date)
                assertThat(activity.getParticipants()).containsOnly(person1, person2)
            })
        }
    }

    @Test
    fun `should update`() {
        val person2 = Person(2L).apply {
            firstName = "Claire"
            lastName =  "Brucy"
        }

        every { mockPersonDao.findByIdOrNull(person2.id!!) } returns person2

        val command = ActivityCommandDTO(
            type = ActivityType.HEALTH_WORKSHOP,
            date = LocalDate.of(2021, 2, 15),
            participantIds = setOf(person2.id!!)
        )

        mockMvc.put("/api/activities/${activity.id}") {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }
            .andExpect {
                status { isNoContent() }
            }

        assertThat(activity.type).isEqualTo(command.type)
        assertThat(activity.date).isEqualTo(command.date)
        assertThat(activity.getParticipants()).containsOnly(person2)
    }

    @Test
    fun `should delete`() {
        mockMvc.delete("/api/activities/${activity.id}").andExpect {
            status { isNoContent() }
        }

        verify { mockActivityDao.delete(activity) }
    }
}
