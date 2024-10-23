package com.olympicshop.serviceTest;

import com.olympicshop.model.User;
import com.olympicshop.repository.UserRepository;
import com.olympicshop.security.JwtUtils;
import com.olympicshop.service.UserService;
import com.olympicshop.util.LoginRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterUser() {
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("password");

        User savedUserWithId = new User();
        savedUserWithId.setId(1L); // Simuler l'ID généré
        savedUserWithId.setUsername("testuser");
        savedUserWithId.setPassword("encodedPassword");

        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class)))
                .thenReturn(savedUserWithId) //
                .thenAnswer(invocation -> invocation.getArgument(0)); //

        User result = userService.registerUser(user);

        assertNotNull(result);
        assertNotNull(result.getId());
        assertNotNull(result.getSecurityKey());
        assertEquals("testuser", result.getUsername());
        verify(userRepository, times(2)).save(any(User.class));
    }

    @Test
    void testRegisterUserUsernameExists() {
        User user = new User();
        user.setUsername("existinguser");
        user.setEmail("test@example.com");

        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> userService.registerUser(user));
    }

    @Test
    void testLoginUser() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password");

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("jwtToken");

        String token = userService.loginUser(loginRequest);

        assertNotNull(token);
        assertEquals("jwtToken", token);
    }

    @Test
    void testGetUserById() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User foundUser = userService.getUserById(1L);

        assertNotNull(foundUser);
        assertEquals(1L, foundUser.getId());
        assertEquals("testuser", foundUser.getUsername());
    }

    @Test
    void testGetUserByIdNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.getUserById(1L));
    }
}