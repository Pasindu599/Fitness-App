package com.fitnessapp.activity_service.service;


import com.fitnessapp.activity_service.dto.ActivityRequest;
import com.fitnessapp.activity_service.dto.ActivityResponse;
import com.fitnessapp.activity_service.model.Activity;
import com.fitnessapp.activity_service.repository.ActivityRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchange;
    @Value("${rabbitmq.routing.key}")
    private String routingKey;


    public ActivityResponse trackActivity(ActivityRequest request) {


//        boolean isValidUser = userValidationService.validationUser(request.getUserId());

            boolean isValidUser = true;

        if (!isValidUser){
            throw new RuntimeException("Invalid User: " +  request.getUserId());
        }


        Activity activity = Activity.builder().userId(request.getUserId()).type(request.getType()).duration(request.getDuration()).caloriesBurned(request.getCaloriesBurned()).startTime(request.getStartTime()).additionalMetrics(request.getAdditionalMetrics()).build();

        Activity savedActivity = activityRepository.save(activity);

        // publish to RabbitMQ
        rabbitTemplate.convertAndSend(
                exchange,routingKey, savedActivity
        );



        return mapToResponse(savedActivity);
    }

    private ActivityResponse mapToResponse(Activity activity){
        ActivityResponse activityResponse = new ActivityResponse();
        activityResponse.setId(activity.getId());
        activityResponse.setUserId(activity.getUserId());
        activityResponse.setCreatedAt(activity.getCreatedAt());
        activityResponse.setUpdatedAt(activity.getUpdatedAt());
        activityResponse.setType(activity.getType());
        activityResponse.setStartTime(activity.getStartTime());
        activityResponse.setDuration(activity.getDuration());
        activityResponse.setAdditionalMetrics(activity.getAdditionalMetrics());
        activityResponse.setCaloriesBurned(activity.getCaloriesBurned());
        return activityResponse;
    }

    public List<ActivityResponse> getUserActivities(String userId) {

        List<Activity> all_activities = activityRepository.findByUserId(userId);

        return all_activities.stream().map(
                this::mapToResponse
        ).collect(Collectors.toList());


    }

    public ActivityResponse getActivityByID(String activityId) {

        return activityRepository.findById(activityId).map(
                this::mapToResponse
        ).orElseThrow(() -> new RuntimeException("Activity not found with id: " + activityId));

    }
}
