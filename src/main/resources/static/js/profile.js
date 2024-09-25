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
        document.getElementById('user-username').value = userInfo.email || '';
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
    if (bookings.length === 0) {
        bookingsContainer.innerHTML = '<p>Vous n\'avez pas encore de réservations.</p>';
        return;
    }

    let bookingsHTML = '<ul class="list-group">';
    bookings.forEach(booking => {
        bookingsHTML += `
            <li class="list-group-item">
                <h5>${booking.ticketOffer.name}</h5>
                <p>Date de réservation: ${new Date(booking.bookingDate).toLocaleDateString()}</p>
                <p>Nombre de billets: ${booking.numberOfTickets}</p>
                <p>Code de réservation: ${booking.bookingCode}</p>
            </li>
        `;
    });
    bookingsHTML += '</ul>';

    bookingsContainer.innerHTML = bookingsHTML;
}

function handleEditProfile() {
    alert('Modification du profil impossible pour l\'instant');
}