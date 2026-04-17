package com.online.marketplace.service;

import com.online.marketplace.model.*;
import com.online.marketplace.repository.*;
import com.online.marketplace.strategy.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuctionService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Product> getAllAuctions() {
        return productRepository.findAll()
                .stream()
                .filter(p -> "auction".equals(p.getSellingType()))
                .toList();
    }

    public Product getAuctionById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public String placeBid(String productId, String email, double amount) {

        Product product = getAuctionById(productId);

        // Check auction time
        if (LocalDateTime.now().isAfter(product.getAuctionEnd())) {
            throw new RuntimeException("Auction ended");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Wallet check (assume wallet field exists)
        if (user.getWalletBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        BidStrategy strategy = new StandardBidStrategy();

        strategy.placeBid(product, amount, email);

        // Save bid
        Bid bid = new Bid();
        bid.setProductId(productId);
        bid.setBidderEmail(email);
        bid.setAmount(amount);
        bid.setTime(LocalDateTime.now());

        bidRepository.save(bid);

        productRepository.save(product);

        return "Bid placed successfully";
    }
}