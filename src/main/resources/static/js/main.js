import { initAuth } from './auth.js';
import { loadOffers } from './offers.js';
import { initBooking } from './booking.js';

document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    initAuth();
    loadOffers();
    initBooking();
});