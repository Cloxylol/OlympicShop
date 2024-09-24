document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookingIds = urlParams.get('bookings').split(',');

    const confirmationDetails = document.getElementById('confirmationDetails');

    function fetchBookingDetails(bookingId) {
        return fetch(`/api/bookings/${bookingId}`)
            .then(response => response.json())
            .catch(error => {
                console.error('Erreur lors de la récupération des détails de la réservation:', error);
                return null;
            });
    }

    Promise.all(bookingIds.map(fetchBookingDetails))
        .then(bookings => {
            let html = '<h2>Détails de vos réservations :</h2>';
            bookings.forEach(booking => {
                if (booking) {
                    html += `
                        <div class="card mb-3">
                            <div class="card-body">
                                <h5 class="card-title">Réservation #${booking.bookingCode}</h5>
                                <p class="card-text">Offre : ${booking.ticketOffer.name}</p>
                                <p class="card-text">Nombre de billets : ${booking.numberOfTickets}</p>
                                <p class="card-text">Date de réservation : ${new Date(booking.bookingDate).toLocaleString()}</p>
                            </div>
                        </div>
                    `;
                }
            });
            confirmationDetails.innerHTML = html;
        });
});