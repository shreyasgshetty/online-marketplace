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

        // ================= VALIDATION =================

        if ("fixed".equalsIgnoreCase(req.getSellingType())
                && req.getPrice() == null) {
            throw new RuntimeException("Price is required for fixed selling");
        }

        if ("auction".equalsIgnoreCase(req.getSellingType())) {

            if (req.getBaseBidPrice() == null
                    || req.getAuctionStart() == null
                    || req.getAuctionEnd() == null) {
                throw new RuntimeException("Auction details missing");
            }

            if (req.getAuctionEnd().isBefore(req.getAuctionStart())) {
                throw new RuntimeException("Auction end must be after start");
            }
        }

        // ================= BUILDER =================

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

        Product product;

        // ================= FIXED PRICE =================
        if ("fixed".equalsIgnoreCase(req.getSellingType())) {

            builder.setPrice(req.getPrice());

            product = builder.build();

            // 🔥 IMPORTANT FOR HOME PAGE FILTERING
            product.setStatus("AVAILABLE");

        }

        // ================= AUCTION =================
        else {

            builder.setAuction(
                    req.getBaseBidPrice(),
                    req.getBidIncrement(),
                    req.getAuctionStart(),
                    req.getAuctionEnd());

            product = builder.build();

            // 🔥 INITIAL BID STATE
            product.setCurrentBid(req.getBaseBidPrice());
            product.setHighestBidder(null);

            // 🔥 STATUS BASED ON TIME
            if (req.getAuctionStart().isAfter(LocalDateTime.now())) {
                product.setStatus("UPCOMING");
            } else {
                product.setStatus("LIVE");
            }
        }

        // ================= COMMON FIELDS =================

        product.setModerationStatus("PENDING");

        product.setSellerConfirmed(false);
        product.setBuyerConfirmed(false);

        return productRepository.save(product);
    }
}