document.addEventListener('DOMContentLoaded', function() {
    displayCartContents();
    
    const confirmPaymentButton = document.getElementById('confirmPayment');
    if (confirmPaymentButton) {
        confirmPaymentButton.addEventListener('click', processMockPayment);
    }
});

function displayCartContents() {
    const cartContainer = document.getElementById('cartItems');
    const totalContainer = document.getElementById('cartTotal');
    
    getCart()
    .then(cart => {
        if (cart.items.length === 0) {
            cartContainer.innerHTML = '<p>Votre panier est vide.</p>';
            totalContainer.innerHTML = '';
            return;
        }

        let cartHtml = '<ul class="list-group">';
        let total = 0;

        cart.items.forEach(item => {
            const itemTotal = item.quantity * item.offer.price;
            total += itemTotal;

            cartHtml += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${item.offer.name} - ${item.offer.price}€
                    <div>
                        <button class="btn btn-sm btn-secondary me-2" onclick="updateCartItemQuantity(${item.offer.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="btn btn-sm btn-secondary ms-2" onclick="updateCartItemQuantity(${item.offer.id}, ${item.quantity + 1})">+</button>
                        <button class="btn btn-sm btn-danger ms-3" onclick="removeFromCart(${item.offer.id})">Supprimer</button>
                    </div>
                </li>
            `;
        });

        cartHtml += '</ul>';
        cartContainer.innerHTML = cartHtml;

        totalContainer.innerHTML = `
            <h4 class="mt-3">Total: ${total.toFixed(2)}€</h4>
            <button class="btn btn-primary mt-2" id="openPaymentModalBtn">Procéder au paiement</button>
        `;

        // Ajouter l'écouteur d'événement pour le bouton de paiement
        const openPaymentModalBtn = document.getElementById('openPaymentModalBtn');
        if (openPaymentModalBtn) {
            openPaymentModalBtn.addEventListener('click', openPaymentModal);
        }
    });
}

function openPaymentModal() {
    const modal = new bootstrap.Modal(document.getElementById('paymentModal'));
    modal.show();
}

let isProcessing = false;

function processMockPayment() {
    console.log('processMockPayment appelé, isProcessing:', isProcessing);
    
    if (isProcessing) {
        console.log('Déjà en cours de traitement, sortie');
        return;
    }
    
    isProcessing = true;
    const paymentButton = document.getElementById('confirmPayment');
    paymentButton.disabled = true;
    paymentButton.innerHTML = 'Traitement en cours...';

    console.log('Début de createBooking');
    createBooking()
        .then(bookings => {
            console.log('Bookings créées:', bookings);
            return clearCartAndRedirect(bookings);
        })
        .catch(error => {
            console.error('Erreur détaillée:', error);
            paymentButton.disabled = false;
            paymentButton.innerHTML = 'Confirmer le paiement';
            alert('Une erreur est survenue. Veuillez réessayer.');
        })
        .finally(() => {
            console.log('Fin du processus, reset isProcessing');
            isProcessing = false;
        });
}


function createBooking() {
    const userInfo = getUserInfo();
    if (!userInfo) {
        return Promise.reject(new Error('Utilisateur non connecté'));
    }
    const token = localStorage.getItem('token');
    if (!token) {
        return Promise.reject(new Error('Token d\'authentification non trouvé'));
    }

    return fetch('/api/bookings/create-multiple', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userInfo.id)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la création de la réservation');
        }
        return response.json();
    });
}


function clearCartAndRedirect(bookings) {
    const userInfo = getUserInfo();
    if (!userInfo) {
        throw new Error('Utilisateur non connecté');
    }

    return fetch('/api/cart/clear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo.id)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du panier');
        }
        const bookingIds = bookings.map(b => b.id).join(',');
        window.location.href = `confirmation.html?bookings=${bookingIds}`;
    });
}