package com.fitnessapp.activity_service.controller;


import com.fitnessapp.activity_service.dto.ActivityRequest;
import com.fitnessapp.activity_service.dto.ActivityResponse;
import com.fitnessapp.activity_service.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @PostMapping
    public ResponseEntity<ActivityResponse>  trackActivity(@RequestBody ActivityRequest request , @RequestHeader("X-User-ID") String userId){
        if (userId != null) {
            request.setUserId(userId);
        }
        return ResponseEntity.ok(activityService.trackActivity(request));

    }

    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getUserActivities(@RequestHeader("X-USER-ID")  String userId){

        return ResponseEntity.ok(activityService.getUserActivities(userId));

    }


    @GetMapping("/{activityId}")
    public ResponseEntity<ActivityResponse> getActivityByID(@PathVariable String activityId){

        return ResponseEntity.ok(activityService.getActivityByID(activityId));

    }
}
