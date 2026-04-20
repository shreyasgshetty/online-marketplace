package com.online.marketplace.scheduler;

import com.online.marketplace.model.Product;
import com.online.marketplace.repository.ProductRepository;
import com.online.marketplace.factory.AuctionStrategyFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class AuctionScheduler {

    @Autowired
    private ProductRepository productRepository;

    @Scheduled(fixedRate = 60000) // every 1 min
    public void closeAuctions() {

        List<Product> products = productRepository.findAll();

        for (Product p : products) {

            if ("auction".equals(p.getSellingType())
    && (p.getStatus() == null || "LIVE".equalsIgnoreCase(p.getStatus()))
    && p.getAuctionEnd() != null
    && p.getAuctionEnd().isBefore(LocalDateTime.now())) {

                AuctionStrategyFactory
                        .getStrategy()
                        .closeAuction(p);

                productRepository.save(p);
            }
        }
    }
}
