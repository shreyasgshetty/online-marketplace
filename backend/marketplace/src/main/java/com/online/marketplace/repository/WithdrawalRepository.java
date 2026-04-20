package com.online.marketplace.repository;

import com.online.marketplace.model.WithdrawalRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface WithdrawalRepository extends MongoRepository<WithdrawalRequest, String> {

    List<WithdrawalRequest> findByEmail(String email);

    List<WithdrawalRequest> findByStatus(String status);
}