package com.online.marketplace.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.online.marketplace.model.Product;
import com.online.marketplace.model.User;
import com.online.marketplace.repository.ProductRepository;
import com.online.marketplace.repository.UserRepository;

@Service
public class TransactionService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public void confirmBuyer(String productId) {

        Product p = productRepository.findById(productId).orElseThrow();

        p.setBuyerConfirmed(true);

        productRepository.save(p);

        checkAndComplete(p);
    }

    public void confirmSeller(String productId) {

        Product p = productRepository.findById(productId).orElseThrow();

        p.setSellerConfirmed(true);

        productRepository.save(p);

        checkAndComplete(p);
    }

    private void checkAndComplete(Product p) {

        if (p.isBuyerConfirmed() && p.isSellerConfirmed()) {

            User buyer = userRepository.findByEmail(p.getBuyerEmail()).get();
            User seller = userRepository.findByEmail(p.getSellerEmail()).get();

            double amount = p.getCurrentBid();

            double fee = amount * 0.025;
            double sellerAmount = amount - fee;

            // 💰 deduct buyer
            buyer.setWalletBalance(buyer.getWalletBalance() - amount);

            // 💰 add seller
            seller.setWalletBalance(seller.getWalletBalance() + sellerAmount);

            userRepository.save(buyer);
            userRepository.save(seller);

            p.setStatus("COMPLETED");

            productRepository.save(p);
        }
    }
}
