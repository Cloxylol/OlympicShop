package com.olympicshop.serviceTest;

import com.olympicshop.service.SessionService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class SessionServiceTest {

    @Mock
    private HttpServletRequest mockRequest;

    private SessionService sessionService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        sessionService = new SessionService(mockRequest);
    }

    @Test
    void testGetToken_ValidToken() throws Exception {
        String validToken = "valid_token";
        when(mockRequest.getHeader("Authorization")).thenReturn("Bearer " + validToken);

        String result = sessionService.getToken();

        assertEquals(validToken, result);
    }

    @Test
    void testGetToken_NoAuthorizationHeader() {
        when(mockRequest.getHeader("Authorization")).thenReturn(null);

        Exception exception = assertThrows(Exception.class, () -> {
            sessionService.getToken();
        });

        assertEquals("Not Authenticated", exception.getMessage());
    }

    @Test
    void testGetToken_InvalidAuthorizationHeader() {
        when(mockRequest.getHeader("Authorization")).thenReturn("InvalidHeader");

        Exception exception = assertThrows(Exception.class, () -> {
            sessionService.getToken();
        });

        assertEquals("Not Authenticated", exception.getMessage());
    }
}