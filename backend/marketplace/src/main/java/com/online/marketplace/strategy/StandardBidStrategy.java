package com.online.marketplace.strategy;

import com.online.marketplace.model.Product;

public class StandardBidStrategy implements BidStrategy {

    @Override
    public boolean placeBid(Product product, double bidAmount, String userEmail) {

        double minBid = product.getCurrentBid() != null
                ? product.getCurrentBid() + product.getBidIncrement()
                : product.getBaseBidPrice();

        if (bidAmount < minBid) {
            throw new RuntimeException("Bid too low");
        }

        product.setCurrentBid(bidAmount);
        product.setHighestBidder(userEmail);

        return true;
    }
}