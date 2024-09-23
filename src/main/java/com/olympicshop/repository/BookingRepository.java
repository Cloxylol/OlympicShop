package com.olympicshop.repository;

import com.olympicshop.model.Booking;
import com.olympicshop.model.User;
import com.olympicshop.model.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUser(User user);

    List<Booking> findByTicketOffer(Offer ticketOffer);

    Optional<Booking> findByBookingCode(String bookingCode);

    List<Booking> findByBookingDateBetween(LocalDateTime start, LocalDateTime end);

    long countByTicketOffer(Offer ticketOffer);
}