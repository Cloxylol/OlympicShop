package com.olympicshop.service;

import com.olympicshop.model.*;
import com.olympicshop.repository.BookingRepository;
import com.olympicshop.repository.CartRepository;
import com.olympicshop.repository.UserRepository;
import com.olympicshop.repository.OfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private CartRepository cartRepository;

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    public Booking getBookingByCode(String bookingCode) {
        return bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new RuntimeException("Booking not found with code: " + bookingCode));
    }

    public List<Booking> getBookingsByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUser(user);
    }

    public List<Booking> getBookingsByOffer(Long offerId) {
        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found"));
        return bookingRepository.findByTicketOffer(offer);
    }

    public List<Booking> getBookingsByDateRange(LocalDateTime start, LocalDateTime end) {
        return bookingRepository.findByBookingDateBetween(start, end);
    }

    @Transactional
    public void deleteBooking(Long id) {
        Booking booking = getBookingById(id);
        bookingRepository.delete(booking);
    }

    private String generateBookingCode() {
        return UUID.randomUUID().toString();
    }

    @Transactional
    public List<Booking> createMultipleBookings(String username) {

        List<Booking> bookings = new ArrayList<>();
        User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("User do not have Cart"));;

            for (CartItem item : cart.getItems()) {

                Booking booking = new Booking();
                booking.setUser(user);
                booking.setTicketOffer(item.getOffer());
                booking.setBookingDate(LocalDateTime.now());
                booking.setBookingCode(generateBookingCode());
                booking.setNumberOfTickets(item.getQuantity());

                // TODO: Générer le QR code ici

                bookings.add(bookingRepository.save(booking));
            }

        return bookings;
    }

}