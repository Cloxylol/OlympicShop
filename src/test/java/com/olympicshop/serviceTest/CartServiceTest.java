package com.olympicshop.serviceTest;

import com.olympicshop.model.Cart;
import com.olympicshop.model.CartItem;
import com.olympicshop.model.Offer;
import com.olympicshop.model.User;
import com.olympicshop.repository.CartRepository;
import com.olympicshop.service.CartService;
import com.olympicshop.service.OfferService;
import com.olympicshop.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private UserService userService;

    @Mock
    private OfferService offerService;

    @InjectMocks
    private CartService cartService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddToCart() {
        User user = new User();
        user.setId(1L);
        Offer offer = new Offer();
        offer.setId(1L);
        offer.setPrice(100.0);
        Cart cart = new Cart();
        cart.setUser(user);

        when(userService.getUserById(1L)).thenReturn(user);
        when(offerService.getOfferById(1L)).thenReturn(offer);
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        Cart updatedCart = cartService.addToCart(1L, 1L, 2);

        assertNotNull(updatedCart);
        assertEquals(1, updatedCart.getItems().size());
        assertEquals(2, updatedCart.getItems().get(0).getQuantity());
        verify(cartRepository).save(cart);
    }

    @Test
    void testRemoveFromCart() {
        User user = new User();
        user.setId(1L);
        Offer offer = new Offer();
        offer.setId(1L);
        CartItem cartItem = new CartItem();
        cartItem.setOffer(offer);
        cartItem.setQuantity(2);
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setItems(new ArrayList<>());
        cart.getItems().add(cartItem);

        when(userService.getUserById(1L)).thenReturn(user);
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        Cart updatedCart = cartService.removeFromCart(1L, 1L);

        assertNotNull(updatedCart);
        assertTrue(updatedCart.getItems().isEmpty());
        verify(cartRepository).save(cart);
    }

    @Test
    void testGetCart() {
        User user = new User();
        user.setId(1L);
        Cart cart = new Cart();
        cart.setUser(user);

        when(userService.getUserById(1L)).thenReturn(user);
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));

        Cart foundCart = cartService.getCart(1L);

        assertNotNull(foundCart);
        assertEquals(user, foundCart.getUser());
    }

    @Test
    void testUpdateCartItemQuantity() {
        User user = new User();
        user.setId(1L);
        Offer offer = new Offer();
        offer.setId(1L);
        CartItem cartItem = new CartItem();
        cartItem.setOffer(offer);
        cartItem.setQuantity(2);
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setItems(Arrays.asList(cartItem));

        when(userService.getUserById(1L)).thenReturn(user);
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        Cart updatedCart = cartService.updateQuantity(1L, 1L, 3);

        assertNotNull(updatedCart);
        assertEquals(1, updatedCart.getItems().size());
        assertEquals(3, updatedCart.getItems().get(0).getQuantity());
        verify(cartRepository).save(cart);
    }
}