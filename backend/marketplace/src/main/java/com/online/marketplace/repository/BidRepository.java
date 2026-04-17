package com.online.marketplace.repository;

import com.online.marketplace.model.Bid;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BidRepository extends MongoRepository<Bid, String> {
    List<Bid> findByProductId(String productId);
}