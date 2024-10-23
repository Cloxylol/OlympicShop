package com.olympicshop.serviceTest;

import com.olympicshop.model.Offer;
import com.olympicshop.model.OfferType;
import com.olympicshop.repository.OfferRepository;
import com.olympicshop.service.OfferService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OfferServiceTest {

    @Mock
    private OfferRepository offerRepository;

    @InjectMocks
    private OfferService offerService;

    private Offer sampleOffer;

    @BeforeEach
    void setUp() {
        sampleOffer = new Offer();
        sampleOffer.setId(1L);
        sampleOffer.setName("Finale 100m");
        sampleOffer.setOfferType(OfferType.SOLO);
        sampleOffer.setPrice(100.00);
        sampleOffer.setCapacity(1000);
        sampleOffer.setDescription("Billet pour la finale du 100m");
    }

    @Test
    void testCreateOffer_Success() {
        when(offerRepository.save(any(Offer.class))).thenReturn(sampleOffer);

        Offer createdOffer = offerService.createOffer(sampleOffer);

        assertNotNull(createdOffer);
        assertEquals(sampleOffer.getName(), createdOffer.getName());
        assertEquals(sampleOffer.getOfferType(), createdOffer.getOfferType());
        assertEquals(sampleOffer.getPrice(), createdOffer.getPrice());
        assertEquals(sampleOffer.getCapacity(), createdOffer.getCapacity());
        verify(offerRepository, times(1)).save(any(Offer.class));
    }

    @Test
    void testCreateOffer_NegativePrice() {
        sampleOffer.setPrice(-50.00);

        assertThrows(IllegalArgumentException.class, () -> offerService.createOffer(sampleOffer));
        verify(offerRepository, never()).save(any(Offer.class));
    }

    @Test
    void testCreateOffer_ZeroCapacity() {
        sampleOffer.setCapacity(0);

        assertThrows(IllegalArgumentException.class, () -> offerService.createOffer(sampleOffer));
        verify(offerRepository, never()).save(any(Offer.class));
    }


    @Test
    void testGetAllOffers_NonEmpty() {
        List<Offer> offers = Arrays.asList(sampleOffer, new Offer());
        when(offerRepository.findAll()).thenReturn(offers);

        List<Offer> result = offerService.getAllOffers();

        assertFalse(result.isEmpty());
        assertEquals(2, result.size());
        verify(offerRepository, times(1)).findAll();
    }

    @Test
    void testGetAllOffers_Empty() {
        when(offerRepository.findAll()).thenReturn(Arrays.asList());

        List<Offer> result = offerService.getAllOffers();

        assertTrue(result.isEmpty());
        verify(offerRepository, times(1)).findAll();
    }

    @Test
    void testGetOffersByType_SOLO() {
        List<Offer> soloOffers = Arrays.asList(sampleOffer);
        when(offerRepository.findByOfferType(OfferType.SOLO)).thenReturn(soloOffers);

        List<Offer> result = offerService.getOffersByType(OfferType.SOLO);

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals(OfferType.SOLO, result.get(0).getOfferType());
        verify(offerRepository, times(1)).findByOfferType(OfferType.SOLO);
    }

    @Test
    void testGetOffersByType_NonExistent() {
        when(offerRepository.findByOfferType(any(OfferType.class))).thenReturn(Arrays.asList());

        List<Offer> result = offerService.getOffersByType(OfferType.DUO);

        assertTrue(result.isEmpty());
        verify(offerRepository, times(1)).findByOfferType(OfferType.DUO);
    }

    @Test
    void testUpdateOffer_Success() {
        when(offerRepository.findById(1L)).thenReturn(Optional.of(sampleOffer));
        when(offerRepository.save(any(Offer.class))).thenReturn(sampleOffer);

        sampleOffer.setPrice(150.00);
        sampleOffer.setCapacity(1500);

        Offer updatedOffer = offerService.updateOffer(1L, sampleOffer);

        assertNotNull(updatedOffer);
        assertEquals(150.00, updatedOffer.getPrice());
        assertEquals(1500, updatedOffer.getCapacity());
        verify(offerRepository, times(1)).findById(1L);
        verify(offerRepository, times(1)).save(any(Offer.class));
    }

    @Test
    void testUpdateOffer_NonExistent() {
        when(offerRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> offerService.updateOffer(1L, sampleOffer));
        verify(offerRepository, times(1)).findById(1L);
        verify(offerRepository, never()).save(any(Offer.class));
    }

    @Test
    void testDeleteOffer_Success() {
        when(offerRepository.existsById(1L)).thenReturn(true);
        doNothing().when(offerRepository).deleteById(1L);

        offerService.deleteOffer(1L);

        verify(offerRepository, times(1)).existsById(1L);
        verify(offerRepository, times(1)).deleteById(1L);
    }

    @Test
    void testCreateOffer_NullOffer() {
        assertThrows(IllegalArgumentException.class, () -> offerService.createOffer(null));
    }

    @Test
    void testCreateOffer_InvalidPrice() {
        Offer offer = new Offer();
        offer.setPrice(-100.0);
        assertThrows(IllegalArgumentException.class, () -> offerService.createOffer(offer));
    }

}