// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBS1lExe7iwuPhXYlrc9g7nih-FgF9yLRw",
    authDomain: "gameplay-society.firebaseapp.com",
    projectId: "gameplay-society",
    storageBucket: "gameplay-society.firebasestorage.app",
    messagingSenderId: "561975219783",
    appId: "1:561975219783:web:16735b9788db1b3f6fc362"
};

// Initialisation Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Configuration Admin
const ADMIN_EMAIL = "gameplaysociety.ht@gmail.com";
let isAdmin = false;

// Informations de paiement
const paymentInfo = {
    moncash: {
        name: "Marcco Bien Aimé",
        phone: "+50939442808"
    },
    natcash: {
        name: "Jinolyse Pierre Louis", 
        phone: "+50935669814"
    }
};

// État de l'application
let currentUser = null;
let cart = [];
let currentGameModal = null;
let currentFinancialService = null;
let selectedAmount = null;

// Données des jeux mises à jour
const gameProducts = {
    freefire: {
        name: "Free Fire",
        description: "Free Fire est un jeu de survie battle royale passionnant où 50 joueurs s'affrontent pour être le dernier survivant. Rechargez vos diamants pour acheter des skins, des armes et des objets exclusifs.",
        packs: [
            { name: "100 + Bonus 10💎", price: 157, type: "diamonds" },
            { name: "200 + Bonus 20💎", price: 314, type: "diamonds" },
            { name: "300 + Bonus 41💎", price: 495, type: "diamonds" },
            { name: "400 + Bonus 51💎", price: 660, type: "diamonds" },
            { name: "500 + Bonus 72💎", price: 825, type: "diamonds" },
            { name: "600 + Bonus 82💎", price: 990, type: "diamonds" },
            { name: "800 + Bonus 113💎", price: 1320, type: "diamonds" },
            { name: "900 + Bonus 123💎", price: 1500, type: "diamonds" },
            { name: "1000 + Bonus 166💎", price: 1650, type: "diamonds" },
            { name: "1200 + Bonus 186💎", price: 2000, type: "diamonds" },
            { name: "1500 + Bonus 238💎", price: 2500, type: "diamonds" },
            { name: "2000 + Bonus 398💎", price: 3500, type: "diamonds" },
            { name: "3000 + Bonus 564💎", price: 5500, type: "diamonds" },
            { name: "5000 + Bonus 1160💎", price: 8500, type: "diamonds" },
            { name: "10,000 + Bonus 2320💎", price: 18000, type: "diamonds" },
            { name: "15,000 + Bonus 3480💎", price: 27250, type: "diamonds" },
            { name: "20,000 + Bonus 4640💎", price: 35000, type: "diamonds" }
        ],
        subscriptions: [
            { name: "Abo. Semaine", price: 330, type: "subscription" },
            { name: "Abo. Mois", price: 1650, type: "subscription" },
            { name: "Abo. VIP", price: 1980, type: "subscription" },
            { name: "Abo. SUPER VIP", price: 2970, type: "subscription" }
        ],
        passes: [
            { name: "Level up Pass 1355💎", price: 1000, type: "pass" },
            { name: "Booyah pass Par ID", price: 500, type: "pass" }
        ],
        formFields: [
            { type: 'select', name: 'region', label: 'Région', options: ['Amérique du Nord', 'Amérique du Sud', 'Europe', 'États-Unis'], required: true },
            { type: 'text', name: 'playerId', label: 'ID du compte Free Fire', placeholder: 'Entrez votre ID Free Fire', required: true },
            { type: 'text', name: 'accountName', label: 'Nom du compte', placeholder: 'Entrez votre nom de compte', required: true },
            { type: 'tel', name: 'whatsapp', label: 'Numéro de WhatsApp', placeholder: 'Entrez votre numéro WhatsApp', required: true }
        ]
    },
    cod: {
        name: "Call of Duty Mobile",
        description: "Call of Duty Mobile offre une expérience FPS complète sur mobile. Rechargez vos CP (Call of Duty Points) pour débloquer des armes, des skins et des battle passes.",
        packs: [
            { name: "80 CP", price: 180, type: "cp" },
            { name: "420 CP", price: 900, type: "cp" },
            { name: "840 CP", price: 1800, type: "cp" },
            { name: "1400 CP", price: 3000, type: "cp" },
            { name: "2400 CP", price: 4500, type: "cp" },
            { name: "5000 CP", price: 9000, type: "cp" },
            { name: "10,800 CP", price: 18000, type: "cp" }
        ],
        subscriptions: [
            { name: "Weekly Supply Pass", price: 360, type: "subscription" },
            { name: "Monthly Supply Pass", price: 1260, type: "subscription" }
        ],
        passes: [],
        formFields: [
            { type: 'text', name: 'playerId', label: 'ID du compte', placeholder: 'Entrez votre ID Call of Duty', required: true },
            { type: 'text', name: 'username', label: "Nom d'utilisateur", placeholder: "Entrez votre nom d'utilisateur", required: true },
            { type: 'tel', name: 'whatsapp', label: 'Numéro de WhatsApp', placeholder: 'Entrez votre numéro WhatsApp', required: true }
        ]
    },
    dls: {
        name: "DLS 2025",
        description: "Dream League Soccer 2025 est le jeu de football ultime. Achetez des jetons pour recruter des joueurs légendaires et améliorer votre équipe.",
        packs: [
            { name: "900 Jetons", price: 340, type: "tokens" },
            { name: "1750 Jetons", price: 680, type: "tokens" },
            { name: "3000 Jetons", price: 1190, type: "tokens" },
            { name: "5000 Jetons", price: 2040, type: "tokens" },
            { name: "9000 Jetons", price: 3400, type: "tokens" },
            { name: "22000 Jetons", price: 8500, type: "tokens" }
        ],
        subscriptions: [
            { name: "90 Diams💎", price: 340, type: "diamonds" },
            { name: "400 Diams💎", price: 1360, type: "diamonds" },
            { name: "910 Diams💎", price: 2800, type: "diamonds" },
            { name: "2700 Diams💎", price: 8500, type: "diamonds" }
        ],
        passes: [
            { name: "Saison Pass (1-3$)", price: 680, type: "pass" },
            { name: "Saison Pass (+5$)", price: 925, type: "pass" },
            { name: "Saison pass premium", price: 2040, type: "pass" }
        ],
        formFields: [
            { type: 'email', name: 'email', label: 'Email du compte', placeholder: 'Entrez votre email DLS', required: true },
            { type: 'password', name: 'password', label: 'Mot de passe du compte', placeholder: 'Entrez votre mot de passe DLS', required: true },
            { type: 'tel', name: 'whatsapp', label: 'Numéro de WhatsApp', placeholder: 'Entrez votre numéro WhatsApp', required: true }
        ]
    },
    bloodstrike: {
        name: "Blood Strike",
        description: "Blood Strike est un FPS mobile compétitif. Achetez de l'or pour débloquer des armes, des équipements et des personnalisations.",
        packs: [
            { name: "+16 Gold", price: 170, type: "gold" },
            { name: "+32 Gold", price: 340, type: "gold" },
            { name: "+52 Gold", price: 510, type: "gold" },
            { name: "+94 Gold", price: 850, type: "gold" },
            { name: "+210 Gold", price: 1700, type: "gold" },
            { name: "+486 Gold", price: 3400, type: "gold" },
            { name: "+1380 Gold", price: 8500, type: "gold" }
        ],
        subscriptions: [],
        passes: [],
        formFields: [
            { type: 'text', name: 'playerId', label: 'ID du compte Blood Strike', placeholder: 'Entrez votre ID Blood Strike', required: true },
            { type: 'tel', name: 'whatsapp', label: 'Numéro de WhatsApp', placeholder: 'Entrez votre numéro WhatsApp', required: true }
        ]
    }
};

