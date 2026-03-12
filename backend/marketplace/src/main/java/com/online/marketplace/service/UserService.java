package com.online.marketplace.service;

import com.online.marketplace.model.Role;
import com.online.marketplace.model.User;
import com.online.marketplace.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(User user) {

        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        user.setRole(Role.USER);

        if (user.getPassword() == null || user.getPassword().equals("GOOGLE_AUTH")) {
            user.setPassword("GOOGLE_AUTH");
        } else {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        return userRepository.save(user);
    }

    public User login(String email, String password) {

        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = existingUser.get();

        if (user.getPassword().equals("GOOGLE_AUTH")) {
            return user;
        }

        if (passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }

        throw new RuntimeException("Invalid password");
    }

    // -------- GET USER PROFILE --------

    public User getUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // -------- UPDATE USER PROFILE --------

    public User updateProfile(String email, User updatedUser) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPhone(updatedUser.getPhone());
        user.setAddress(updatedUser.getAddress());
        user.setCity(updatedUser.getCity());
        user.setState(updatedUser.getState());
        user.setLatitude(updatedUser.getLatitude());
        user.setLongitude(updatedUser.getLongitude());
        user.setProfilePictureUrl(updatedUser.getProfilePictureUrl());

        return userRepository.save(user);
    }
}