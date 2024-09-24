package com.olympicshop.service;

import com.olympicshop.dto.UserDTO;
import com.olympicshop.model.Cart;
import com.olympicshop.model.CartItem;
import com.olympicshop.model.Offer;
import com.olympicshop.model.User;
import com.olympicshop.repository.CartRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final OfferService offerService;
    private final UserService userService;

    public CartService(CartRepository cartRepository, OfferService offerService, @Lazy UserService userService) {
        this.cartRepository = cartRepository;
        this.offerService = offerService;
        this.userService = userService;
    }

    @Transactional
    public Cart addToCart(Long userId, Long offerId, int quantity) {

        Offer offer = offerService.getOfferById(offerId);
        Cart cart = getOrCreateCart(userId);

        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getOffer().getId().equals(offer.getId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setOffer(offer);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart removeFromCart(Long userId, Long offerId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(item -> item.getOffer().getId().equals(offerId));
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart updateQuantity(Long userId, Long offerId, int quantity) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().stream()
                .filter(item -> item.getOffer().getId().equals(offerId))
                .findFirst()
                .ifPresent(item -> item.setQuantity(quantity));
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart getCart(Long userId) {
        return getOrCreateCart(userId);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public double getTotalPrice(Cart cart) {
        return cart.getItems().stream()
                .mapToDouble(item -> item.getOffer().getPrice() * item.getQuantity())
                .sum();
    }


    private Cart getOrCreateCart(Long userId) {
        User user = userService.getUserById(userId);
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }
}