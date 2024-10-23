const API_URL = '/api/users';
const SESSION_URL = '/api/session';

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutButton = document.getElementById('logout-button');
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');

export async function initAuth() {
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    setupTabs();
    await updateAuthUI();
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: email, password: password }),
        });

        if (!response.ok) {
            throw new Error('Échec de la connexion');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        showAlert('Connexion réussie!', 'success');
        await updateAuthUI();
        window.location.href = 'index.html';
    } catch (error) {
        showAlert(error.message, 'danger');
    }
}

function isValidPassword(password) {
    // Au moins 8 caractères, au moins 1 chiffre et 1 lettre
    const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=\S+$).{8,}$/;
    return regex.test(password);
}

async function handleRegister(event) {
    event.preventDefault();
    const firstName = document.getElementById('register-firstname').value;
    const lastName = document.getElementById('register-lastname').value;
    const email = document.getElementById('register-email').value;
    const passwordInput = document.getElementById('register-password');
    const confirmPasswordInput = document.getElementById('register-confirm-password');
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const registerForm = document.getElementById('register-form');



    if (password !== confirmPassword) {
        showAlert("Les mots de passe ne correspondent pas.", 'danger');
        passwordInput.value = '';
        confirmPasswordInput.value = '';
        return;
    }

    if (!isValidPassword(password)) {
        showAlert("Le mot de passe doit contenir au moins 8 caractères et au moins un chiffre.", 'danger');
        passwordInput.value = '';
        confirmPasswordInput.value = '';
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

async function updateAuthUI() {
    const authSection = document.getElementById('auth-section');
    const userSection = document.getElementById('user-section');
    const adminPanel = document.getElementById('admin-panel');

    const isAuth = await isAuthenticated();
    
    if (!isAuth) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

    if (isAuth && user) {
        if (authSection) authSection.style.display = 'none';
        if (userSection) {
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
        }

        if (adminPanel) {
            adminPanel.style.display = user.roles?.includes('ROLE_ADMIN') ? 'inline-block' : 'none';
        }
    } else {
        if (authSection) authSection.style.display = 'block';
        if (userSection) userSection.style.display = 'none';
        if (adminPanel) adminPanel.style.display = 'none';
    }
}

function setupTabs() {
    if (loginTab && registerTab) {
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
    button.addEventListener('click', function () {
        togglePasswordVisibility(this);
    });
});

async function isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }

    try {
        const response = await fetch(`${SESSION_URL}/validate`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.ok;
    } catch (error) {
        console.error('Erreur de vérification d\'authentification:', error);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initAuth().catch(console.error);
});