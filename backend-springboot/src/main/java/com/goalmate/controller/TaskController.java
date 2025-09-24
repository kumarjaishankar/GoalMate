package com.goalmate.controller;

import com.goalmate.dto.*;
import com.goalmate.entity.Task;
import com.goalmate.entity.User;
import com.goalmate.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    private User getCurrentUser(Authentication auth) {
        if (auth == null || auth.getPrincipal() == null) {
            throw new RuntimeException("Authentication required");
        }
        
        Object principal = auth.getPrincipal();
        if (!(principal instanceof User)) {
            throw new RuntimeException("Invalid authentication principal");
        }
        
        return (User) principal;
    }

    @GetMapping("/tasks/")
    public ResponseEntity<List<Task>> listTasks(Authentication auth) {
        User currentUser = getCurrentUser(auth);
        List<Task> tasks = taskRepository.findByUserId(currentUser.getId());
        return ResponseEntity.ok(tasks);
    }

    @PostMapping("/tasks/")
    public ResponseEntity<Task> createTask(@Valid @RequestBody TaskCreateRequest request, Authentication auth) {
        User currentUser = getCurrentUser(auth);
        
        Task task = new Task(
            currentUser.getId(),
            request.getTitle(),
            request.getDescription(),
            request.getCategory(),
            request.getDueDate(),
            request.getPriority()
        );
        
        task = taskRepository.save(task);
        return ResponseEntity.ok(task);
    }

    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<Task> getTask(@PathVariable Long taskId, Authentication auth) {
        User currentUser = getCurrentUser(auth);
        
        Optional<Task> taskOpt = taskRepository.findByIdAndUserId(taskId, currentUser.getId());
        if (taskOpt.isEmpty()) {
            throw new RuntimeException("Task not found");
        }
        
        return ResponseEntity.ok(taskOpt.get());
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<Task> updateTask(@PathVariable Long taskId, @RequestBody TaskUpdateRequest request, Authentication auth) {
        User currentUser = getCurrentUser(auth);
        
        Optional<Task> taskOpt = taskRepository.findByIdAndUserId(taskId, currentUser.getId());
        if (taskOpt.isEmpty()) {
            throw new RuntimeException("Task not found");
        }
        
        Task task = taskOpt.get();
        
        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getCategory() != null) task.setCategory(request.getCategory());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getCompleted() != null) task.setCompleted(request.getCompleted());
        
        task = taskRepository.save(task);
        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Map<String, Boolean>> deleteTask(@PathVariable Long taskId, Authentication auth) {
        User currentUser = getCurrentUser(auth);
        
        Optional<Task> taskOpt = taskRepository.findByIdAndUserId(taskId, currentUser.getId());
        if (taskOpt.isEmpty()) {
            throw new RuntimeException("Task not found");
        }
        
        taskRepository.delete(taskOpt.get());
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("ok", true);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/tasks/summary")
    public ResponseEntity<Map<String, Object>> getTaskSummary(Authentication auth) {
        User currentUser = getCurrentUser(auth);
        
        long total = taskRepository.countByUserId(currentUser.getId());
        long completed = taskRepository.countCompletedByUserId(currentUser.getId());
        double percentCompleted = total > 0 ? (completed * 100.0 / total) : 0;
        
        Map<String, Object> response = new HashMap<>();
        response.put("total", total);
        response.put("completed", completed);
        response.put("percent_completed", percentCompleted);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/analytics/activity")
    public ResponseEntity<Map<String, Object>> getActivityAnalytics(Authentication auth) {
        User currentUser = getCurrentUser(auth);
        
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(365);
        
        List<Task> tasks = taskRepository.findByUserIdAndCreatedAtAfter(currentUser.getId(), startDate);
        
        // Group tasks by date
        Map<String, Integer> dailyActivity = new HashMap<>();
        for (Task task : tasks) {
            if (task.getCompleted()) {
                String dateKey = task.getCreatedAt().toLocalDate().toString();
                dailyActivity.put(dateKey, dailyActivity.getOrDefault(dateKey, 0) + 1);
            }
        }
        
        // Calculate streaks
        int currentStreak = 0;
        int longestStreak = 0;
        int tempStreak = 0;
        
        for (int i = 0; i < 365; i++) {
            LocalDateTime checkDate = endDate.minusDays(i);
            String dateKey = checkDate.toLocalDate().toString();
            
            if (dailyActivity.getOrDefault(dateKey, 0) > 0) {
                if (i == 0) currentStreak++;
                tempStreak++;
                longestStreak = Math.max(longestStreak, tempStreak);
            } else {
                if (i == 0) currentStreak = 0;
                else if (currentStreak == 0) continue;
                else tempStreak = 0;
            }
        }
        
        // Generate heatmap data
        List<Map<String, Object>> heatmapData = new ArrayList<>();
        for (int i = 0; i < 365; i++) {
            LocalDateTime date = endDate.minusDays(365 - i - 1);
            String dateKey = date.toLocalDate().toString();
            int activityCount = dailyActivity.getOrDefault(dateKey, 0);
            
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", dateKey);
            dayData.put("count", activityCount);
            dayData.put("level", activityCount > 0 ? Math.min(4, activityCount) : 0);
            heatmapData.add(dayData);
        }
        
        long totalTasks = tasks.stream().mapToLong(t -> t.getCompleted() ? 1 : 0).sum();
        
        Map<String, Object> response = new HashMap<>();
        response.put("current_streak", currentStreak);
        response.put("longest_streak", longestStreak);
        response.put("total_tasks", totalTasks);
        response.put("heatmap_data", heatmapData);
        response.put("daily_goal", 5);
        response.put("today_count", dailyActivity.getOrDefault(endDate.toLocalDate().toString(), 0));
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(Authentication auth) {
        User currentUser = getCurrentUser(auth);
        UserResponse response = new UserResponse(currentUser.getId(), currentUser.getUsername(), currentUser.getEmail());
        return ResponseEntity.ok(response);
    }
}