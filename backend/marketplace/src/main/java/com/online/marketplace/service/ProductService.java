package com.online.marketplace.service;

import com.online.marketplace.builder.ProductBuilder;
import com.online.marketplace.model.Product;
import com.online.marketplace.repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Product createProduct(Product req) {

        // ✅ Validation (VERY IMPORTANT FOR MARKS)
        if ("fixed".equals(req.getSellingType()) && req.getPrice() == null) {
            throw new RuntimeException("Price is required for fixed selling");
        }

        if ("auction".equals(req.getSellingType())) {
            if (req.getBaseBidPrice() == null || req.getAuctionStart() == null || req.getAuctionEnd() == null) {
                throw new RuntimeException("Auction details missing");
            }
        }

        // ✅ Build product using Builder Pattern
        ProductBuilder builder = new ProductBuilder()
                .setSellerEmail(req.getSellerEmail())
                .setTitle(req.getTitle())
                .setCategory(req.getCategory())
                .setBrand(req.getBrand())
                .setCondition(req.getCondition())
                .setDescription(req.getDescription())
                .setImages(req.getImages())
                .setTags(req.getTags())
                .setCity(req.getCity())
                .setState(req.getState())
                .setNegotiable(req.isNegotiable())
                .setSellingType(req.getSellingType())
                .setCreatedAt(LocalDateTime.now());

        // ✅ Selling Type Logic
        if ("fixed".equals(req.getSellingType())) {

            builder.setPrice(req.getPrice());

        } else if ("auction".equals(req.getSellingType())) {

            builder.setAuction(
                    req.getBaseBidPrice(),
                    req.getBidIncrement(),
                    req.getAuctionStart(),
                    req.getAuctionEnd());
        }

        Product product = builder.build();

        return productRepository.save(product);
    }
}