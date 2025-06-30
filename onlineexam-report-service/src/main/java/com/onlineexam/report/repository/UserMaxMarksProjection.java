package com.onlineexam.report.repository;

/**
 * Projection interface for mapping user ID and their maximum total marks.
 * This is used with Spring Data JPA queries to retrieve specific columns
 * from the database results.
 */
public interface UserMaxMarksProjection {
    Integer getUserId();
    Integer getMaxMarks();
}
