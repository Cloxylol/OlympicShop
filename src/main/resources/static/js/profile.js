document.addEventListener('DOMContentLoaded', function() {
    const userProfileDiv = document.getElementById('user-profile');
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        userProfileDiv.innerHTML = `
            <p><strong>Nom d'utilisateur:</strong> ${user.username}</p>
            <p><strong>Nom:</strong> ${user.lastName}</p>
            <p><strong>Prénom:</strong> ${user.firstName}</p>
        `;
    } else {
        userProfileDiv.innerHTML = '<p>Veuillez vous connecter pour voir votre profil.</p>';
    }

    // Assurez-vous que la fonction updateAuthUI est appelée ici aussi
    if (typeof updateAuthUI === 'function') {
        updateAuthUI();
    }
});