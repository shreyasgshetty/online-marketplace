package com.online.marketplace.controller;

import com.online.marketplace.model.Banner;
import com.online.marketplace.repository.BannerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/banners")
@CrossOrigin("*")
public class BannerController {

    @Autowired
    private BannerRepository bannerRepository;

    // ✅ Get all banners
    @GetMapping
    public List<Banner> getBanners() {
        return bannerRepository.findAll();
    }

    // ✅ Upload banner (MAIN FEATURE)
    @PostMapping("/upload")
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

        String filePath = uploadPath + fileName;

        file.transferTo(new File(filePath));

        Banner banner = new Banner();

        banner.setImageUrl("http://localhost:8080/uploads/" + fileName);
        banner.setRedirectCategory(category);
        banner.setTitle(title);
        banner.setDescription(description);
        banner.setTag(tag);

        return bannerRepository.save(banner);
    }

    // ✅ Delete banner
    @DeleteMapping("/{id}")
    public String deleteBanner(@PathVariable String id) {

        bannerRepository.deleteById(id);

        return "Banner deleted successfully";
    }

}