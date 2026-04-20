package com.online.marketplace.controller;

import com.online.marketplace.service.FinanceService;
import com.online.marketplace.service.FinanceStats;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/finance")
@CrossOrigin("*")
public class FinanceController {

    @Autowired
    private FinanceService financeService;

    @GetMapping("/stats")
    public FinanceStats getStats() {
        return financeService.getStats();
    }
}