package com.online.marketplace.service;

import com.online.marketplace.model.Product;
import com.online.marketplace.repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Product createProduct(Product product) {

        product.setCreatedAt(LocalDateTime.now());

        return productRepository.save(product);
    }
}