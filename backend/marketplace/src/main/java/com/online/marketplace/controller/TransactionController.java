package com.online.marketplace.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.online.marketplace.service.TransactionService;

@RestController
@RequestMapping("/api/transaction")
@CrossOrigin("*")
public class TransactionController {

    @Autowired
    private TransactionService service;

    @PostMapping("/buyer-confirm")
    public void buyerConfirm(@RequestParam String productId) {
        service.confirmBuyer(productId);
    }

    @PostMapping("/seller-confirm")
    public void sellerConfirm(@RequestParam String productId) {
        service.confirmSeller(productId);
    }
}