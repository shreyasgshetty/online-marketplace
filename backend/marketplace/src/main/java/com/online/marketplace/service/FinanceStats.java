package com.online.marketplace.service;

public class FinanceStats {

    private double totalWallet;
    private int totalTransactions;
    private long approved;
    private long rejected;
    private long pending;
    private double totalPlatformFee;

    public FinanceStats(double totalWallet, int totalTransactions,
            long approved, long rejected, long pending,
            double totalPlatformFee) {

        this.totalWallet = totalWallet;
        this.totalTransactions = totalTransactions;
        this.approved = approved;
        this.rejected = rejected;
        this.pending = pending;
        this.totalPlatformFee = totalPlatformFee;
    }

    public double getTotalWallet() {
        return totalWallet;
    }

    public int getTotalTransactions() {
        return totalTransactions;
    }

    public long getApproved() {
        return approved;
    }

    public long getRejected() {
        return rejected;
    }

    public long getPending() {
        return pending;
    }

    public double getTotalPlatformFee() {
        return totalPlatformFee;
    }
}