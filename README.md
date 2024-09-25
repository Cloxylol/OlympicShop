# Site de vente de eBillets pour les Jeux Olympiques

COMPTE ADMINISTRATEUR POUR ACCEDER AU PANEL DE GESTION DES OFFRES : 
- login : admin@admin.com
- password : olympic


## Description du Projet
Ce projet est un système de billetterie numérique développé pour les Jeux Olympiques de 2024 en France. Il vise à remplacer les billets physiques par des e-billets sécurisés afin de prévenir la fraude et d'améliorer l'expérience utilisateur.

## Fonctionnalités
- Inscription et authentification des utilisateurs
- Navigation et achat de billets
- Génération sécurisée d'e-billets
- Panneau d'administration pour la gestion des offres
- Fonctionnalité de panier d'achat

## Technologies Utilisées
- Backend : Java avec Spring Boot
- Frontend : HTML & CSS avec BootStrap, JavaScript
- Base de données : PostgreSQL
- Sécurité : JWT pour l'authentification

## Structure du Projet
- `src/main/java/com/olympicshop/` : Fichiers source Java
  - `controller/` : Contrôleurs API REST
  - `model/` : Classes entités
  - `config/` : Configuration de l'application
  - `repository/` : Couche d'accès aux données
  - `service/` : Logique métier
  - `security/` : Configurations de sécurité et utilitaires JWT
- `src/main/resources/` : Fichiers de configuration et ressources statiques
- `src/main/resources/static/` : Fichiers frontend (HTML, CSS, JS)

## Points d'Accès API
- `/api/users/register` : Inscription des utilisateurs
- `/api/users/login` : Connexion des utilisateurs
- `/api/ticket-offers/` : Gestion des offres proposées sur le site
- `/api/cart/` : Opérations sur le panier d'achat
- `/api/bookings/` : Gestions de la vente et des réservations 

## Sécurité
- Authentification basée sur JWT
- Chiffrement des mots de passe avec BCrypt
- Protection CSRF
- Génération sécurisée de clés pour les e-billets

## Améliorations Futures
- Implémenter la génération de QR codes pour les e-billets
- Ajouter une confirmation par email pour les inscriptions
- Améliorer le tableau de bord administrateur avec des analyses

## Contributeurs
Cloé PETETIN 

