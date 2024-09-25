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

function processMockPayment() {
    const paymentButton = document.getElementById('confirmPayment');
    paymentButton.disabled = true;
    paymentButton.innerHTML = 'Traitement en cours...';

    setTimeout(() => {
        // Simuler un paiement réussi
        createBooking()
            .then(bookings => {
                const bookingIds = bookings.map(b => b.id).join(',');
                clearCart();
                window.location.href = `confirmation.html?bookings=${bookingIds}`;
            })
            .catch(error => {
                console.error('Erreur lors de la création de la réservation:', error);
                alert('Le paiement a réussi, mais une erreur est survenue lors de la création de la réservation. Veuillez contacter le support.');
            });
    }, 2000);
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

    return getCart()
        .then(cart => {
            const bookingData = {
                userId: userInfo.id,
                items: cart.items.map(item => ({
                    offerId: item.offer.id,
                    quantity: item.quantity
                }))
            };

            return fetch('/api/bookings/create-multiple', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userInfo.id)
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la création de la réservation');
            }
            return response.json();
        });
}

function clearCart() {
    const userInfo = getUserInfo();
    if (!userInfo) {
        alert('Erreur lors de la suppression du panier. Veuillez vous reconnecter.');
        return;
    }

    fetch('/api/cart/clear', {
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
        console.log('Panier vidé avec succès');
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression du panier. Veuillez réessayer.');
    });
}