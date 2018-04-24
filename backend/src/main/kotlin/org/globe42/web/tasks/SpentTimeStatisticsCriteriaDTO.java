package org.globe42.web.tasks;

import java.time.LocalDate;
import java.util.Objects;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

/**
 * Criteria, passed as request parameters, used to get statistics about spent times on tasks
 * @author JB Nizet
 */
public final class SpentTimeStatisticsCriteriaDTO {

    private final LocalDate fromDate;
    private final LocalDate toDate;

    public SpentTimeStatisticsCriteriaDTO(@DateTimeFormat(iso = ISO.DATE) LocalDate from,
                                          @DateTimeFormat(iso = ISO.DATE) LocalDate to) {
        this.fromDate = from;
        this.toDate = to;
    }

    public LocalDate getFromDate() {
        return fromDate;
    }

    public LocalDate getToDate() {
        return toDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        SpentTimeStatisticsCriteriaDTO that = (SpentTimeStatisticsCriteriaDTO) o;
        return Objects.equals(fromDate, that.fromDate) &&
            Objects.equals(toDate, that.toDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(fromDate, toDate);
    }
}
