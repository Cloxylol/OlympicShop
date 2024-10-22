document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || !user.roles || !user.roles.includes('ROLE_ADMIN')) {
        window.location.href = 'index.html';
    } else {
        loadAdminContent();
    }
});

function loadAdminContent() {
    loadOffers();
    loadStatistics(); 
    setupEventListeners();
}

function loadOffers() {
    fetch('/api/ticket-offers')
        .then(response => response.json())
        .then(offers => {
            const offersList = document.getElementById('offersList');
            offersList.innerHTML = '';
            offers.forEach(offer => {
                offersList.innerHTML += `
                    <tr>
                        <td>${offer.name}</td>
                        <td>${offer.price}</td>
                        <td>${offer.capacity}</td>
                        <td>${offer.offerType}</td>
                        <td>
                            <button class="btn btn-sm btn-light btn-purple edit-offer" data-id="${offer.id}">Modifier</button>
                            <button class="btn btn-sm btn-light btn-pink delete-offer" data-id="${offer.id}">Supprimer</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Erreur lors du chargement des offres:', error));
}

function setupEventListeners() {
    document.getElementById('addOfferForm').addEventListener('submit', addOffer);
    document.getElementById('offersList').addEventListener('click', handleOfferAction);
    document.getElementById('saveEditOffer').addEventListener('click', saveEditOffer);
}

function addOffer(event) {
    event.preventDefault();
    const offerData = {
        name: document.getElementById('offerName').value,
        price: parseFloat(document.getElementById('offerPrice').value),
        capacity: parseInt(document.getElementById('offerCapacity').value),
        description: document.getElementById('offerDescription').value,
        offerType: document.getElementById('offerType').value
    };

    fetch('/api/ticket-offers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(offerData)
    })
    .then(response => response.json())
    .then(() => {
        loadOffers();
        document.getElementById('addOfferForm').reset();
    })
    .catch(error => console.error('Erreur lors de l\'ajout de l\'offre:', error));
}

function handleOfferAction(event) {
    if (event.target.classList.contains('edit-offer')) {
        editOffer(event.target.dataset.id);
    } else if (event.target.classList.contains('delete-offer')) {
        deleteOffer(event.target.dataset.id);
    }
}

function editOffer(id) {
    fetch(`/api/ticket-offers/${id}`)
    .then(response => response.json())
    .then(offer => {
        document.getElementById('editOfferId').value = offer.id;
        document.getElementById('editOfferName').value = offer.name;
        document.getElementById('editOfferPrice').value = offer.price;
        document.getElementById('editOfferCapacity').value = offer.capacity;
        document.getElementById('editOfferDescription').value = offer.description;
        document.getElementById('editOfferType').value = offer.offerType;

        const editModal = new bootstrap.Modal(document.getElementById('editOfferModal'));
        editModal.show();
    })
    .catch(error => console.error('Erreur lors du chargement des détails de l\'offre:', error));
}

function saveEditOffer() {
    const id = document.getElementById('editOfferId').value;
    const offerData = {
        name: document.getElementById('editOfferName').value,
        price: parseFloat(document.getElementById('editOfferPrice').value),
        capacity: parseInt(document.getElementById('editOfferCapacity').value),
        description: document.getElementById('editOfferDescription').value,
        offerType: document.getElementById('editOfferType').value
    };

    fetch(`/api/ticket-offers/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(offerData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la modification de l\'offre');
        }
        return response.json();
    })
    .then(updatedOffer => {
        console.log('Offre mise à jour avec succès:', updatedOffer);
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editOfferModal'));
        editModal.hide();
        loadOffers();
    })
    .catch(error => {
        console.error('Erreur lors de la modification de l\'offre:', error);
        alert('Erreur lors de la modification de l\'offre. Veuillez réessayer.');
    });
}

function deleteOffer(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
        fetch(`/api/ticket-offers/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(() => loadOffers())
        .catch(error => console.error('Erreur lors de la suppression de l\'offre:', error));
    }
}


function loadStatistics() {
    fetch('/api/bookings/by-offer-type', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(bookingsByType => {
        const statistics = processBookingStatistics(bookingsByType);
        updateBookingStatistics(statistics);
        updateBookingsTable(statistics);
    })
    .catch(error => console.error('Erreur lors du chargement des statistiques:', error));
}

function processBookingStatistics(bookingsByType) {
    let totalBookings = 0;
    const bookingCounts = {};

    for (const [offerType, bookings] of Object.entries(bookingsByType)) {
        bookingCounts[offerType] = bookings.length;
        totalBookings += bookings.length;
    }

    return {
        bookingsByType: bookingCounts,
        totalBookings: totalBookings
    };
}


function updateBookingsTable(statistics) {
    const tableBody = document.querySelector('#bookingsTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    for (const [offerType, count] of Object.entries(statistics.bookingsByType)) {
        const row = tableBody.insertRow();
        const typeCell = row.insertCell(0);
        const countCell = row.insertCell(1);

        typeCell.textContent = offerType;
        countCell.textContent = count;
    }

    // Add total row
    const totalRow = tableBody.insertRow();
    const totalTypeCell = totalRow.insertCell(0);
    const totalCountCell = totalRow.insertCell(1);

    totalTypeCell.textContent = 'TOTAL';
    totalTypeCell.style.fontWeight = 'bold';
    totalCountCell.textContent = statistics.totalBookings;
    totalCountCell.style.fontWeight = 'bold';
}

function updateBookingStatistics(statistics) {
    const bookingsByTypeTable = document.getElementById('bookingsByTypeTable');
    if (!bookingsByTypeTable) {
        console.error("L'élément 'bookingsByTypeTable' n'a pas été trouvé dans le DOM");
        return;
    }

    const bookingsByTypeBody = bookingsByTypeTable.querySelector('tbody');
    if (!bookingsByTypeBody) {
        console.error("L'élément 'tbody' n'a pas été trouvé dans 'bookingsByTypeTable'");
        return;
    }

    bookingsByTypeBody.innerHTML = '';

    const labels = [];
    const data = [];
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']; 

    let i = 0;
    for (const [type, count] of Object.entries(statistics.bookingsByType)) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${type}</td>
            <td>${count}</td>
        `;
        bookingsByTypeBody.appendChild(row);

        labels.push(type);
        data.push(count);
    }

    const chartCanvas = document.getElementById('bookingsChart');
    if (!chartCanvas) {
        console.error("L'élément 'bookingsChart' n'a pas été trouvé dans le DOM");
        return;
    }
    if (window.bookingsChart instanceof Chart) {
        window.bookingsChart.destroy();
    }

    window.bookingsChart = new Chart(chartCanvas, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, data.length),
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Répartition des billets vendus par type d\'offre'
                }
                
            }
        }
    });
}