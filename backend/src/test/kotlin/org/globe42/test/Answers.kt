package org.globe42.test;

import java.util.function.Consumer;

import org.mockito.stubbing.Answer;

/**
 * Utility class
 * @author JB Nizet
 */
public class Answers {
    private Answers() {
    }

    /**
     * Creates an answer that returns the first argument of the invocation, modified by the given consumer.
     * Useful to mock a DAO save method that returns its argument with a generated ID.
     */
    public static <T> Answer<T> modifiedFirstArgument(Consumer<? super T> argModifier) {
        return invocation -> {
            T firstArgument = invocation.getArgument(0);
            argModifier.accept(firstArgument);
            return firstArgument;
        };
    }
}
