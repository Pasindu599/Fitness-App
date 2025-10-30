package com.fitnessapp.user_service.service;

import com.fitnessapp.user_service.dto.UserResponse;
import com.fitnessapp.user_service.dto.RegisterRequest;
import com.fitnessapp.user_service.model.User;
import com.fitnessapp.user_service.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserService {

    @Autowired
    private UserRepository userRepository;


    public UserResponse register(@Valid RegisterRequest request) {
        if ( userRepository.existsByEmail(request.getEmail())){
            User existingUser  = userRepository.findByKeycloakId(request.getKeycloakId());
            UserResponse userResponse = new UserResponse();
            userResponse.setEmail(existingUser.getEmail());
            userResponse.setId(existingUser.getId());
            userResponse.setPassword((existingUser.getPassword()));
            userResponse.setFirstName(existingUser.getFirstName());
            userResponse.setLastName(existingUser.getLastName());
            userResponse.setCreatedAt(existingUser.getCreatedAt());
            userResponse.setUpdatedAt(existingUser.getUpdatedAt());
            return userResponse;
        }
        User user  = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setKeycloakId(request.getKeycloakId());
        User savedUser = userRepository.save(user);
        UserResponse userResponse = new UserResponse();
        userResponse.setEmail(savedUser.getEmail());
        userResponse.setId(savedUser.getId());
        userResponse.setPassword((savedUser.getPassword()));
        userResponse.setFirstName(savedUser.getFirstName());
        userResponse.setLastName(savedUser.getLastName());
        userResponse.setCreatedAt(savedUser.getCreatedAt());
        userResponse.setUpdatedAt(savedUser.getUpdatedAt());

        return userResponse;
    }

    public UserResponse getUserProfile(String userId) {

        User user = userRepository.findById(userId).orElseThrow(
                ()-> new RuntimeException("User Not Found")
        );

        UserResponse userResponse = new UserResponse();
        userResponse.setEmail(user.getEmail());
        userResponse.setPassword((user.getPassword()));
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setCreatedAt(user.getCreatedAt());
        userResponse.setUpdatedAt(user.getUpdatedAt());


        return  userResponse;


    }

    public Boolean existByUserId(String userId) {
        log.info("Calling User validation API for userID: {}",userId);
        return  userRepository.existsByKeycloakId(userId);
    }
}
