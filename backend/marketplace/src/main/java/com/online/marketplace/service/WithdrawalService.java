package com.online.marketplace.service;

import com.online.marketplace.builder.WithdrawalBuilder;
import com.online.marketplace.model.WithdrawalRequest;
import com.online.marketplace.model.User;
import com.online.marketplace.repository.UserRepository;
import com.online.marketplace.repository.WithdrawalRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WithdrawalService {

    @Autowired
    private WithdrawalRepository withdrawalRepository;

    @Autowired
    private UserRepository userRepository;

    // USER REQUEST
    public WithdrawalRequest requestWithdrawal(String email, double amount,
            String acc, String ifsc, String holder) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getWalletBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        WithdrawalRequest req = new WithdrawalBuilder()
                .setEmail(email)
                .setAmount(amount)
                .setBankDetails(acc, ifsc, holder)
                .build();

        return withdrawalRepository.save(req);
    }

    // FINANCE APPROVE
    public WithdrawalRequest approve(String id) {

        WithdrawalRequest req = withdrawalRepository.findById(id)
                .orElseThrow();

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow();

        user.setWalletBalance(user.getWalletBalance() - req.getAmount());

        req.setStatus("APPROVED");

        userRepository.save(user);
        return withdrawalRepository.save(req);
    }

    // FINANCE REJECT
    public WithdrawalRequest reject(String id, String reason) {

        WithdrawalRequest req = withdrawalRepository.findById(id)
                .orElseThrow();

        req.setStatus("REJECTED");
        req.setRejectionReason(reason);

        return withdrawalRepository.save(req);
    }

    // USER HISTORY
    public List<WithdrawalRequest> getUserRequests(String email) {
        return withdrawalRepository.findByEmail(email);
    }

    // ADMIN VIEW
    public List<WithdrawalRequest> getAll() {
        return withdrawalRepository.findAll();
    }

    public List<WithdrawalRequest> getPending() {
        return withdrawalRepository.findByStatus("PENDING");
    }
}