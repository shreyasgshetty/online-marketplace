package com.online.marketplace.controller;

import com.online.marketplace.model.Product;
import com.online.marketplace.service.ProductService;
import com.online.marketplace.repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    // Create product
    @PostMapping("/sell")
    public Product sellProduct(@RequestBody Product product) {
        return productService.createProduct(product);
    }

    // Get all products (for homepage)
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/trending")
    public List<Product> getTrendingProducts() {

        List<Product> products = productRepository.findAll();

        return products.stream().limit(10).toList();
    }

    @GetMapping("/recommended")
    public List<Product> getRecommended() {

        List<Product> products = productRepository.findAll();

        return products.stream().skip(10).limit(10).toList();
    }

    @GetMapping("/category/{category}")
    public List<Product> getCategoryProducts(@PathVariable String category) {

        return productRepository.findByCategory(category);

    }

}