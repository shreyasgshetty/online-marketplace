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
    public List<Product> getTrending() {

        return productRepository.findAll()
                .stream()
                .filter(p -> "fixed".equalsIgnoreCase(p.getSellingType()) &&
                        "AVAILABLE".equalsIgnoreCase(p.getStatus()))
                .toList();
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

    @PostMapping("/buy")
    public Product buyProduct(@RequestParam String productId,
            @RequestParam String buyerEmail) {

        Product p = productRepository.findById(productId).orElseThrow();

        if (!"fixed".equalsIgnoreCase(p.getSellingType())) {
            throw new RuntimeException("Not a fixed price product");
        }

        if (p.getStatus() != null && !p.getStatus().equals("LIVE")) {
            throw new RuntimeException("Product not available");
        }

        p.setBuyerEmail(buyerEmail);
        p.setStatus("AWAITING_CONFIRMATION");

        return productRepository.save(p);
    }

}