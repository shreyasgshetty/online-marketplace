package com.online.marketplace.controller.admin;

import com.online.marketplace.dto.admin.AdminDashboardSummaryResponse;
import com.online.marketplace.model.Banner;
import com.online.marketplace.model.Product;
import com.online.marketplace.model.Role;
import com.online.marketplace.model.User;
import com.online.marketplace.repository.BannerRepository;
import com.online.marketplace.repository.ProductRepository;
import com.online.marketplace.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.io.File;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final BannerRepository bannerRepository;

    public AdminController(UserRepository userRepository,
                           ProductRepository productRepository,
                           BannerRepository bannerRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.bannerRepository = bannerRepository;
    }

    @GetMapping("/dashboard/summary")
    public AdminDashboardSummaryResponse dashboardSummary() {
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalBanners = bannerRepository.count();
        long activeUsers = userRepository.findAll().stream()
                .filter(u -> u.getActive() == null || u.getActive())
                .count();

        return new AdminDashboardSummaryResponse(totalUsers, totalProducts, totalBanners, activeUsers);
    }

    @GetMapping("/users")
    public List<User> allUsers() {
        return userRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    @PatchMapping("/users/{id}/status")
    public User updateUserStatus(@PathVariable String id, @RequestBody Map<String, Boolean> body) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(body.getOrDefault("active", true));
        return userRepository.save(user);
    }

    @PatchMapping("/users/{id}/role")
    public User updateUserRole(@PathVariable String id, @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        String roleValue = body.get("role");
        if (roleValue == null) {
            throw new RuntimeException("Role is required");
        }
        user.setRole(Role.valueOf(roleValue));
        return userRepository.save(user);
    }

    @GetMapping("/products")
    public List<Product> allProducts() {
        List<Product> products = productRepository.findAll();
        products.forEach(p -> {
            if (p.getModerationStatus() == null || p.getModerationStatus().isBlank()) {
                p.setModerationStatus("PENDING");
            }
        });
        return products;
    }

    @PatchMapping("/products/{id}/status")
    public Product updateProductStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        String status = body.get("status");
        if (status == null) {
            throw new RuntimeException("Status is required");
        }

        product.setModerationStatus(status);
        product.setReviewedAt(LocalDateTime.now());
        product.setRejectionReason(body.get("rejectionReason"));

        return productRepository.save(product);
    }

    @DeleteMapping("/products/{id}")
    public String deleteProduct(@PathVariable String id) {
        productRepository.deleteById(id);
        return "Product deleted";
    }

    @GetMapping("/banners")
    public List<Banner> banners() {
        return bannerRepository.findAll();
    }

    @PostMapping("/banners/upload")
    public Banner uploadBanner(
            @RequestParam("file") MultipartFile file,
            @RequestParam("category") String category,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "tag", required = false) String tag) throws IOException {

        String uploadPath = System.getProperty("user.dir") + "/uploads/";
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        file.transferTo(new File(uploadPath + fileName));

        Banner banner = new Banner();
        banner.setImageUrl("http://localhost:8080/uploads/" + fileName);
        banner.setRedirectCategory(category);
        banner.setTitle(title);
        banner.setDescription(description);
        banner.setTag(tag);

        return bannerRepository.save(banner);
    }

    @DeleteMapping("/banners/{id}")
    public String deleteBanner(@PathVariable String id) {
        bannerRepository.deleteById(id);
        return "Banner deleted";
    }
}
