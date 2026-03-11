package com.online.marketplace.controller;

import com.online.marketplace.model.User;
import com.online.marketplace.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody User user) {
        return userService.login(user.getEmail(), user.getPassword());
    }

    // -------- GET PROFILE --------

    @GetMapping("/profile/{email}")
    public User getProfile(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    // -------- UPDATE PROFILE --------

    @PutMapping("/profile/{email}")
    public User updateProfile(@PathVariable String email, @RequestBody User user) {
        return userService.updateProfile(email, user);
    }
}