package com.onlineexam.report.repository;

import com.onlineexam.report.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {

	@Query("SELECT r FROM Report r WHERE r.marksObtained = (SELECT MAX(r2.marksObtained) FROM Report r2)")
	List<Report> findTopperByMarksObtained(); // Changed method name and query

	List<Report> findByExamId(Integer examId);

	List<Report> findByUserId(Integer userId);

	Optional<Report> findByUserIdAndExamId(Integer userId, Integer examId);

    @Query("SELECT COUNT(DISTINCT r.examId) FROM Report r WHERE r.userId = :userId")
    long countDistinctExamIdsByUserId(Integer userId);

    /**
     * Retrieves a list of distinct user IDs and their maximum marks obtained,
     * ordered by marks obtained in descending order. This is used for ranking.
     * The results are mapped to the {@link UserMaxMarksProjection} interface.
     *
     * @return A list of {@link UserMaxMarksProjection} containing user IDs and their highest scores.
     */
    @Query("SELECT r.userId AS userId, MAX(r.marksObtained) AS maxMarks " + // Changed to marksObtained
           "FROM Report r " +
           "GROUP BY r.userId " +
           "ORDER BY MAX(r.marksObtained) DESC") // Changed to marksObtained
    List<UserMaxMarksProjection> findUserMaxMarksOrderedByMarksObtainedDesc(); // Changed method name
}
