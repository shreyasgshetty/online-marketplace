package com.online.marketplace.service;

import com.online.marketplace.model.User;
import com.online.marketplace.model.WithdrawalRequest;
import com.online.marketplace.repository.ProductRepository;
import com.online.marketplace.repository.UserRepository;
import com.online.marketplace.repository.WithdrawalRepository;
import com.online.marketplace.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FinanceService {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private ProductRepository productRepository;

        @Autowired
        private WithdrawalRepository withdrawalRepository;

        public FinanceStats getStats() {

                List<User> users = userRepository.findAll();
                List<WithdrawalRequest> withdrawals = withdrawalRepository.findAll();

                double totalWallet = users.stream()
                                .mapToDouble(u -> u.getWalletBalance() != null ? u.getWalletBalance() : 0)
                                .sum();

                long approved = withdrawals.stream()
                                .filter(w -> "APPROVED".equals(w.getStatus()))
                                .count();

                long rejected = withdrawals.stream()
                                .filter(w -> "REJECTED".equals(w.getStatus()))
                                .count();

                long pending = withdrawals.stream()
                                .filter(w -> "PENDING".equals(w.getStatus()))
                                .count();

                int totalTransactions = withdrawals.size();

                double totalPlatformFee = 0;

                List<Product> products = productRepository.findAll();

                for (Product p : products) {

                        if (!"COMPLETED".equalsIgnoreCase(p.getStatus()))
                                continue;

                        double amount = 0;

                        if ("auction".equalsIgnoreCase(p.getSellingType())) {
                                amount = p.getCurrentBid() != null ? p.getCurrentBid() : 0;
                        } else if ("fixed".equalsIgnoreCase(p.getSellingType())) {
                                amount = p.getPrice() != null ? p.getPrice() : 0;
                        }

                        totalPlatformFee += amount * 0.025;
                }

                return new FinanceStats(
                                totalWallet,
                                totalTransactions,
                                approved,
                                rejected,
                                pending,
                                totalPlatformFee);
        }
}