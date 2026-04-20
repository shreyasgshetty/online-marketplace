package com.online.marketplace.strategy;

import com.online.marketplace.model.Product;

public class LostStrategy implements BidStatusStrategy {

    public String getStatus(Product product, double userBid) {
        return "OUTBID";
    }
}