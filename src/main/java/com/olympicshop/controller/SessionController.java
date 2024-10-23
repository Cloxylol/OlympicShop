package com.olympicshop.controller;

import com.olympicshop.service.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/session")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @GetMapping("/validate")
    public ResponseEntity<Void> validateSession() {
        if (sessionService.validateSession()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(401).build();
    }
}