package com.olympicshop.serviceTest;

import com.olympicshop.model.*;
import com.olympicshop.repository.BookingRepository;
import com.olympicshop.repository.CartRepository;
import com.olympicshop.repository.UserRepository;
import com.olympicshop.repository.OfferRepository;
import com.olympicshop.service.BookingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OfferRepository offerRepository;

    @Mock
    private CartRepository cartRepository;

    @InjectMocks
    private BookingService bookingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetBookingById() {
        Long bookingId = 1L;
        Booking expectedBooking = new Booking();
        expectedBooking.setId(bookingId);

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(expectedBooking));

        Booking actualBooking = bookingService.getBookingById(bookingId);

        assertEquals(expectedBooking, actualBooking);
    }

    @Test
    void testGetBookingByCode() {
        String bookingCode = "ABC123";
        Booking expectedBooking = new Booking();
        expectedBooking.setBookingCode(bookingCode);

        when(bookingRepository.findByBookingCode(bookingCode)).thenReturn(Optional.of(expectedBooking));

        Booking actualBooking = bookingService.getBookingByCode(bookingCode);

        assertEquals(expectedBooking, actualBooking);
    }

    @Test
    void testGetBookingsByUser() {
        String username = "testuser";
        User user = new User();
        user.setUsername(username);
        List<Booking> expectedBookings = Arrays.asList(new Booking(), new Booking());

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(bookingRepository.findByUser(user)).thenReturn(expectedBookings);

        List<Booking> actualBookings = bookingService.getBookingsByUser(username);

        assertEquals(expectedBookings, actualBookings);
    }

    @Test
    void testCreateMultipleBookings() {
        String username = "testuser";
        User user = new User();
        user.setUsername(username);
        Cart cart = new Cart();
        cart.setUser(user);

        Offer offer1 = new Offer();
        offer1.setId(1L);
        CartItem item1 = new CartItem();
        item1.setOffer(offer1);
        item1.setQuantity(2);

        Offer offer2 = new Offer();
        offer2.setId(2L);
        CartItem item2 = new CartItem();
        item2.setOffer(offer2);
        item2.setQuantity(1);

        cart.setItems(Arrays.asList(item1, item2));

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        List<Booking> createdBookings = bookingService.createMultipleBookings(username);

        assertEquals(2, createdBookings.size());
        assertEquals(2, createdBookings.get(0).getNumberOfTickets());
        assertEquals(1, createdBookings.get(1).getNumberOfTickets());
        verify(bookingRepository, times(2)).save(any(Booking.class));
    }

    @Test
    void testDeleteBooking() {
        Long bookingId = 1L;
        Booking booking = new Booking();
        booking.setId(bookingId);

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));

        bookingService.deleteBooking(bookingId);

        verify(bookingRepository).delete(booking);
    }
}