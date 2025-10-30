package com.fitnessapp.ai_service.service;

import lombok.extern.slf4j.Slf4j;
import org.bson.json.JsonObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.Objects;

@Service
@Slf4j
public class GeminiService {

    private final WebClient webClient;
    @Value("${gemini.api.url}")
    private String geminiApiUrl;
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String getAnswer(String question){

        Map<String, Object> requestBody = Map.of(
                "contents" , new Object[] {

                        Map.of(
                                "parts" , new Object[]{
                                        Map.of(
                                                "text" , question
                                        )
                                }
                        )

                }
        );

        log.info("Api uri :  {}" , geminiApiUrl);

        String aiResponse = webClient.post()
                .uri(geminiApiUrl)
                .header("x-goog-api-key", geminiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)  // Added: Send the request body
                .retrieve()
                .bodyToMono(String.class)
                .block();
        return aiResponse;
    }
}
