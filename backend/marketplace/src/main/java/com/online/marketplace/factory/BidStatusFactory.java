package com.online.marketplace.factory;

import com.online.marketplace.strategy.*;

public class BidStatusFactory {

    public static BidStatusStrategy getStrategy(boolean isWinning) {
        return isWinning ? new WinningStrategy() : new LostStrategy();
    }
}
