package com.online.marketplace.strategy;

import com.online.marketplace.model.Product;

public interface BidStrategy {
    boolean placeBid(Product product, double bidAmount, String userEmail);
}