const financialServices = {
    wise: {
        name: "Wise",
        description: "Wise (anciennement TransferWise) est un service de transfert d'argent international qui offre des taux de change transparents et des frais réduits. Rechargez votre compte Wise en toute sécurité.",
        amounts: [
            { usd: 10, htg: 1500 },
            { usd: 20, htg: 3000 },
            { usd: 30, htg: 4400 },
            { usd: 40, htg: 5900 },
            { usd: 50, htg: 7350 },
            { usd: 60, htg: 8800 },
            { usd: 70, htg: 11260 },
            { usd: 80, htg: 11800 },
            { usd: 90, htg: 13150 },
            { usd: 100, htg: 15000 }
        ],
        formFields: [
            { type: 'email', name: 'email', label: 'Email du compte Wise', placeholder: 'Entrez votre email Wise', required: true },
            { type: 'tel', name: 'whatsapp', label: 'Numéro de WhatsApp', placeholder: 'Entrez votre numéro WhatsApp', required: true }
        ]
    },
    paypal: {
        name: "PayPal",
        description: "PayPal est une plateforme de paiement en ligne sécurisée. Rechargez votre compte PayPal pour effectuer des achats en ligne et des transferts d'argent internationaux.",
        amounts: [
            { usd: 10, htg: 1500 },
            { usd: 20, htg: 3000 },
            { usd: 30, htg: 4400 },
            { usd: 40, htg: 5900 },
            { usd: 50, htg: 7350 },
            { usd: 60, htg: 8800 },
            { usd: 70, htg: 11260 },
            { usd: 80, htg: 11800 },
            { usd: 90, htg: 13150 },
            { usd: 100, htg: 15000 }
        ],
        formFields: [
            { type: 'email', name: 'email', label: 'Email PayPal', placeholder: 'Entrez votre email PayPal', required: true },
            { type: 'tel', name: 'whatsapp', label: 'Numéro de WhatsApp', placeholder: 'Entrez votre numéro WhatsApp', required: true }
        ]
    },
    usdt: {
        name: "USDT (Tether)",
        description: "USDT est une crypto-monnaie stable indexée sur le dollar américain. Achetez des USDT pour vos investissements crypto et transactions décentralisées.",
        amounts: [
            { usd: 10, htg: 1500 },
            { usd: 20, htg: 3000 },
            { usd: 30, htg: 4400 },
            { usd: 40, htg: 5900 },
            { usd: 50, htg: 7350 },
            { usd: 60, htg: 8800 },
            { usd: 70, htg: 11260 },
            { usd: 80, htg: 11800 },
            { usd: 90, htg: 13150 },
            { usd: 100, htg: 15000 }
        ],
        formFields: [
            { type: 'text', name: 'wallet', label: 'Adresse du wallet', placeholder: 'Entrez votre adresse USDT', required: true },
            { type: 'tel', name: 'whatsapp', label: 'Numéro de WhatsApp', placeholder: 'Entrez votre numéro WhatsApp', required: true }
        ]
    }
};

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    setupEventListeners();
    checkAuthState();
    loadTheme();
    initImagePlaceholders();
});

