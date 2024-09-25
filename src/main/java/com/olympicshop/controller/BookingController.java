package com.olympicshop.controller;

import com.olympicshop.model.Booking;
import com.olympicshop.security.JwtUtils;
import com.olympicshop.service.BookingService;
import com.olympicshop.service.SessionService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final SessionService sessionService;
    private final JwtUtils jwtUtils;

    public BookingController(BookingService bookingService, SessionService sessionService, JwtUtils jwtUtils) {
        this.bookingService = bookingService;
        this.sessionService = sessionService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/create-multiple")
    public ResponseEntity<List<Booking>> createMultipleBookings() throws Exception {
        String token = sessionService.getToken();
        String username = jwtUtils.extractUsername(token);
        List<Booking> bookings = bookingService.createMultipleBookings(username);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/code/{bookingCode}")
    public ResponseEntity<Booking> getBookingByCode(@PathVariable String bookingCode) {
        return ResponseEntity.ok(bookingService.getBookingByCode(bookingCode));
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUser(@PathVariable Long userId) throws Exception {
        String token = sessionService.getToken();
        String username = jwtUtils.extractUsername(token);
        return bookingService.getBookingsByUser(username);
    }

    @GetMapping("/offer/{offerId}")
    public List<Booking> getBookingsByOffer(@PathVariable Long offerId) {
        return bookingService.getBookingsByOffer(offerId);
    }

    @GetMapping("/date-range")
    public List<Booking> getBookingsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return bookingService.getBookingsByDateRange(start, end);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok("Booking deleted successfully");
    }
}