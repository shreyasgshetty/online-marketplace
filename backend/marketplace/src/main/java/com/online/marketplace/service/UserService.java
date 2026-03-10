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

        // If user already exists
        if (existingUser.isPresent()) {
            return existingUser.get();
        }

        user.setRole(Role.USER);

        // Handle Google login users
        if (user.getPassword() == null || user.getPassword().equals("GOOGLE_AUTH")) {
            user.setPassword("GOOGLE_AUTH");
        } else {
            // Hash normal password
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

        // Google users
        if (user.getPassword().equals("GOOGLE_AUTH")) {
            return user;
        }

        if (passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }

        throw new RuntimeException("Invalid password");
    }
}