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
        return offerRepository.save(offer);
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
        Offer offer = getOfferById(id);
        offerRepository.delete(offer);
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