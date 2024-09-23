document.addEventListener('DOMContentLoaded',  updateAuthUI(), function() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Ici, vous feriez normalement un appel à votre API pour envoyer le message
        console.log('Formulaire soumis avec les données suivantes :', { name, email, subject, message });
        
        // Réinitialiser le formulaire et afficher un message de confirmation
        contactForm.reset();
        alert('Merci pour votre message. Nous vous contacterons bientôt !');
    });
});
