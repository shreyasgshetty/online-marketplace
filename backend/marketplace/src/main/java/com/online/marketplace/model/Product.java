package com.online.marketplace.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "products")
public class Product {

    @Id
    private String id;

    private String sellerEmail;

    private String title;
    private String category;
    private String brand;
    private String condition;

    private String description;

    private List<String> images;

    private boolean negotiable;

    private String sellingType;

    private Double price;

    private Double baseBidPrice;
    private Double bidIncrement;

    private LocalDateTime auctionStart;
    private LocalDateTime auctionEnd;

    private String city;
    private String state;

    private List<String> tags;

    private LocalDateTime createdAt;

    public Product() {
    }

    public String getId() {
        return id;
    }

    public String getSellerEmail() {
        return sellerEmail;
    }

    public void setSellerEmail(String sellerEmail) {
        this.sellerEmail = sellerEmail;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public boolean isNegotiable() {
        return negotiable;
    }

    public void setNegotiable(boolean negotiable) {
        this.negotiable = negotiable;
    }

    public String getSellingType() {
        return sellingType;
    }

    public void setSellingType(String sellingType) {
        this.sellingType = sellingType;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getBaseBidPrice() {
        return baseBidPrice;
    }

    public void setBaseBidPrice(Double baseBidPrice) {
        this.baseBidPrice = baseBidPrice;
    }

    public Double getBidIncrement() {
        return bidIncrement;
    }

    public void setBidIncrement(Double bidIncrement) {
        this.bidIncrement = bidIncrement;
    }

    public LocalDateTime getAuctionStart() {
        return auctionStart;
    }

    public void setAuctionStart(LocalDateTime auctionStart) {
        this.auctionStart = auctionStart;
    }

    public LocalDateTime getAuctionEnd() {
        return auctionEnd;
    }

    public void setAuctionEnd(LocalDateTime auctionEnd) {
        this.auctionEnd = auctionEnd;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}