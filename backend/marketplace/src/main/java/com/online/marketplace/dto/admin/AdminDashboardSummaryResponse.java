package com.online.marketplace.dto.admin;

public class AdminDashboardSummaryResponse {

    private long totalUsers;
    private long totalProducts;
    private long totalBanners;
    private long activeUsers;

    public AdminDashboardSummaryResponse(long totalUsers, long totalProducts, long totalBanners, long activeUsers) {
        this.totalUsers = totalUsers;
        this.totalProducts = totalProducts;
        this.totalBanners = totalBanners;
        this.activeUsers = activeUsers;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public long getTotalBanners() {
        return totalBanners;
    }

    public long getActiveUsers() {
        return activeUsers;
    }
}
