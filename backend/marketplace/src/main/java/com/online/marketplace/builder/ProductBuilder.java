package com.online.marketplace.builder;

import com.online.marketplace.model.Product;

import java.time.LocalDateTime;
import java.util.List;

public class ProductBuilder {

    private Product product;

    public ProductBuilder() {
        product = new Product();
    }

    public ProductBuilder setSellerEmail(String sellerEmail) {
        product.setSellerEmail(sellerEmail);
        return this;
    }

    public ProductBuilder setTitle(String title) {
        product.setTitle(title);
        return this;
    }

    public ProductBuilder setCategory(String category) {
        product.setCategory(category);
        return this;
    }

    public ProductBuilder setBrand(String brand) {
        product.setBrand(brand);
        return this;
    }

    public ProductBuilder setCondition(String condition) {
        product.setCondition(condition);
        return this;
    }

    public ProductBuilder setDescription(String description) {
        product.setDescription(description);
        return this;
    }

    public ProductBuilder setImages(List<String> images) {
        product.setImages(images);
        return this;
    }

    public ProductBuilder setTags(List<String> tags) {
        product.setTags(tags);
        return this;
    }

    public ProductBuilder setCity(String city) {
        product.setCity(city);
        return this;
    }

    public ProductBuilder setState(String state) {
        product.setState(state);
        return this;
    }

    public ProductBuilder setNegotiable(boolean negotiable) {
        product.setNegotiable(negotiable);
        return this;
    }

    public ProductBuilder setSellingType(String sellingType) {
        product.setSellingType(sellingType);
        return this;
    }

    // ✅ Fixed price
    public ProductBuilder setPrice(Double price) {
        product.setPrice(price);
        return this;
    }

    // ✅ Auction
    public ProductBuilder setAuction(Double baseBidPrice, Double bidIncrement,
            LocalDateTime start, LocalDateTime end) {

        product.setBaseBidPrice(baseBidPrice);
        product.setBidIncrement(bidIncrement);
        product.setAuctionStart(start);
        product.setAuctionEnd(end);

        return this;
    }

    public ProductBuilder setCreatedAt(LocalDateTime time) {
        product.setCreatedAt(time);
        return this;
    }

    public Product build() {
        return product;
    }
}