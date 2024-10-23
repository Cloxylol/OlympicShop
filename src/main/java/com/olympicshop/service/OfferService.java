package com.olympicshop.service;

import com.olympicshop.model.Offer;
import com.olympicshop.model.Offer;
import com.olympicshop.model.OfferType;
import com.olympicshop.repository.OfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OfferService {

    @Autowired
    private OfferRepository offerRepository;

    @Transactional
    public Offer createOffer(Offer offer) {
        controlOffer(offer);
        return offerRepository.save(offer);
    }

    private void controlOffer(Offer offer) {
        if(offer==null){
            throw new IllegalArgumentException("Offer is null");
        }
        if(offer.getPrice() < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
        if(offer.getCapacity() <= 0) {
            throw new IllegalArgumentException("Capacity must be greater than zero");
        }
    }

    public Offer getOfferById(Long id) {
        return offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer not found with id: " + id));
    }

    @Transactional
    public Offer updateOffer(Long id, Offer offerDetails) {
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer not found for id: " + id));

        offer.setName(offerDetails.getName());
        offer.setPrice(offerDetails.getPrice());
        offer.setCapacity(offerDetails.getCapacity());
        offer.setDescription(offerDetails.getDescription());
        offer.setOfferType(offerDetails.getOfferType());

        return offerRepository.save(offer);
    }

    @Transactional
    public void deleteOffer(Long id) {
        if (!offerRepository.existsById(id)) {
            throw new RuntimeException("Offer not found with id: " + id);
        }
        offerRepository.deleteById(id);
    }

    public List<Offer> getAllOffers() {
        return offerRepository.findAll();
    }

    public List<Offer> getOffersByType(OfferType type) {
        return offerRepository.findByOfferType(type);
    }

    public List<Offer> getOffersSortedByPrice() {
        return offerRepository.findAllByOrderByPriceAsc();
    }

}