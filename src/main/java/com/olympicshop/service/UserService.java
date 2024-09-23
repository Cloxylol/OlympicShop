package com.olympicshop.service;

import ch.qos.logback.core.util.StringUtil;
import com.olympicshop.security.JwtUtils;
import com.olympicshop.model.User;
import com.olympicshop.repository.UserRepository;
import com.olympicshop.security.UserDetailsImpl;
import com.olympicshop.util.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.nio.ByteBuffer;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.List;

@Service
public class UserService implements UserDetailsService {

    private static final int KEY_LENGTH_BYTES = 32;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    @Lazy
    private AuthenticationManager authenticationManager;

    private final JwtUtils jwtUtils;


    @Autowired
    public UserService(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    public String loginUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        return jwtUtils.generateJwtToken(authentication);
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        return UserDetailsImpl.build(user);
    }

    @Transactional
    public User registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user.setSecurityKey("");
        user = userRepository.save(user); // Save pour avoir l'ident
        String securityKey = generateSecurityKey(user.getId());
        user.setSecurityKey(securityKey);
        return userRepository.save(user); // Save à nouveau avec la securityKey
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Transactional
    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }

    private String generateSecurityKey(Long userId) {
        ByteBuffer buffer = ByteBuffer.allocate(KEY_LENGTH_BYTES + Long.BYTES + Long.BYTES);

        byte[] randomBytes = new byte[KEY_LENGTH_BYTES];
        SECURE_RANDOM.nextBytes(randomBytes);

        buffer.put(randomBytes);
        buffer.putLong(userId);
        buffer.putLong(Instant.now().getEpochSecond());

        return Base64.getUrlEncoder().withoutPadding().encodeToString(buffer.array());
    }
}