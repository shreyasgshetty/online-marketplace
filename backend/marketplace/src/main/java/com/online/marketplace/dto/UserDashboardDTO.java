package com.online.marketplace.dto;

import java.util.List;
import com.online.marketplace.model.Product;

public class UserDashboardDTO {

    private List<Product> soldProducts;
    private List<Product> boughtProducts;
    private List<BidInfo> bids;

    public UserDashboardDTO(List<Product> sold, List<Product> bought, List<BidInfo> bids) {
        this.soldProducts = sold;
        this.boughtProducts = bought;
        this.bids = bids;
    }

    public List<Product> getSoldProducts() {
        return soldProducts;
    }

    public List<Product> getBoughtProducts() {
        return boughtProducts;
    }

    public List<BidInfo> getBids() {
        return bids;
    }
}