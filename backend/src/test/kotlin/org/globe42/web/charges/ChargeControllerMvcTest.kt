package org.globe42.web.charges

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.whenever
import org.globe42.dao.ChargeDao
import org.globe42.dao.ChargeTypeDao
import org.globe42.dao.PersonDao
import org.globe42.domain.Charge
import org.globe42.domain.Person
import org.globe42.test.GlobeMvcTest
import org.globe42.test.thenReturnModifiedFirstArgument
import org.globe42.web.jsonValue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import java.math.BigDecimal
import java.util.*

/**
 * MVC tests for [ChargeController]
 * @author JB Nizet
 */
@GlobeMvcTest(ChargeController::class)
class ChargeControllerMvcTest(
    @Autowired private val mvc: MockMvc,
    @Autowired private val objectMapper: ObjectMapper
) {
    @MockBean
    private lateinit var mockPersonDao: PersonDao

    @MockBean
    private lateinit var mockChargeDao: ChargeDao

    @MockBean
    private lateinit var mockChargeTypeDao: ChargeTypeDao

    private lateinit var person: Person

    @BeforeEach
    fun prepare() {
        person = Person(42L)
        whenever(mockPersonDao.findById(person.id!!)).thenReturn(Optional.of(person))
    }

    @Test
    fun `should list`() {
        val charge = createCharge(12L)
        person.addCharge(charge)

        mvc.get("/api/persons/{personId}/charges", person.id).andExpect {
            status() { isOk }

            jsonValue("$[0].id", charge.id!!)
            jsonValue("$[0].monthlyAmount", charge.monthlyAmount.toDouble())
            jsonValue("$[0].type.id", charge.type.id!!.toInt())
        }
    }

    @Test
    fun `should delete`() {
        val charge = createCharge(12L)
        person.addCharge(charge)

        whenever(mockChargeDao.findById(charge.id!!)).thenReturn(Optional.of(charge))

        mvc.delete("/api/persons/{personId}/charges/{chargeId}", person.id, charge.id).andExpect {
            status() { isNoContent }
        }
    }

    @Test
    fun `should create`() {
        val chargeTypeId = 12L
        val chargeType = createChargeType(chargeTypeId)

        whenever(mockChargeTypeDao.findById(chargeType.id!!)).thenReturn(Optional.of(chargeType))
        whenever(mockChargeDao.save(any<Charge>()))
            .thenReturnModifiedFirstArgument<Charge> { charge -> charge.id = 345L }

        val command = ChargeCommandDTO(chargeTypeId, BigDecimal.TEN)
        mvc.post("/api/persons/{personId}/charges", person.id) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status() { isCreated }
            jsonValue("$.id", 345)
        }
    }
}
