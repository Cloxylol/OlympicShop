package com.olympicshop.service;

import com.olympicshop.security.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class SessionService {
    
    private final HttpServletRequest request;
    private final JwtUtils jwtUtils;
    private final UserService userService;


    private final String AUTHORIZATION = "Authorization";
    private final String AUTHORIZATION_PREFIX = "Bearer ";

    public SessionService(HttpServletRequest request, JwtUtils jwtUtils, UserService userService) {
        this.request = request;
        this.jwtUtils = jwtUtils;
        this.userService = userService;
    }

    public String getToken() throws Exception {

        String header = request.getHeader(AUTHORIZATION);
        if (!(header != null && header.startsWith(AUTHORIZATION_PREFIX))) {
            throw new Exception("Not Authenticated");
        }
        return header.substring(AUTHORIZATION_PREFIX.length());
    }

    public boolean validateSession() {
        try {
            String token = getToken();
            String username = jwtUtils.extractUsername(token);
            UserDetails userDetails = userService.loadUserByUsername(username);
            return jwtUtils.isTokenValid(token, userDetails);
        } catch (Exception e) {
            return false;
        }
    }
}