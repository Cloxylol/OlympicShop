document.addEventListener('DOMContentLoaded', function () {
    // Charger le contenu du panier au chargement de la page
    getCart();
    
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function () {
            const offerId = this.getAttribute('data-offer-id');
            addToCart(offerId);
        });
    });
});

function getUserInfo() {
    const userString = localStorage.getItem('user');
    if (!userString) {
        console.error('Aucune information utilisateur trouvée.');
        return null;
    }
    const user = JSON.parse(userString);
    console.log('User info from localStorage:', user); // Pour déboguer
    return user;
}

function addToCart(offerId, quantity = 1) {
    console.log(`Tentative d'ajout au panier : offerId=${offerId}, quantity=${quantity}`);

    const userInfo = getUserInfo();
    if (!userInfo) {
        alert('Veuillez vous connecter pour modifier votre panier.');
        return;
    }

    fetch(`/api/cart/add?offerId=${offerId}&quantity=${quantity}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo.id)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout au panier');
            }
            return response.json();
        })
        .then(updatedCart => {
            console.log('Article ajouté au panier:', updatedCart);
            updateCartDisplay();
            alert('Article ajouté au panier avec succès !');
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'ajout au panier. Veuillez réessayer.');
        });
}

function removeFromCart(offerId) {
    const userInfo = getUserInfo();
    if (!userInfo) {
        alert('Veuillez vous connecter pour modifier votre panier.');
        return;
    }

    fetch(`/api/cart/remove?offerId=${offerId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo.id)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la suppression de l\'article du panier');
            }
            return response.json();
        })
        .then(updatedCart => {
            console.log('Article retiré du panier:', updatedCart);
            updateCartDisplay(updatedCart);
            alert('Article retiré du panier avec succès !');
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur lors de la suppression de l\'article du panier. Veuillez réessayer.');
        });
}

function updateQuantity(offerId, quantity) {
    const userInfo = getUserInfo();
    if (!userInfo) {
        alert('Veuillez vous connecter pour modifier votre panier.');
        return;
    }

    fetch(`/api/cart/update?offerId=${offerId}&quantity=${quantity}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo.id)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour de la quantité');
            }
            return response.json();
        })
        .then(updatedCart => {
            console.log('Quantité mise à jour:', updatedCart);
            updateCartDisplay(updatedCart);
            alert('Quantité mise à jour avec succès !');
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur lors de la mise à jour de la quantité. Veuillez réessayer.');
        });
}

function getCart() {
    const userInfo = getUserInfo();
    if (!userInfo) {
        return Promise.resolve({ items: [] });
    }

    const url = new URL('/api/cart', window.location.origin);
    url.searchParams.append('userId', userInfo.id);

    return fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération du panier');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur lors de la récupération du panier. Veuillez réessayer.');
            return { items: [] };
        });
}

function updateCartItemQuantity(offerId, newQuantity) {
    const userInfo = getUserInfo();

    if (!userInfo) {
        alert('Veuillez vous connecter pour modifier votre panier.');
        return;
    }

    if (newQuantity <= 0) {
        removeFromCart(offerId);
        return;
    }

    fetch(`/api/cart/update?offerId=${offerId}&quantity=${newQuantity}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo.id)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour de la quantité');
            }
            return response.json();
        })
        .then(updatedCart => {
            console.log('Quantité mise à jour:', updatedCart);
            displayCartContents();
            updateCartDisplay();
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur lors de la mise à jour de la quantité. Veuillez réessayer.');
        });
}

function updateCartDisplay() {
    const cartBadge = document.querySelector('#cartIcon');
    if (!cartBadge) return;

    getCart()
        .then(cart => {
            const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
            cartBadge.textContent = itemCount.toString();
        })
        .catch(error => {
            console.error('Erreur lors de la mise à jour de l\'affichage du panier:', error);
            cartBadge.textContent = '?';
        });
}