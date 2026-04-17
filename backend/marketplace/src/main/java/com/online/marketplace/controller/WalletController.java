package com.online.marketplace.controller;

import com.online.marketplace.model.User;
import com.online.marketplace.service.WalletService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin("*")
public class WalletController {

    @Autowired
    private WalletService walletService;

    // ✅ Get balance
    @GetMapping("/balance/{email}")
    public Double getBalance(@PathVariable String email) {
        return walletService.getBalance(email);
    }

    // ✅ Add money (manual / Razorpay success)
    @PostMapping("/add")
    public User addMoney(@RequestParam String email,
            @RequestParam double amount) {

        return walletService.addMoney(email, amount);
    }
}