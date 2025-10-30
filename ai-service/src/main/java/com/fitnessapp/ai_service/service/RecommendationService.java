package com.fitnessapp.ai_service.service;


import com.fitnessapp.ai_service.model.Recommendation;
import com.fitnessapp.ai_service.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private  final RecommendationRepository recommendationRepository;

    public List<Recommendation> getUserRecommendation(String userId) {


        return recommendationRepository.findByUserId(userId);
    }

    public Recommendation getActivityRecommendation(String activityId) {

        return recommendationRepository.findByActivityId(activityId).orElseThrow(
                () -> new RuntimeException("No Recommendation Found for this activity: " + activityId)
        );
    }
}
