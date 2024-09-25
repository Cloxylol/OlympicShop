package com.olympicshop.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ticket_offers")
public class Offer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private OfferType offerType;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public OfferType getOfferType() {
        return offerType;
    }

    public void setOfferType(OfferType offerType) {
        this.offerType = offerType;
    }

    public Offer() {
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Offer(Long id, String name, Double price, Integer capacity, String description, OfferType offerType) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.capacity = capacity;
        this.description = description;
        this.offerType = offerType;
    }
}
