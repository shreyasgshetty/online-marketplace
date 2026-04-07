package com.online.marketplace.repository;

import com.online.marketplace.model.Banner;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BannerRepository extends MongoRepository<Banner, String> {

}
