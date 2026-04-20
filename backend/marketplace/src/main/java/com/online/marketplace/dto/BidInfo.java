package com.online.marketplace.dto;

import com.online.marketplace.model.Product;

public class BidInfo {

    private Product product;
    private double userBid;
    private String status;

    public BidInfo(Product product, double userBid, String status) {
        this.product = product;
        this.userBid = userBid;
        this.status = status;
    }

    public Product getProduct() {
        return product;
    }

    public double getUserBid() {
        return userBid;
    }

    public String getStatus() {
        return status;
    }
}