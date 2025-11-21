package com.fitnessapp.gateway;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http){
       return http.csrf(csrf -> csrf.disable() )
               .authorizeExchange(exchange -> exchange
//                       .pathMatchers("/actuator/*").permitAll()
                       .anyExchange().authenticated() )
               .oauth2ResourceServer( oauth2 -> oauth2.jwt(Customizer.withDefaults()))
               .build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource(){

        CorsConfiguration  config  = new CorsConfiguration();
        config.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        config.setAllowedMethods(
                Arrays.asList("GET" , "POST" , "DELETE" , "PUT" , "OPTIONS")
        );

        config.setAllowedHeaders(
                Arrays.asList("Authorization" , "Content-Type" , "X-User-ID")
        );

        config.setAllowCredentials(true );

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/api/**" , config );

        return  source;

    }
}

