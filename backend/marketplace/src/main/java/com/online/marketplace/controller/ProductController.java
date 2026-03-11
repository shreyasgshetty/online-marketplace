package com.online.marketplace.controller;

import com.online.marketplace.model.Product;
import com.online.marketplace.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping("/sell")
    public Product sellProduct(@RequestBody Product product) {

        return productService.createProduct(product);

    }
}