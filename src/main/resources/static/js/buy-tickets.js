document.addEventListener('DOMContentLoaded', function() {
    
    if(window.location.hash) {
        const tab = document.querySelector(`button[data-bs-target="${window.location.hash}"]`);
        if(tab) {
            new bootstrap.Tab(tab).show();
        }
    }
    loadOffers();
});

function loadOffers() {
    Promise.all([
        fetchOffersByType('SOLO'),
        fetchOffersByType('DUO'),
        fetchOffersByType('FAMILY')
    ]).then(([soloOffers, duoOffers, familleOffers]) => {
        console.log('Offres SOLO:', soloOffers);
        console.log('Offres DUO:', duoOffers);
        console.log('Offres FAMILLE:', familleOffers);

        displayOffers('soloOffers', soloOffers);
        displayOffers('duoOffers', duoOffers);
        displayOffers('familleOffers', familleOffers);

    }).catch(error => console.error('Erreur lors du chargement des offres:', error));
}

function fetchOffersByType(offerType) {
    return fetch(`/api/ticket-offers/type/${offerType}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        });
}

function displayOffers(containerId, offers) {
    console.log(`Affichage des offres dans ${containerId}:`, offers);
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Conteneur ${containerId} non trouvé`);
        return;
    }
    container.innerHTML = '';

    if (offers.length === 0) {
        container.innerHTML = '<p>Aucune offre disponible pour cette catégorie.</p>';
        return;
    }

    offers.forEach(offer => {
        const offerElement = document.createElement('div');
        offerElement.className = 'col-md-4 mb-4';
        offerElement.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${offer.name}</h5>
                    <p class="card-text">${offer.description}</p>
                    <p class="card-text">Prix: ${offer.price} €</p>
                    <button class="btn btn-primary add-to-cart" data-offer-id="${offer.id}">Ajouter au panier</button>
                </div>
            </div>
        `;
        container.appendChild(offerElement);
    });

    // Ajouter des écouteurs d'événements pour les boutons "Ajouter au panier"
    container.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const offerId = this.getAttribute('data-offer-id');
            addToCart(offerId);
        });
    });
}
