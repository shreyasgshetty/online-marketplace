package com.online.marketplace.strategy;

import com.online.marketplace.model.Product;

public interface BidStatusStrategy {
    String getStatus(Product product, double userBid);
}