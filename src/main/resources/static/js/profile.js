document.addEventListener('DOMContentLoaded', function() {
    loadUserProfile();
    loadUserBookings();
    document.getElementById('edit-profile-btn').addEventListener('click', handleEditProfile);
});

function loadUserProfile() {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo) {
        document.getElementById('user-lastname').value = userInfo.lastName || '';
        document.getElementById('user-firstname').value = userInfo.firstName || '';
        document.getElementById('user-email').value = userInfo.username || '';
    } else {
        console.error('Aucune information utilisateur trouvée');
        document.getElementById('user-info').innerHTML = '<p>Impossible de charger les informations du profil. Veuillez vous reconnecter.</p>';
    }
}

function loadUserBookings() {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!userInfo || !token) {
        console.error('Aucune information utilisateur ou token trouvé');
        return;
    }

    fetch(`/api/bookings/user/${userInfo.id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Non autorisé. Veuillez vous reconnecter.');
            }
            throw new Error('Erreur lors de la récupération des réservations');
        }
        return response.json();
    })
    .then(bookings => {
        displayBookings(bookings);
    })
    .catch(error => {
        console.error('Erreur:', error);
        document.getElementById('user-bookings').innerHTML = `<p>${error.message}</p>`;
        if (error.message.includes('reconnecter')) {
            window.location.href = '/auth.html';
        }
    });
}

function displayBookings(bookings) {
    const bookingsContainer = document.getElementById('user-bookings');
    if (!Array.isArray(bookings)) {
        console.error('Les réservations ne sont pas un tableau:', bookings);
        bookingsContainer.innerHTML = '<p>Erreur lors du chargement des réservations.</p>';
        return;
    }

    if (bookings.length === 0) {
        bookingsContainer.innerHTML = '<p>Vous n\'avez pas encore de réservations.</p>';
        return;
    }

    let bookingsHTML = '';
    bookings.forEach(booking => {
        if (!booking || !booking.ticketOffer) {
            console.error('Réservation invalide:', booking);
            return;
        }

        bookingsHTML += `
        <div class="col-12 mb-4">
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h5 class="card-title mb-0">${booking.ticketOffer.name}</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
                            <p><strong>Billets:</strong> ${booking.numberOfTickets}</p>
                        </div>
                        <div class="col-md-6 text-center">
                            ${createQRCodeImage(booking.qrCode)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    });
    bookingsHTML += '</div>';

    bookingsContainer.innerHTML = bookingsHTML;
}

function createQRCodeImage(qrCodeData) {
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
            <div class="qr-code-card">
                <img src="data:image/png;base64,${base64String}" 
                    alt="QR Code" 
                    class="img-fluid"
                    style="max-width: 150px;">
                <p class="mt-2 text-muted small">Scannez ce QR code à l'entrée</p>
            </div>
        `;
    } catch (error) {
        console.error('Erreur lors de la création du QR code:', error);
        return '<div class="alert alert-warning">Erreur lors de la génération du QR code</div>';
    }
}

function handleEditProfile() {
    alert('Modification du profil impossible pour l\'instant');
}