package com.online.marketplace.config.bootstrap;

import com.online.marketplace.model.Role;
import com.online.marketplace.model.User;
import com.online.marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminBootstrapConfig {

    @Bean
    CommandLineRunner seedAdmin(UserRepository userRepository,
                                PasswordEncoder passwordEncoder,
                                @Value("${app.admin.seed.email:}") String adminEmail,
                                @Value("${app.admin.seed.password:}") String adminPassword,
                                @Value("${app.admin.seed.name:System Admin}") String adminName) {
        return args -> {
            if (adminEmail == null || adminEmail.isBlank() || adminPassword == null || adminPassword.isBlank()) {
                return;
            }

            userRepository.findByEmail(adminEmail).ifPresentOrElse(existing -> {
                existing.setRole(Role.ADMIN);
                existing.setActive(true);
                if (existing.getPassword() == null || existing.getPassword().isBlank()
                        || "GOOGLE_AUTH".equals(existing.getPassword())) {
                    existing.setPassword(passwordEncoder.encode(adminPassword));
                }
                userRepository.save(existing);
            }, () -> {
                User admin = new User();
                admin.setName(adminName);
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole(Role.ADMIN);
                admin.setActive(true);
                userRepository.save(admin);
            });
        };
    }
}
