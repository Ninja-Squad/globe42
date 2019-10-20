package org.globe42.web.charges

import com.fasterxml.jackson.databind.ObjectMapper
import com.ninjasquad.springmockk.MockkBean
import io.mockk.every
import org.globe42.dao.ChargeDao
import org.globe42.dao.ChargeTypeDao
import org.globe42.dao.PersonDao
import org.globe42.domain.Charge
import org.globe42.domain.Person
import org.globe42.test.GlobeMvcTest
import org.globe42.web.test.jsonValue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import java.math.BigDecimal

/**
 * MVC tests for [ChargeController]
 * @author JB Nizet
 */
@GlobeMvcTest(ChargeController::class)
class ChargeControllerMvcTest(
    @Autowired private val mvc: MockMvc,
    @Autowired private val objectMapper: ObjectMapper
) {
    @MockkBean
    private lateinit var mockPersonDao: PersonDao

    @MockkBean(relaxUnitFun = true)
    private lateinit var mockChargeDao: ChargeDao

    @MockkBean
    private lateinit var mockChargeTypeDao: ChargeTypeDao

    private lateinit var person: Person

    @BeforeEach
    fun prepare() {
        person = Person(42L)
        every { mockPersonDao.findByIdOrNull(person.id!!) } returns person
    }

    @Test
    fun `should list`() {
        val charge = createCharge(12L)
        person.addCharge(charge)

        mvc.get("/api/persons/{personId}/charges", person.id).andExpect {
            status { isOk }

            jsonValue("$[0].id", charge.id!!)
            jsonValue("$[0].monthlyAmount", charge.monthlyAmount.toDouble())
            jsonValue("$[0].type.id", charge.type.id!!.toInt())
        }
    }

    @Test
    fun `should delete`() {
        val charge = createCharge(12L)
        person.addCharge(charge)

        every { mockChargeDao.findByIdOrNull(charge.id!!) } returns charge

        mvc.delete("/api/persons/{personId}/charges/{chargeId}", person.id, charge.id).andExpect {
            status { isNoContent }
        }
    }

    @Test
    fun `should create`() {
        val chargeTypeId = 12L
        val chargeType = createChargeType(chargeTypeId)

        every { mockChargeTypeDao.findByIdOrNull(chargeType.id!!) } returns chargeType
        every { mockChargeDao.save(any<Charge>()) } answers { arg<Charge>(0).apply { id = 345L } }

        val command = ChargeCommandDTO(chargeTypeId, BigDecimal.TEN)
        mvc.post("/api/persons/{personId}/charges", person.id) {
            contentType = MediaType.APPLICATION_JSON
            content = objectMapper.writeValueAsBytes(command)
        }.andExpect {
            status { isCreated }
            jsonValue("$.id", 345)
        }
    }
}