function initApp() {
    const savedCart = localStorage.getItem('gameplay_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

function setupEventListeners() {
    // Navigation
    document.getElementById('login-btn').addEventListener('click', showLoginPage);
    document.getElementById('hero-login-btn').addEventListener('click', showLoginPage);
    document.getElementById('hero-register-btn').addEventListener('click', showRegisterPage);
    document.getElementById('go-to-register').addEventListener('click', showRegisterPage);
    document.getElementById('go-to-login').addEventListener('click', showLoginPage);
    document.getElementById('back-to-home').addEventListener('click', showHomePage);
    document.getElementById('back-to-home-register').addEventListener('click', showHomePage);

    // Authentification
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);

    // Navigation principale
    document.querySelectorAll('.nav-item').forEach(item => {
        if (!item.classList.contains('logout')) {
            item.addEventListener('click', handleNavigation);
        }
    });

    // Bouton de retour au dashboard
    document.getElementById('back-to-dashboard').addEventListener('click', function() {
        showPage('dashboard');
    });

    // Déconnexion
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // Menu mobile
    document.getElementById('menu-toggle').addEventListener('click', toggleSidebar);

    // Services
    document.querySelectorAll('.btn-service').forEach(btn => {
        btn.addEventListener('click', function() {
            const service = this.closest('.service-card-main').dataset.service;
            showPage(service);
        });
    });

    // Jeux - Voir produits
    document.querySelectorAll('.view-products').forEach(btn => {
        btn.addEventListener('click', function() {
            const game = this.dataset.game;
            showGameProducts(game);
        });
    });

    // Jeux - Ajouter au panier direct
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const product = this.dataset.product;
            const price = parseInt(this.dataset.price);
            const game = this.dataset.game;
            addToCartDirect(game, product, price);
        });
    });

    // Services financiers
    document.querySelectorAll('.view-financial').forEach(btn => {
        btn.addEventListener('click', function() {
            const service = this.dataset.service;
            showFinancialService(service);
        });
    });

    // Portefeuille
    document.getElementById('deposit-btn').addEventListener('click', showDepositModal);
    document.getElementById('withdraw-btn').addEventListener('click', showWithdrawModal);
    document.querySelector('.btn-refresh').addEventListener('click', refreshWallet);

    // Paiements - CORRECTION: Ajout des écouteurs manquants
    document.querySelectorAll('input[name="deposit-method"]').forEach(radio => {
        radio.addEventListener('change', updateDepositDetails);
    });

    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', updatePaymentDetails);
    });

    // Formulaires
    document.getElementById('deposit-form').addEventListener('submit', handleDeposit);
    document.getElementById('withdraw-form').addEventListener('submit', handleWithdraw);

    // Panier
    document.getElementById('cart-button').addEventListener('click', toggleCart);
    document.querySelector('.close-cart').addEventListener('click', toggleCart);
    document.getElementById('checkout-btn').addEventListener('click', showPaymentModal);

    // Paiement
    document.getElementById('payment-form').addEventListener('submit', handlePayment);

    // Confirmation
    document.getElementById('view-orders-btn').addEventListener('click', function() {
        closeAllModals();
        showPage('orders');
    });

    document.getElementById('new-order-btn').addEventListener('click', function() {
        closeAllModals();
        cart = [];
        updateCartUI();
        saveCartToStorage();
    });

    // Profil
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchProfileTab(tabName);
        });
    });

    // Modals
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeAllModals);
    });

    // Thème
    document.querySelectorAll('input[name="theme"]').forEach(radio => {
        radio.addEventListener('change', function() {
            changeTheme(this.value);
        });
    });

    // Annulation dépôt/retrait
    document.querySelectorAll('.cancel-deposit, .cancel-withdraw').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    window.addEventListener('click', function(event) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                closeAllModals();
            }
        });
    });
}

