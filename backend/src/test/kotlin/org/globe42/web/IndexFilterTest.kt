package org.globe42.web

import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.mock
import com.nhaarman.mockitokotlin2.never
import com.nhaarman.mockitokotlin2.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import javax.servlet.FilterChain

/**
 * Unit tests for [IndexFilter]
 * @author JB Nizet
 */
class IndexFilterTest {
    @Test
    fun `should forward to index html when not in production`() {
        val request = MockHttpServletRequest("GET", "/foo")
        val response = MockHttpServletResponse()
        val chain = mock<FilterChain>()
        val filter = IndexFilter()
        filter.doFilter(request, response, chain)

        verify(chain, never()).doFilter(any(), any())
        assertThat(response.forwardedUrl).isEqualTo("/index.html")
    }

    @Test
    fun `should not forward to index html when not in production`() {
        val request = MockHttpServletRequest("GET", "/api/persons")
        val response = MockHttpServletResponse()
        val chain = mock<FilterChain>()
        val filter = IndexFilter()
        filter.doFilter(request, response, chain)

        verify(chain).doFilter(any(), any())
        assertThat(response.forwardedUrl).isNull()
    }

    @Test
    fun `should redirect to https url when production in http`() {
        val request = MockHttpServletRequest("GET", "/foo?a=b&c=d")
        request.addHeader("X-Forwarded-Proto", "http")
        val response = MockHttpServletResponse()
        val chain = mock<FilterChain>()
        val filter = IndexFilter()
        filter.doFilter(request, response, chain)

        verify(chain, never()).doFilter(any(), any())
        assertThat(response.forwardedUrl).isNull()
        assertThat(response.redirectedUrl).isEqualTo("https://bd.globe42.fr/foo?a=b&c=d")
    }

    @Test
    fun `should send 403 when production in http`() {
        val request = MockHttpServletRequest("GET", "/api/persons")
        request.addHeader("X-Forwarded-Proto", "http")
        val response = MockHttpServletResponse()
        val chain = mock<FilterChain>()
        val filter = IndexFilter()
        filter.doFilter(request, response, chain)

        verify(chain, never()).doFilter(any(), any())
        assertThat(response.forwardedUrl).isNull()
        assertThat(response.redirectedUrl).isNull()
        assertThat(response.status).isEqualTo(HttpStatus.FORBIDDEN.value())
    }

    @Test
    fun `should forward to index html when production in https`() {
        val request = MockHttpServletRequest("GET", "/foo")
        request.addHeader("X-Forwarded-Proto", "https")
        val response = MockHttpServletResponse()
        val chain = mock<FilterChain>()
        val filter = IndexFilter()
        filter.doFilter(request, response, chain)

        verify(chain, never()).doFilter(any(), any())
        assertThat(response.forwardedUrl).isEqualTo("/index.html")
    }

    @Test
    fun `should not forward when production in https`() {
        val request = MockHttpServletRequest("GET", "/api/persons")
        request.addHeader("X-Forwarded-Proto", "https")
        val response = MockHttpServletResponse()
        val chain = mock<FilterChain>()
        val filter = IndexFilter()
        filter.doFilter(request, response, chain)

        verify(chain).doFilter(any(), any())
        assertThat(response.forwardedUrl).isNull()
    }
}
