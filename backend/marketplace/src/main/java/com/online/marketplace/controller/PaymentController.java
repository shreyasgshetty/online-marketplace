package com.online.marketplace.controller;

import com.online.marketplace.service.PaymentService;
import com.online.marketplace.service.WalletService;
import com.razorpay.Order;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin("*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private WalletService walletService;

    @PostMapping("/create-order")
    public String createOrder(@RequestParam int amount) throws Exception {
        Order order = paymentService.createOrder(amount);
        return order.toString();
    }

    @PostMapping("/success")
    public String paymentSuccess(@RequestParam String email,
            @RequestParam double amount) {

        walletService.addMoney(email, amount);

        return "Wallet updated";
    }
}