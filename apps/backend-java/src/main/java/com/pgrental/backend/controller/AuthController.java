package com.pgrental.backend.controller;

import com.pgrental.backend.entity.User;
import com.pgrental.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {
    private final AuthService authService;

    @PostMapping("/request-otp")
    public Map<String, String> requestOtp(@RequestBody Map<String, String> request) {
        String phone = request.get("phone");
        User.Role role = User.Role.valueOf(request.get("role").toUpperCase());
        String name = request.get("name");
        
        String otp = authService.requestOtp(phone, role, name);
        return Map.of("message", "OTP sent", "devOtp", otp);
    }

    @PostMapping("/verify-otp")
    public AuthService.AuthResponse verifyOtp(@RequestBody Map<String, String> request) {
        String phone = request.get("phone");
        String otp = request.get("otp");
        User.Role role = User.Role.valueOf(request.get("role").toUpperCase());
        
        return authService.verifyOtp(phone, otp, role);
    }
}
