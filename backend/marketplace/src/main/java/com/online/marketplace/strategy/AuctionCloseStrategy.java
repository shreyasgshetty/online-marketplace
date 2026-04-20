package com.online.marketplace.strategy;

import com.online.marketplace.model.Product;

public interface AuctionCloseStrategy {
    void closeAuction(Product product);
}