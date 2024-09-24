document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const offreId = urlParams.get('id');
    
    if (offreId) {
        loadOffreDetails(offreId);
    } else {
        document.getElementById('offre-details').innerHTML = '<p class="text-center">Offre non trouvée.</p>';
    }
});

function loadOffreDetails(offreId) {
    const offres = {
        'solo': {
            title: 'Offre solo',
            description: 'Billet pour une personne',
            image: 'img/solo.png',
            price: '50€',
            details: 'Accès à un événement olympique au choix parmi une sélection.'
        },
        'duo': {
            title: 'Offre duo',
            description: 'Billet pour deux personnes',
            image: 'img/duo.png',
            price: '90€',
            details: 'Accès pour deux personnes à un événement olympique au choix parmi une sélection.'
        },
        'famille': {
            title: 'Offre famille',
            description: 'Billet pour deux adultes et deux enfants',
            image: 'img/famille.PNG',
            price: '160€',
            details: 'Accès pour deux adultes et deux enfants à un événement olympique au choix parmi une sélection familiale.'
        }
    };

    const offre = offres[offreId];

    if (offre) {
        const offreDetailsHtml = `
            <div class="col-md-6">
                <img src="${offre.image}" alt="${offre.title}" class="img-fluid rounded">
            </div>
            <div class="col-md-6">
                <h1>${offre.title}</h1>
                <p class="lead">${offre.description}</p>
                <p class="fs-3 text-primary">${offre.price}</p>
                <p>${offre.details}</p>
                <button class="btn btn-primary btn-lg">Réserver maintenant</button>
            </div>
        `;
        document.getElementById('offre-details').innerHTML = offreDetailsHtml;
    } else {
        document.getElementById('offre-details').innerHTML = '<p class="text-center">Offre non trouvée.</p>';
    }
}