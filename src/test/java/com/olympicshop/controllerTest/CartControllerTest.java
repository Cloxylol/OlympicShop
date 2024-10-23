package com.olympicshop.controllerTest;

import com.olympicshop.controller.CartController;
import com.olympicshop.model.Cart;
import com.olympicshop.model.CartItem;
import com.olympicshop.service.CartService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CartController.class)
class CartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CartService cartService;

    private Cart testCart;

    @BeforeEach
    void setUp() {
        testCart = new Cart();
        testCart.setId(1L);
        CartItem item = new CartItem();
        item.setId(1L);
        item.setQuantity(2);
        testCart.setItems(Arrays.asList(item));
    }

    @Test
    @WithMockUser
    void testGetCart() throws Exception {
        when(cartService.getCart(anyLong())).thenReturn(testCart);

        mockMvc.perform(get("/api/cart")
                        .param("userId", "1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.items[0].quantity").value(2));
    }

}