// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingIds = urlParams.get('bookings')?.split(',') || [];

    if (!bookingIds.length) {
        document.getElementById('confirmationDetails').innerHTML = `
            <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle"></i>
                Aucune réservation à afficher
            </div>`;
        return;
    }

    BookingManager.displayBookings(bookingIds);
});

// Configuration
const API_CONFIG = {
    baseUrl: '/api/bookings',
    headers: () => ({
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
    })
};

// Fonction globale pour le téléchargement (nécessaire car appelée depuis le HTML)
function downloadTicket(booking) {
    alert('La fonctionnalité de téléchargement sera bientôt disponible');
}

// Gestionnaire des réservations
const BookingManager = {
    async fetchBookingDetails(bookingId) {
        try {
            const response = await fetch(
                `${API_CONFIG.baseUrl}/${bookingId}`, 
                { headers: API_CONFIG.headers() }
            );

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des détails de la réservation');
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur:', error);
            return null;
        }
    },

    createQRCodeImage(qrCodeData) {
        if (!qrCodeData) {
            return '<div class="alert alert-warning">QR Code non disponible</div>';
        }
        
        try {
            let base64String;
            if (Array.isArray(qrCodeData)) {
                base64String = btoa(String.fromCharCode.apply(null, qrCodeData));
            } else if (typeof qrCodeData === 'string') {
                base64String = qrCodeData;
            } else {
                console.error('Format de QR code non supporté:', qrCodeData);
                return '<div class="alert alert-warning">Format de QR code non supporté</div>';
            }

            return `
                <div class="card qr-code-card">
                    <div class="card-body text-center">
                        <img src="data:image/png;base64,${base64String}" 
                            alt="QR Code" 
                            class="img-fluid"
                            style="max-width: 250px;">
                        <p class="mt-2 text-muted">Présentez ce QR code à l'entrée de l'événement</p>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Erreur lors de la création du QR code:', error);
            return '<div class="alert alert-warning">Erreur lors de la génération du QR code</div>';
        }
    },


    createBookingCard(booking) {
        return `
            <div class="card mb-4 booking-card">
                <div class="card-header bg-primary text-white">
                    <h5 class="card-title mb-0">
                        Réservation #${booking.bookingCode}
                    </h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h5 class="text-primary">${booking.ticketOffer.name}</h5>
                            <ul class="list-unstyled">
                                <li><strong>Nombre de billets:</strong> ${booking.numberOfTickets}</li>
                                <li><strong>Date de réservation:</strong> ${new Date(booking.bookingDate).toLocaleString()}</li>
                                <li><strong>Prix total:</strong> ${(booking.ticketOffer.price * booking.numberOfTickets).toFixed(2)}€</li>
                            </ul>
                            
                            <div class="mt-3">
                                <button onclick="downloadTicket(${JSON.stringify(booking)})" 
                                        class="btn btn-outline-primary">
                                    <i class="bi bi-download"></i> Télécharger
                                </button>
                            </div>
                        </div>
                        <div class="col-md-6 text-center">
                            ${this.createQRCodeImage(booking.qrCode)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    async displayBookings(bookingIds) {
        try {
            const bookings = await Promise.all(
                bookingIds.map(id => this.fetchBookingDetails(id))
            );

            let html = `
                <div class="confirmation-header text-center mb-4">
                    <h2>Confirmation de vos réservations</h2>
                    <p class="text-success">
                        <i class="bi bi-check-circle-fill"></i> 
                        Vos billets ont été réservés avec succès
                    </p>
                </div>`;
            
            bookings.forEach(booking => {
                if (booking) {
                    html += this.createBookingCard(booking);
                }
            });

            html += `
                <div class="text-center mt-4">
                    <a href="index.html" class="btn btn-primary me-2">
                        <i class="bi bi-house-door"></i> Retour à l'accueil
                    </a>
                    <a href="profile.html" class="btn btn-outline-primary">
                        <i class="bi bi-person"></i> Voir votre profil
                    </a>
                </div>
            `;

            document.getElementById('confirmationDetails').innerHTML = html;

        } catch (error) {
            document.getElementById('confirmationDetails').innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i>
                    Une erreur est survenue lors du chargement des réservations: ${error.message}
                </div>
            `;
        }
    }
};

