package com.olympicshop.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

@Service
public class SessionService {
    private final HttpServletRequest request;

    private final String AUTHORIZATION = "Authorization";
    private final String AUTHORIZATION_PREFIX = "Bearer ";

    public SessionService(HttpServletRequest request) {
        this.request = request;
    }

    public String getToken() throws Exception {

        String header = request.getHeader(AUTHORIZATION);
        if (!(header != null && header.startsWith(AUTHORIZATION_PREFIX))) {
            throw new Exception("Not Authenticated");
        }
        return header.substring(AUTHORIZATION_PREFIX.length());
    }
}
