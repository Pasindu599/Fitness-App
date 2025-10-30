package com.fitnessapp.ai_service.service;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitnessapp.ai_service.model.Activity;
import com.fitnessapp.ai_service.model.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {

    private final GeminiService geminiService;

    public  Recommendation generateRecommendation(Activity activity){
        String prompt = createPromptForActivity(
                activity

        );

        String aiResponse = geminiService.getAnswer(prompt);

        log.info("RESPONSE FROM AI : {} " , aiResponse );
        return  processAiResponse(activity,aiResponse);






    }

    private Recommendation processAiResponse(Activity activity, String aiResponse){
        try{

            ObjectMapper mapper = new ObjectMapper();
            JsonNode  rootNode = mapper.readTree(aiResponse);
            JsonNode textNode = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text");


            String jsonContent = textNode.asText().replaceAll("```json\\n" , "")
                    .replaceAll("\\n```" , "").trim();

            log.info("PROCESSED AI RESPONSE: {}" ,jsonContent );

            JsonNode analysisJson = mapper.readTree(jsonContent);

            JsonNode analysisNode = analysisJson.path("analysis");

            StringBuilder fullAnalysis = new StringBuilder();


            addAnalysisSection(fullAnalysis, analysisNode , "overall" , "Overall: ");

            addAnalysisSection(fullAnalysis, analysisNode , "pace" , "Pace: ");

            addAnalysisSection(fullAnalysis, analysisNode , "heartRate" , "Heart Rate: ");

            addAnalysisSection(fullAnalysis, analysisNode , "caloriesBurned" , "Calories Burned: ");

            List<String> improvements = extractImprovements(analysisJson.path("improvements"));

            List<String> suggestions = extractSuggestions(analysisJson.path("suggestions"));

            List<String> safetyGuidelines = extractSafetyGuidelines(analysisJson.path("safety"));

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .safety(safetyGuidelines)
                    .suggestions(suggestions)
                    .improvements(improvements)
                    .userId(activity.getUserId())
                    .activityType(activity.getType())
                    .recommendation(fullAnalysis.toString().trim())
                    .createdAt(LocalDateTime.now())
                    .build();





        }catch (Exception e){
            e.printStackTrace();
            return  createDefualtRecommendation(activity);
        }
    }

    private Recommendation createDefualtRecommendation(Activity activity) {

        return Recommendation.builder()
                .activityId(activity.getId())
                .safety(Arrays.asList(
                        "Always warm up before exercise" ,
                                "Stay hydrated",
                        "Listen to your body"
                ))
                .suggestions(Collections.singletonList("Continue with your current routine "))
                .improvements(Collections.singletonList("Consider consulting a fitness professional"))
                .userId(activity.getUserId())
                .activityType(activity.getType())
                .recommendation("Unable to generate detailed analysis")
                .createdAt(LocalDateTime.now())
                .build();


    }

    private List<String> extractSafetyGuidelines(JsonNode safetyNode) {
        List<String> safety  = new ArrayList<>();

        if (safetyNode.isArray()){
            safetyNode.forEach(item -> {

                safety.add(item.asText());
            });


        }

        return safety.isEmpty() ? Collections.singletonList("No safety provided"): safety;
    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestions  = new ArrayList<>();

        if (suggestionsNode.isArray()){
            suggestionsNode.forEach(suggestion -> {
                String area = suggestion.path("workout").asText();
                String detail = suggestion.path("description").asText();
                suggestions.add(String.format("%s: %s", area, detail));
            });


        }

        return suggestions.isEmpty() ? Collections.singletonList("No suggestions provided"): suggestions;

    }

    private List<String> extractImprovements(JsonNode improvementNode) {

        List<String> improvements  = new ArrayList<>();

        if (improvementNode.isArray()){
            improvementNode.forEach(improvement -> {
                String area = improvement.path("area").asText();
                String detail = improvement.path("recommendation").asText();
                improvements.add(String.format("%s: %s", area, detail));
            });


        }

        return improvements.isEmpty() ? Collections.singletonList("No improvements provided"): improvements;
    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {

        if (!analysisNode.path(key).isMissingNode()){
            fullAnalysis.append(prefix)
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }
    }

    private String createPromptForActivity(Activity activity) {
        return String.format("""
                Analysis the fitness activity and provide detailed recommandation in the following EXACT JSON format:
                {
                "analysis" : {
                    "overall" : "Overall analysis here",
                    "pace" : "Pace analysis",
                    "heartRate" : "Heart rate analysis here",
                    "caloriesBurned" : "Calories analysis here"
                    },
                "improvements": [
                {
                "area" : "Area Name",
                "recommendation" : "Detailed recommendation
                }
                ],
                "suggestions":[
                {
                    "workout" : "workout name",
                    "description" : "Detailed workout description"
                    }
                ],
                "safety" : [
                
                    "Safety point 1",
                    "Safety point 2"
                ]
                }
                
                
                Analyze this activity:
                Activity type : %s
                Duration: %d minutes
                Calories Burned: %d
                Additional Metrics: %s
                
                Provide detailed analysis focusing on performance, improvements
                Ensure the response follows the JSON format shown above
                """, activity.getType() , activity.getDuration(), activity.getCaloriesBurned() , activity.getAdditionalMetrics());

    }


}
