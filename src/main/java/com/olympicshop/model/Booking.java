package com.olympicshop.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "ticket_offer_id", nullable = false)
    private Offer ticketOffer;

    @Column(name = "booking_date", nullable = false)
    private LocalDateTime bookingDate;

    @Column(nullable = false, unique = true)
    private String bookingCode;

    @Column(name = "number_of_tickets", nullable = false)
    private Integer numberOfTickets;

    @Lob
    @Column(name = "qr_code")
    private byte[] qrCode;

    public Booking() {
    }

    public Booking(Long id, User user, Offer ticketOffer, LocalDateTime bookingDate, String bookingCode, Integer numberOfTickets, byte[] qrCode) {
        this.id = id;
        this.user = user;
        this.ticketOffer = ticketOffer;
        this.bookingDate = bookingDate;
        this.bookingCode = bookingCode;
        this.numberOfTickets = numberOfTickets;
        this.qrCode = qrCode;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Offer getTicketOffer() {
        return ticketOffer;
    }

    public void setTicketOffer(Offer ticketOffer) {
        this.ticketOffer = ticketOffer;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getBookingCode() {
        return bookingCode;
    }

    public void setBookingCode(String bookingCode) {
        this.bookingCode = bookingCode;
    }

    public Integer getNumberOfTickets() {
        return numberOfTickets;
    }

    public void setNumberOfTickets(Integer numberOfTickets) {
        this.numberOfTickets = numberOfTickets;
    }

    public byte[] getQrCode() {
        return qrCode;
    }

    public void setQrCode(byte[] qrCode) {
        this.qrCode = qrCode;
    }
}