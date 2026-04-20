package com.online.marketplace.builder;

import com.online.marketplace.model.WithdrawalRequest;

import java.time.LocalDateTime;

public class WithdrawalBuilder {

    private WithdrawalRequest req;

    public WithdrawalBuilder() {
        req = new WithdrawalRequest();
        req.setCreatedAt(LocalDateTime.now());
        req.setStatus("PENDING");
    }

    public WithdrawalBuilder setEmail(String email) {
        req.setEmail(email);
        return this;
    }

    public WithdrawalBuilder setAmount(double amount) {
        req.setAmount(amount);
        return this;
    }

    public WithdrawalBuilder setBankDetails(String acc, String ifsc, String holder) {
        req.setBankAccount(acc);
        req.setIfsc(ifsc);
        req.setAccountHolder(holder);
        return this;
    }

    public WithdrawalRequest build() {
        return req;
    }
}