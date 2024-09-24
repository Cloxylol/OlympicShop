document.addEventListener('DOMContentLoaded', function() {

    displayCartContents();

    document.getElementById('checkoutBtn').addEventListener('click', function() {
        alert('Fonctionnalité de paiement non implémentée');
    });
    
});

function displayCartContents() {
    const cartContainer = document.getElementById('cartContainer');
    getCart()
        .then(cart => {
            if (cart.items.length === 0) {
                cartContainer.innerHTML = '<p>Votre panier est vide.</p>';
            } else {
                let cartHtml = '<ul class="list-group">';
                cart.items.forEach(item => {
                    cartHtml += `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            ${item.offer.name}
                            <span>
                                <span class="badge bg-primary rounded-pill me-3">${item.offer.price} €</span>
                                <button class="btn btn-sm btn-outline-primary me-2" onclick="updateQuantity(${item.offer.id}, ${item.quantity - 1})">-</button>
                                ${item.quantity}
                                <button class="btn btn-sm btn-outline-primary ms-2" onclick="updateQuantity(${item.offer.id}, ${item.quantity + 1})">+</button>
                                <button class="btn btn-sm btn-outline-danger ms-3" onclick="removeFromCart(${item.offer.id})">Supprimer</button>
                            </span>
                        </li>
                    `;
                });
                cartHtml += '</ul>';
                cartContainer.innerHTML = cartHtml;
            }
        })
        .catch(error => {
            console.error('Erreur lors de l\'affichage du contenu du panier:', error);
            cartContainer.innerHTML = '<p>Une erreur est survenue lors du chargement du panier.</p>';
        });
}