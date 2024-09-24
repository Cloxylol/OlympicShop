package com.olympicshop.controller;

import com.olympicshop.dto.UserDTO;
import com.olympicshop.model.Cart;
import com.olympicshop.model.User;
import com.olympicshop.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestBody Long userId, @RequestParam Long offerId, @RequestParam(defaultValue = "1") int quantity) {
            Cart updatedCart = cartService.addToCart(userId, offerId, quantity);
            return ResponseEntity.ok(updatedCart);
    }

    @PostMapping("/remove")
    public ResponseEntity<Cart> removeFromCart(@RequestBody Long userId, @RequestParam Long offerId) {
            Cart updatedCart = cartService.removeFromCart(userId, offerId);
            return ResponseEntity.ok(updatedCart);
    }

    @PostMapping("/update")
    public ResponseEntity<Cart> updateQuantity(@RequestBody Long userId, @RequestParam Long offerId, @RequestParam int quantity) {
            Cart updatedCart = cartService.updateQuantity(userId, offerId, quantity);
            return ResponseEntity.ok(updatedCart);
    }

    @GetMapping
    public ResponseEntity<Cart> getCart(@RequestParam Long userId) {
            Cart cart = cartService.getCart(userId);
            return ResponseEntity.ok(cart);
    }

    @PostMapping("/clear")
    public ResponseEntity<Cart> clearCart(@RequestBody Long userId) {
            cartService.clearCart(userId);
            Cart clearedCart = cartService.getCart(userId);
            return ResponseEntity.ok(clearedCart);
    }


}