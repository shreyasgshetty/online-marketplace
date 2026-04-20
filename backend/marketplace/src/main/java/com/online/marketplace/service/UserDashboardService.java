package com.online.marketplace.service;

import com.online.marketplace.dto.*;
import com.online.marketplace.model.Product;
import com.online.marketplace.repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserDashboardService {

    @Autowired
    private ProductRepository productRepository;

    public UserDashboardDTO getDashboard(String email) {

        // ✅ Sold products
        List<Product> sold = productRepository.findBySellerEmail(email);

        // ✅ Bought (you must store buyerEmail in Product)
        List<Product> bought = productRepository.findByBuyerEmail(email);

        // ✅ Bids participated
        List<Product> all = productRepository.findAll();

        List<BidInfo> bids = new ArrayList<>();

        for (Product p : all) {

            // ✅ ONLY include if THIS user is highest bidder
            if (p.getHighestBidder() == null || !p.getHighestBidder().equals(email)) {
                continue;
            }

            String status;

            if ("LIVE".equalsIgnoreCase(p.getStatus())) {
                status = "WINNING";
            } else if ("AWAITING_CONFIRMATION".equalsIgnoreCase(p.getStatus())) {
                status = "WON";
            } else if ("COMPLETED".equalsIgnoreCase(p.getStatus())) {
                status = "COMPLETED";
            } else {
                continue;
            }

            bids.add(new BidInfo(p, p.getCurrentBid(), status));
        }

        return new UserDashboardDTO(sold, bought, bids);
    }
}