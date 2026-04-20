package com.online.marketplace.factory;

import com.online.marketplace.strategy.AuctionCloseStrategy;
import com.online.marketplace.strategy.HighestBidWinsStrategy;

public class AuctionStrategyFactory {

    public static AuctionCloseStrategy getStrategy() {
        return new HighestBidWinsStrategy();
    }
}