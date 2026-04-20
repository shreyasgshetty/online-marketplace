package com.online.marketplace.strategy;

import com.online.marketplace.model.Product;

public class HighestBidWinsStrategy implements AuctionCloseStrategy {

    @Override
    public void closeAuction(Product product) {

        if (product.getHighestBidder() != null) {

            product.setBuyerEmail(product.getHighestBidder());
            product.setStatus("AWAITING_CONFIRMATION");

        } else {

            product.setStatus("ENDED"); // no bids

        }
    }
}