package com.online.marketplace.controller;

import com.online.marketplace.model.WithdrawalRequest;
import com.online.marketplace.service.WithdrawalService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/withdraw")
@CrossOrigin("*")
public class WithdrawalController {

    @Autowired
    private WithdrawalService service;

    @PostMapping("/request")
    public WithdrawalRequest request(@RequestParam String email,
            @RequestParam double amount,
            @RequestParam String acc,
            @RequestParam String ifsc,
            @RequestParam String holder) {

        return service.requestWithdrawal(email, amount, acc, ifsc, holder);
    }

    @GetMapping("/user/{email}")
    public List<WithdrawalRequest> userHistory(@PathVariable String email) {
        return service.getUserRequests(email);
    }

    @GetMapping("/all")
    public List<WithdrawalRequest> all() {
        return service.getPending();
    }

    @PostMapping("/approve")
    public WithdrawalRequest approve(@RequestParam String id) {
        return service.approve(id);
    }

    @PostMapping("/reject")
    public WithdrawalRequest reject(@RequestParam String id,
            @RequestParam String reason) {
        return service.reject(id, reason);
    }
}