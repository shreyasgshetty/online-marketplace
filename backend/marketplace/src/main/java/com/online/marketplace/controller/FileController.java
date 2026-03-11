package com.online.marketplace.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@CrossOrigin("*")
public class FileController {

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file) throws IOException {

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        File directory = new File(UPLOAD_DIR);

        if (!directory.exists()) {
            directory.mkdirs();
        }

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        File destination = new File(UPLOAD_DIR + fileName);

        file.transferTo(destination);

        return "http://localhost:8080/uploads/" + fileName;
    }
}