package com.olympicshop.serviceTest;

import com.olympicshop.model.*;
import com.olympicshop.repository.BookingRepository;
import com.olympicshop.repository.CartRepository;
import com.olympicshop.repository.UserRepository;
import com.olympicshop.repository.OfferRepository;
import com.olympicshop.service.BookingService;
import com.olympicshop.service.QRCodeService;
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

    @Mock
    private QRCodeService qrCodeService;

    @InjectMocks
    private BookingService bookingService;

    private User testUser;
    private Cart testCart;
    private Offer testOffer;
    private byte[] testQrCode;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setSecurityKey("test-security-key");

        testOffer = new Offer();
        testOffer.setId(1L);
        testOffer.setName("Test Offer");

        testQrCode = "test-qr-code".getBytes();

        testCart = new Cart();
        testCart.setUser(testUser);
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
        expectedBooking.setQrCode(testQrCode);

        when(bookingRepository.findByBookingCode(bookingCode)).thenReturn(Optional.of(expectedBooking));

        Booking actualBooking = bookingService.getBookingByCode(bookingCode);

        assertEquals(expectedBooking, actualBooking);
        assertNotNull(actualBooking.getQrCode());
        assertArrayEquals(testQrCode, actualBooking.getQrCode());
    }

    @Test
    void testGetBookingsByUser() {
        String username = "testuser";
        List<Booking> expectedBookings = Arrays.asList(
                createTestBooking(1L, "CODE1"),
                createTestBooking(2L, "CODE2")
        );

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(testUser));
        when(bookingRepository.findByUser(testUser)).thenReturn(expectedBookings);

        List<Booking> actualBookings = bookingService.getBookingsByUser(username);

        assertEquals(expectedBookings.size(), actualBookings.size());
        assertEquals(expectedBookings, actualBookings);
    }

    @Test
    void testCreateMultipleBookings() {
        // Préparation du panier avec plusieurs articles
        CartItem item1 = new CartItem();
        item1.setOffer(testOffer);
        item1.setQuantity(2);

        CartItem item2 = new CartItem();
        Offer offer2 = new Offer();
        offer2.setId(2L);
        item2.setOffer(offer2);
        item2.setQuantity(1);

        testCart.setItems(Arrays.asList(item1, item2));

        // Configuration des mocks
        when(userRepository.findByUsername(testUser.getUsername())).thenReturn(Optional.of(testUser));
        when(cartRepository.findByUser(testUser)).thenReturn(Optional.of(testCart));
        when(qrCodeService.generateQRCode(anyString(), eq(testUser.getSecurityKey()))).thenReturn(testQrCode);
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking booking = invocation.getArgument(0);
            booking.setId(new Random().nextLong());
            return booking;
        });

        // Exécution
        List<Booking> createdBookings = bookingService.createMultipleBookings(testUser.getUsername());

        // Vérifications
        assertEquals(2, createdBookings.size());
        verify(qrCodeService, times(2)).generateQRCode(anyString(), eq(testUser.getSecurityKey()));
        verify(bookingRepository, times(2)).save(any(Booking.class));

        for (Booking booking : createdBookings) {
            assertNotNull(booking.getQrCode());
            assertNotNull(booking.getBookingCode());
            assertArrayEquals(testQrCode, booking.getQrCode());
        }
    }

    @Test
    void testCreateMultipleBookings_QRCodeGenerationFailure() {
        // Préparation
        CartItem item = new CartItem();
        item.setOffer(testOffer);
        item.setQuantity(1);
        testCart.setItems(Collections.singletonList(item));

        when(userRepository.findByUsername(testUser.getUsername())).thenReturn(Optional.of(testUser));
        when(cartRepository.findByUser(testUser)).thenReturn(Optional.of(testCart));
        when(qrCodeService.generateQRCode(anyString(), anyString()))
                .thenThrow(new RuntimeException("QR Code generation failed"));

        // Vérification que l'exception est bien propagée
        assertThrows(RuntimeException.class, () ->
                bookingService.createMultipleBookings(testUser.getUsername())
        );

        // Vérification qu'aucune réservation n'a été sauvegardée
        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    void testDeleteBooking() {
        Long bookingId = 1L;
        Booking booking = createTestBooking(bookingId, "DELETE-TEST");

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));

        bookingService.deleteBooking(bookingId);

        verify(bookingRepository).delete(booking);
    }

    private Booking createTestBooking(Long id, String code) {
        Booking booking = new Booking();
        booking.setId(id);
        booking.setBookingCode(code);
        booking.setUser(testUser);
        booking.setQrCode(testQrCode);
        booking.setBookingDate(LocalDateTime.now());
        return booking;
    }
}