// Gestion de l'authentification
function checkAuthState() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            isAdmin = user.email === ADMIN_EMAIL;
            showMainApp();
            loadUserData();
        } else {
            currentUser = null;
            showHomePage();
        }
    });
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }

    showLoading(true);
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            showNotification('Connexion réussie!', 'success');
        })
        .catch((error) => {
            console.error('Erreur de connexion:', error);
            let errorMessage = 'Erreur de connexion';
            switch(error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Email invalide';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'Utilisateur non trouvé';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Mot de passe incorrect';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Trop de tentatives. Réessayez plus tard';
                    break;
            }
            showNotification(errorMessage, 'error');
        })
        .finally(() => {
            showLoading(false);
        });
}

function handleRegister(e) {
    e.preventDefault();
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('register-email').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validation
    if (!firstName || !lastName || !email || !whatsapp || !password || !confirmPassword) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Les mots de passe ne correspondent pas', 'error');
        return;
    }

    if (password.length < 8) {
        showNotification('Le mot de passe doit contenir au moins 8 caractères', 'error');
        return;
    }

    showLoading(true);

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return db.collection('users').doc(user.uid).set({
                firstName: firstName,
                lastName: lastName,
                email: email,
                whatsapp: whatsapp,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                balance: 0,
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            showNotification('Compte créé avec succès!', 'success');
            // Redirection automatique après inscription
            setTimeout(() => {
                showMainApp();
            }, 1500);
        })
        .catch((error) => {
            console.error('Erreur inscription:', error);
            let errorMessage = 'Erreur lors de la création du compte';
            switch(error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Cet email est déjà utilisé';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email invalide';
                    b