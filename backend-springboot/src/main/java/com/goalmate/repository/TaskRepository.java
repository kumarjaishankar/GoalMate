package com.goalmate.repository;

import com.goalmate.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserId(Long userId);
    Optional<Task> findByIdAndUserId(Long id, Long userId);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.userId = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.userId = :userId AND t.completed = true")
    long countCompletedByUserId(@Param("userId") Long userId);
    
    @Query("SELECT t FROM Task t WHERE t.userId = :userId AND t.createdAt >= :startDate")
    List<Task> findByUserIdAndCreatedAtAfter(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate);
}