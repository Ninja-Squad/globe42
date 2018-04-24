package org.globe42.web.charges

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockito_kotlin.any
import com.nhaarman.mockito_kotlin.whenever
import org.globe42.dao.ChargeDao
import org.globe42.dao.ChargeTypeDao
import org.globe42.dao.PersonDao
import org.globe42.domain.Charge
import org.globe42.domain.Person
import org.globe42.test.GlobeMvcTest
import org.globe42.test.thenReturnModifiedFirstArgument
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.math.BigDecimal
import java.util.*

/**
 * MVC tests for [ChargeController]
 * @author JB Nizet
 */
@GlobeMvcTest(ChargeController::class)
class ChargeControllerMvcTest {
    @MockBean
    private lateinit var mockPersonDao: PersonDao

    @MockBean
    private lateinit var mockChargeDao: ChargeDao

    @MockBean
    private lateinit var mockChargeTypeDao: ChargeTypeDao

    @Autowired
    private lateinit var mvc: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    private lateinit var person: Person

    @BeforeEach
    fun prepare() {
        person = Person(42L)
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))
    }

    @Test
    fun shouldList() {
        val charge = createCharge(12L)
        person.addCharge(charge)

        mvc.perform(get("/api/persons/{personId}/charges", person.id))
                .andExpect(status().isOk)
                .andExpect(jsonPath("$[0].id").value(charge.id!!))
                .andExpect(jsonPath("$[0].monthlyAmount").value(charge.monthlyAmount!!.toDouble()))
                .andExpect(jsonPath("$[0].type.id").value(charge.type!!.id!!.toInt()))
    }

    @Test
    fun shouldDelete() {
        val charge = createCharge(12L)
        person.addCharge(charge)

        whenever(mockChargeDao.findById(charge.id!!)).thenReturn(Optional.of(charge))

        mvc.perform(delete("/api/persons/{personId}/charges/{chargeId}", person.id, charge.id))
                .andExpect(status().isNoContent)
    }

    @Test
    fun shouldCreate() {
        val chargeTypeId = 12L
        val chargeType = createChargeType(chargeTypeId)

        whenever(mockChargeTypeDao.findById(chargeType.id!!)).thenReturn(Optional.of(chargeType))
        whenever(mockChargeDao.save(any<Charge>()))
                .thenReturnModifiedFirstArgument<Charge> { charge -> charge.id = 345L }

        val command = ChargeCommandDTO(chargeTypeId, BigDecimal.TEN)
        mvc.perform(post("/api/persons/{personId}/charges", person.id)
                              .contentType(MediaType.APPLICATION_JSON)
                              .content(objectMapper.writeValueAsBytes(command)))
                .andExpect(status().isCreated)
                .andExpect(jsonPath("$.id").value(345))
    }
}
