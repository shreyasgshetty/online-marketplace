package com.online.marketplace.service;

import com.online.marketplace.model.User;
import com.online.marketplace.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WalletService {

    @Autowired
    private UserRepository userRepository;

    // ✅ Get wallet balance
    public Double getBalance(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getWalletBalance();
    }

    // ✅ Add money
    public User addMoney(String email, double amount) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getWalletBalance() == null) {
            user.setWalletBalance(0.0);
        }

        user.setWalletBalance(user.getWalletBalance() + amount);

        return userRepository.save(user);
    }

    // ✅ Deduct money (used in auction)
    public void deductMoney(String email, double amount) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getWalletBalance() == null) {
            user.setWalletBalance(0.0);
        }

        if (user.getWalletBalance() < amount) {
            throw new RuntimeException("Insufficient wallet balance");
        }

        user.setWalletBalance(user.getWalletBalance() - amount);

        userRepository.save(user);
    }
}