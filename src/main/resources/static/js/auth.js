const API_URL = '/api/users';

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutButton = document.getElementById('logout-button');
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');

export function initAuth() {


    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    updateAuthUI();
}


async function handleLogin(event) {
    event .preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password: password }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Échec de la connexion');
            }

            return response.json();

        })
        .then(data => {

            showAlert('Connexion réussie!', 'success');
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            updateAuthUI();
            showAlert('Connexion réussie!', 'success');
            window.location.href = 'index.html'; // Redirection vers la page d'accueil

        })
        .catch(error => {
            showAlert(error.message, 'danger');
        });
}

async function handleRegister(event) {
    event .preventDefault();
    const firstName = document.getElementById('register-firstname').value;
    const lastName = document.getElementById('register-lastname').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const registerForm = document.getElementById('register-form');


    if (password !== confirmPassword) {
        showAlert("Les mots de passe ne correspondent pas.", 'danger');
        return;
    }

    fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: email,
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            securityKey: ""
        }),
    })
        .then(response => {
            console.log("Réponse reçue:", response.status); // Log de débogage
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message)
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("Inscription réussie:", data);
            showAlert('Inscription réussie! Vous pouvez maintenant vous connecter.', 'success');
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';

        })
        .catch(error => {
            console.error("Erreur d'inscription:", error);
            showAlert(error.message, 'danger');
        });
}




function togglePasswordVisibility(button) {
        const input = button.previousElementSibling;
        const icon = button.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        }
    }


function showAlert(message, type) {
    console.log("Tentative d'affichage d'alerte:", message, type); // Log de débogage
    let alertContainer = document.getElementById('alert-container');
    if (!alertContainer) {
        console.error("Conteneur d'alerte non trouvé. Création d'un nouveau conteneur.");
        const newAlertContainer = document.createElement('div');
        newAlertContainer.id = 'alert-container';
        newAlertContainer.className = 'position-fixed top-0 start-50 translate-middle-x';
        newAlertContainer.style.zIndex = '1050';
        document.body.prepend(newAlertContainer);
        alertContainer = newAlertContainer;
    }

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertContainer.appendChild(alert);
    alert.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
        alert.remove();
    }, 5000);
}


    function updateAuthUI() {

        if(loginTab && registerTab) {
            loginTab.addEventListener('click', function(e) {
                e.preventDefault();
                loginTab.classList.add('active');
                registerTab.classList.remove('active');
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
            });

            registerTab.addEventListener('click', function(e) {
                e.preventDefault();
                registerTab.classList.add('active');
                loginTab.classList.remove('active');
                registerForm.style.display = 'block';
                loginForm.style.display = 'none';
            });
        }

        const authSection = document.getElementById('auth-section');
        const userSection = document.getElementById('user-section');
        const adminPanel = document.getElementById('admin-panel');

        const user = JSON.parse(localStorage.getItem('user'));

        if (isAuthenticated()) {
            authSection.style.display = 'none';
            userSection.style.display = 'block';
            userSection.innerHTML = `
                <span>Bienvenue, ${user.firstName}</span>
                <a href="profile.html" class="btn btn-primary btn-sm ms-2">Profil</a>
                <button id="logout-button" class="btn btn-secondary btn-sm ms-2">Déconnexion</button>
            `;

            const logoutButton = document.getElementById('logout-button');
            if (logoutButton) {
                logoutButton.addEventListener('click', handleLogout);
            }

            if (user.roles && user.roles.includes('ROLE_ADMIN')) {
                adminPanel.style.display = 'inline-block';
            } else {
                adminPanel.style.display = 'none';
            }

        } else {
            authSection.style.display = 'block';
            userSection.style.display = 'none';
        }


    }

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateAuthUI();
    showAlert('Déconnexion réussie', 'info');
    window.location.href = 'index.html';
}



const toggleButtons = document.querySelectorAll('.toggle-password');
toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
        togglePasswordVisibility(this);
    });
});


export function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

document.addEventListener('DOMContentLoaded', function() {
    initAuth();
    updateAuthUI();
});