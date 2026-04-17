package com.online.marketplace.controller;

import com.online.marketplace.model.Product;
import com.online.marketplace.service.AuctionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auction")
@CrossOrigin("*")
public class AuctionController {

    @Autowired
    private AuctionService auctionService;

    @GetMapping
    public List<Product> getAuctions() {
        return auctionService.getAllAuctions();
    }

    @GetMapping("/{id}")
    public Product getAuction(@PathVariable String id) {
        return auctionService.getAuctionById(id);
    }

    @PostMapping("/bid")
    public String placeBid(@RequestParam String productId,
            @RequestParam String email,
            @RequestParam double amount) {

        return auctionService.placeBid(productId, email, amount);
    }
}