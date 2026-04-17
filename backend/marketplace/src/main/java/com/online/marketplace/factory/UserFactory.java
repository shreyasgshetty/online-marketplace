package com.online.marketplace.factory;

import com.online.marketplace.model.Role;
import com.online.marketplace.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;

public class UserFactory {

    public static User createUser(User inputUser, PasswordEncoder encoder) {

        User user = new User();

        user.setName(inputUser.getName());
        user.setEmail(inputUser.getEmail());
        user.setRole(Role.USER);
        user.setWalletBalance(0.0);

        // Google user
        if (inputUser.getPassword() == null || inputUser.getPassword().equals("GOOGLE_AUTH")) {
            user.setPassword("GOOGLE_AUTH");
        }
        // Normal user
        else {
            user.setPassword(encoder.encode(inputUser.getPassword()));
        }

        return user;
    }
}