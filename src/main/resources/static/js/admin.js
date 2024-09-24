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
                        <td>${offer.id}</td>
                        <td>${offer.name}</td>
                        <td>${offer.price}</td>
                        <td>${offer.capacity}</td>
                        <td>${offer.offerType}</td>
                        <td>
                            <button class="btn btn-sm btn-primary edit-offer" data-id="${offer.id}">Modifier</button>
                            <button class="btn btn-sm btn-danger delete-offer" data-id="${offer.id}">Supprimer</button>
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