package org.globe42.test

import org.mockito.stubbing.OngoingStubbing

/**
 * Tells the stubbed method that it must return its first argument, modified by the given consumer.
 * Useful to mock a DAO save method that returns its argument with a generated ID.
 * For example:
 *
 * ```
 * whenever(userDao.save(user)).thenReturnModifiedFirstArgument<User> { it.id = 42L }
 * ```
 */
@Suppress("UNCHECKED_CAST")
fun <T> OngoingStubbing<*>.thenReturnModifiedFirstArgument(consumer: (T) -> Unit) {
    this.thenAnswer {
        val firstArgument = it.arguments[0] as T
        consumer(firstArgument)
        firstArgument
    }
}
