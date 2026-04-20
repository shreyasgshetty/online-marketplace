package com.online.marketplace.controller;

import com.online.marketplace.dto.UserDashboardDTO;
import com.online.marketplace.service.UserDashboardService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class UserDashboardController {

    @Autowired
    private UserDashboardService service;

    @GetMapping("/{email}")
    public UserDashboardDTO getDashboard(@PathVariable String email) {
        return service.getDashboard(email);
    }
}