package com.olympicshop.service;

import com.olympicshop.model.Booking;
import com.olympicshop.model.User;
import com.olympicshop.model.Offer;
import com.olympicshop.repository.BookingRepository;
import com.olympicshop.repository.UserRepository;
import com.olympicshop.repository.OfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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

    @Transactional
    public Booking createBooking(Booking booking) {
        User user = userRepository.findById(booking.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Offer offer = offerRepository.findById(booking.getTicketOffer().getId())
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        booking.setUser(user);
        booking.setTicketOffer(offer);
        booking.setBookingDate(LocalDateTime.now());
        booking.setBookingCode(generateBookingCode());

        // TODO GENERER LE QR CODE ?

        return bookingRepository.save(booking);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    public Booking getBookingByCode(String bookingCode) {
        return bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new RuntimeException("Booking not found with code: " + bookingCode));
    }

    public List<Booking> getBookingsByUser(Long userId) {
        User user = userRepository.findById(userId)
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
}