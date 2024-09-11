class AuthManager {
    constructor() {
        this.authLink = document.getElementById('auth-link');
    }

    // Fonction pour lire un cookie par son nom
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null; // Si le cookie n'existe pas
    }

    // Fonction pour vérifier si l'utilisateur est connecté
    isUserLoggedIn() {
        const userName = this.getCookie('userName'); // Suppose que 'userName' est stocké dans un cookie
        return userName !== null;
    }

    // Fonction pour récupérer le nom de l'utilisateur s'il est connecté
    getUserName() {
        return this.getCookie('userName'); // Retourne le nom de l'utilisateur à partir du cookie
    }

    // Fonction pour mettre à jour le lien Connexion/Inscription ou Profil
    updateAuthLink() {
        if (this.isUserLoggedIn()) {
            const userName = this.getUserName();
            this.authLink.href = "./profil.html"; // Lien vers la page Profil
            this.authLink.textContent = `Profil (${userName})`; // Afficher le nom de l'utilisateur
        } else {
            this.authLink.href = "./login.html"; // Lien vers la page Connexion/Inscription
            this.authLink.textContent = "Connexion/Inscription";
        }
    }

    // Fonction pour initialiser et mettre à jour l'interface utilisateur
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.updateAuthLink(); // Mettre à jour le lien lors du chargement de la page
        });
    }
}

// Créer une instance de la classe AuthManager et initialiser
const authManager = new AuthManager();
authManager.init();
