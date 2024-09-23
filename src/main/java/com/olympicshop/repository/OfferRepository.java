package com.olympicshop.repository;

import com.olympicshop.model.Offer;
import com.olympicshop.model.OfferType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {

    // Trouver toutes les offres d'un type spécifique
    List<Offer> findByOfferType(OfferType offerType);


    // Trouver toutes les offres, triées par prix
    List<Offer> findAllByOrderByPriceAsc();

}