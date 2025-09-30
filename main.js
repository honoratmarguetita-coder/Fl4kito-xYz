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
            showGameOrderForm(game, product, price);
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

    // Paiements
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

    // Admin
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchAdminTab(tabName);
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

// Fonction pour afficher les produits d'un jeu
function showGameProducts(game) {
    const gameData = gameProducts[game];
    if (!gameData) {
        showNotification('Jeu non trouvé', 'error');
        return;
    }

    currentGameModal = game;
    
    // Mettre à jour le modal avec les données du jeu
    document.getElementById('modal-title').textContent = `${gameData.name} - Produits`;
    document.getElementById('game-description').innerHTML = `
        <h3>${gameData.name}</h3>
        <p>${gameData.description}</p>
    `;

    // Afficher les packs par défaut
    showGameProductsTab('packs');
    
    // Afficher le modal
    document.getElementById('game-modal').style.display = 'block';
}

// Fonction pour afficher les onglets des produits
function showGameProductsTab(tab) {
    const gameData = gameProducts[currentGameModal];
    if (!gameData) return;

    const productsContainer = document.getElementById('modal-products');
    productsContainer.innerHTML = '';

    let products = [];
    let tabTitle = '';
    
    switch(tab) {
        case 'packs':
            products = gameData.packs || [];
            tabTitle = 'Packs de Diamants';
            break;
        case 'subscriptions':
            products = gameData.subscriptions || [];
            tabTitle = 'Abonnements';
            break;
        case 'passes':
            products = gameData.passes || [];
            tabTitle = 'Special VIP Pass';
            break;
    }

    if (products.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-products">
                <p>Aucun produit disponible dans cette catégorie</p>
            </div>
        `;
        return;
    }

    // Ajouter le titre de l'onglet
    const titleElement = document.createElement('h4');
    titleElement.style.color = 'var(--accent-color)';
    titleElement.style.marginBottom = '1rem';
    titleElement.textContent = tabTitle;
    productsContainer.appendChild(titleElement);

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-item';
        productElement.innerHTML = `
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-details">${product.details || ''}</div>
            </div>
            <div class="product-price">${product.price} HTG</div>
            <button class="btn-primary add-to-cart-modal" 
                    data-product="${product.name}" 
                    data-price="${product.price}" 
                    data-game="${gameData.name}">
                Choisir
            </button>
        `;
        productsContainer.appendChild(productElement);
    });

    // Mettre à jour les onglets actifs
    document.querySelectorAll('.product-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.product-tab[data-tab="${tab}"]`).classList.add('active');

    // Ajouter les événements pour les boutons d'ajout au panier
    document.querySelectorAll('.add-to-cart-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            const product = this.dataset.product;
            const price = parseInt(this.dataset.price);
            const game = this.dataset.game;
            showGameOrderForm(currentGameModal, product, price);
        });
    });
}

// Fonction pour afficher le formulaire de commande d'un jeu
function showGameOrderForm(game, product, price) {
    const gameData = gameProducts[game];
    if (!gameData) return;

    // Fermer le modal des produits
    document.getElementById('game-modal').style.display = 'none';

    // Créer un modal pour le formulaire de commande
    const orderModal = document.createElement('div');
    orderModal.className = 'modal';
    orderModal.style.display = 'block';
    orderModal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Commande - ${gameData.name}</h2>
            <div class="order-summary">
                <h3>Produit sélectionné</h3>
                <div class="summary-item">
                    <span>${product}</span>
                    <span>${price} HTG</span>
                </div>
            </div>
            <form class="game-order-form">
                <h3>Informations requises</h3>
                <div id="game-order-fields"></div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Ajouter au panier</button>
                    <button type="button" class="btn-outline cancel-order">Annuler</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(orderModal);

    // Remplir les champs du formulaire
    const formFields = document.getElementById('game-order-fields');
    formFields.innerHTML = '';

    gameData.formFields.forEach(field => {
        const fieldElement = document.createElement('div');
        fieldElement.className = 'form-group';
        
        if (field.type === 'select') {
            fieldElement.innerHTML = `
                <label for="order-${field.name}">${field.label}</label>
                <select id="order-${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
                    <option value="">Sélectionnez une région</option>
                    ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                </select>
            `;
        } else {
            fieldElement.innerHTML = `
                <label for="order-${field.name}">${field.label}</label>
                <input type="${field.type}" 
                       id="order-${field.name}" 
                       name="${field.name}"
                       placeholder="${field.placeholder}"
                       ${field.required ? 'required' : ''}>
            `;
        }
        formFields.appendChild(fieldElement);
    });

    // Événements
    orderModal.querySelector('.close-modal').addEventListener('click', function() {
        orderModal.remove();
    });

    orderModal.querySelector('.cancel-order').addEventListener('click', function() {
        orderModal.remove();
    });

    orderModal.querySelector('.game-order-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleGameOrder(game, product, price, this);
        orderModal.remove();
    });

    window.addEventListener('click', function(event) {
        if (event.target === orderModal) {
            orderModal.remove();
        }
    });
}

// Fonction pour gérer la commande d'un jeu
function handleGameOrder(game, product, price, form) {
    const formData = new FormData(form);
    const orderDetails = {};
    
    for (let [key, value] of formData.entries()) {
        orderDetails[key] = value;
    }

    const cartItem = {
        id: Date.now().toString(),
        name: product,
        price: price,
        game: gameProducts[game].name,
        type: 'game',
        orderDetails: orderDetails
    };
    
    cart.push(cartItem);
    updateCartUI();
    saveCartToStorage();
    showNotification('Produit ajouté au panier', 'success');
}

// Fonction pour afficher les services financiers
function showFinancialService(service) {
    const serviceData = financialServices[service];
    if (!serviceData) {
        showNotification('Service non trouvé', 'error');
        return;
    }

    currentFinancialService = service;
    
    // Mettre à jour le modal
    document.getElementById('financial-modal-title').textContent = serviceData.name;
    document.getElementById('financial-description').innerHTML = `
        <h3>${serviceData.name}</h3>
        <p>${serviceData.description}</p>
    `;

    // Afficher les options de montant
    showAmountOptions(serviceData.amounts);
    
    // Afficher les champs du formulaire
    showFinancialFormFields(serviceData.formFields);
    
    // Afficher le modal
    document.getElementById('financial-modal').style.display = 'block';
}

// Fonction pour afficher les options de montant
function showAmountOptions(amounts) {
    const amountOptions = document.getElementById('amount-options');
    amountOptions.innerHTML = '';

    if (!amounts || amounts.length === 0) {
        amountOptions.innerHTML = '<p>Aucun montant disponible</p>';
        return;
    }

    amounts.forEach(amount => {
        const option = document.createElement('div');
        option.className = 'amount-option';
        option.innerHTML = `
            <div class="amount">${amount.usd} USD</div>
            <div class="price">${amount.htg} HTG</div>
        `;
        
        option.addEventListener('click', function() {
            // Retirer la sélection précédente
            document.querySelectorAll('.amount-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            // Sélectionner cette option
            this.classList.add('selected');
            selectedAmount = amount;
        });

        amountOptions.appendChild(option);
    });

    // Sélectionner la première option par défaut
    if (amounts.length > 0) {
        amountOptions.firstChild.classList.add('selected');
        selectedAmount = amounts[0];
    }
}

// Fonction pour afficher les champs du formulaire financier
function showFinancialFormFields(fields) {
    const formFields = document.getElementById('financial-form-fields');
    formFields.innerHTML = '';

    if (!fields || fields.length === 0) {
        formFields.innerHTML = '<p>Aucun champ requis</p>';
        return;
    }

    fields.forEach(field => {
        const fieldElement = document.createElement('div');
        fieldElement.className = 'form-group';
        fieldElement.innerHTML = `
            <label for="financial-${field.name}">${field.label}</label>
            <input type="${field.type}" 
                   id="financial-${field.name}" 
                   name="${field.name}"
                   placeholder="${field.placeholder}"
                   ${field.required ? 'required' : ''}>
        `;
        formFields.appendChild(fieldElement);
    });
}

// Fonction pour gérer les commandes de services financiers
function handleFinancialOrder() {
    if (!selectedAmount) {
        showNotification('Veuillez sélectionner un montant', 'error');
        return;
    }

    const serviceData = financialServices[currentFinancialService];
    const form = document.getElementById('financial-order-form');
    const formData = new FormData(form);
    const orderDetails = {};
    
    for (let [key, value] of formData.entries()) {
        orderDetails[key] = value;
    }

    const productName = `${serviceData.name} - ${selectedAmount.usd} USD`;
    
    const cartItem = {
        id: Date.now().toString(),
        name: productName,
        price: selectedAmount.htg,
        game: serviceData.name,
        type: 'financial',
        orderDetails: orderDetails
    };

    cart.push(cartItem);
    updateCartUI();
    saveCartToStorage();
    document.getElementById('financial-modal').style.display = 'none';
    showNotification('Service ajouté au panier', 'success');
}

// Gestion de l'authentification
function checkAuthState() {
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            checkAdminStatus(user);
            showMainPage();
            loadUserData();
        } else {
            currentUser = null;
            isAdmin = false;
            showHomePage();
        }
    });
}

function checkAdminStatus(user) {
    if (user.email === ADMIN_EMAIL) {
        isAdmin = true;
        addAdminToMenu();
    } else {
        isAdmin = false;
        removeAdminFromMenu();
    }
}

function addAdminToMenu() {
    if (!document.querySelector('[data-page="admin"]')) {
        const sidebarNav = document.querySelector('.sidebar-nav');
        const adminItem = document.createElement('a');
        adminItem.href = '#';
        adminItem.className = 'nav-item';
        adminItem.dataset.page = 'admin';
        adminItem.innerHTML = `
            <i class="fas fa-shield-alt"></i>
            <span>Administration</span>
        `;
        sidebarNav.insertBefore(adminItem, document.getElementById('logout-btn'));
        adminItem.addEventListener('click', handleNavigation);
    }
}

function removeAdminFromMenu() {
    const adminItem = document.querySelector('[data-page="admin"]');
    if (adminItem) {
        adminItem.remove();
    }
}

// Navigation
function showHomePage() {
    hideAllPages();
    document.getElementById('home-page').classList.add('active');
}

function showLoginPage() {
    hideAllPages();
    document.getElementById('login-page').classList.add('active');
}

function showRegisterPage() {
    hideAllPages();
    document.getElementById('register-page').classList.add('active');
}

function showMainPage() {
    hideAllPages();
    document.getElementById('main-page').classList.add('active');
    showPage('dashboard');
}

function hideAllPages() {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
}

function showPage(pageId) {
    // Vérifier l'accès admin
    if (pageId === 'admin' && !isAdmin) {
        showNotification('Accès non autorisé', 'error');
        return;
    }
    
    // Gérer le bouton de retour
    const backButton = document.getElementById('back-to-dashboard');
    if (pageId === 'dashboard') {
        backButton.style.display = 'none';
    } else {
        backButton.style.display = 'flex';
    }

    // Mettre à jour le titre
    const pageTitle = document.getElementById('page-title');
    const pageNames = {
        'dashboard': 'Tableau de bord',
        'gaming': 'Recharge de jeux',
        'streaming': 'Streaming',
        'financial': 'Services Financiers',
        'wallet': 'Portefeuille',
        'orders': 'Commandes',
        'profile': 'Profil',
        'settings': 'Paramètres',
        'admin': 'Administration'
    };
    pageTitle.textContent = pageNames[pageId] || 'Page';

    // Masquer toutes les sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Afficher la section demandée
    document.getElementById(pageId).classList.add('active');

    // Mettre à jour la navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageId) {
            item.classList.add('active');
        }
    });

    // Charger les données admin si nécessaire
    if (pageId === 'admin') {
        loadAdminData();
    }

    // Fermer le sidebar sur mobile
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
    }
}

function handleNavigation(e) {
    e.preventDefault();
    const page = this.dataset.page;
    showPage(page);
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

// Authentification
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        showNotification('Connexion réussie!', 'success');
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showNotification('Erreur de connexion: ' + error.message, 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('register-email').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        showNotification('Les mots de passe ne correspondent pas', 'error');
        return;
    }

    if (password.length < 8) {
        showNotification('Le mot de passe doit contenir au moins 8 caractères', 'error');
        return;
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        await db.collection('users').doc(user.uid).set({
            firstName: firstName,
            lastName: lastName,
            email: email,
            whatsapp: whatsapp,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            walletBalance: 0
        });

        showNotification('Compte créé avec succès!', 'success');
    } catch (error) {
        console.error('Erreur d\'inscription:', error);
        showNotification('Erreur d\'inscription: ' + error.message, 'error');
    }
}

async function handleLogout() {
    try {
        await auth.signOut();
        cart = [];
        updateCartUI();
        localStorage.removeItem('gameplay_cart');
        showNotification('Déconnexion réussie', 'success');
    } catch (error) {
        console.error('Erreur de déconnexion:', error);
        showNotification('Erreur de déconnexion', 'error');
    }
}

// Chargement des données utilisateur
async function loadUserData() {
    if (!currentUser) return;

    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            
            document.getElementById('user-name').textContent = `${userData.firstName} ${userData.lastName}`;
            document.getElementById('user-email').textContent = userData.email;
            
            if (userData.walletBalance !== undefined) {
                document.getElementById('wallet-amount').textContent = userData.walletBalance.toFixed(2);
                document.getElementById('available-balance').textContent = userData.walletBalance.toFixed(2);
            }
        }
    } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
    }
}

// Gestion du panier
function addToCart(productName, price, game) {
    const cartItem = {
        id: Date.now().toString(),
        name: productName,
        price: price,
        game: game,
        quantity: 1,
        type: 'game'
    };
    
    cart.push(cartItem);
    updateCartUI();
    saveCartToStorage();
    showNotification('Produit ajouté au panier', 'success');
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    cartCount.textContent = cart.length;
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="no-items">Aucun article dans votre panier</div>';
        cartTotal.textContent = '0';
        checkoutBtn.disabled = true;
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-game">${item.game}</div>
            </div>
            <div class="cart-item-price">${item.price} HTG</div>
            <button class="remove-item" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItemElement);
        
        total += item.price;
        
        cartItemElement.querySelector('.remove-item').addEventListener('click', function() {
            removeFromCart(this.dataset.id);
        });
    });
    
    cartTotal.textContent = total;
    checkoutBtn.disabled = false;
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartUI();
    saveCartToStorage();
    showNotification('Produit retiré du panier', 'warning');
}

function toggleCart() {
    document.getElementById('cart').classList.toggle('active');
}

function saveCartToStorage() {
    localStorage.setItem('gameplay_cart', JSON.stringify(cart));
}

// Gestion du portefeuille
function showDepositModal() {
    updateDepositDetails();
    document.getElementById('deposit-modal').style.display = 'block';
}

function showWithdrawModal() {
    document.getElementById('withdraw-modal').style.display = 'block';
}

function updateDepositDetails() {
    const selectedMethod = document.querySelector('input[name="deposit-method"]:checked').value;
    const depositDetails = document.getElementById('deposit-details');
    
    if (paymentInfo[selectedMethod]) {
        const info = paymentInfo[selectedMethod];
        depositDetails.innerHTML = `
            <div class="payment-info">
                <i class="fas fa-info-circle"></i>
                <div class="payment-info-content">
                    <h4>${selectedMethod === 'moncash' ? 'MonCash' : 'NatCash'}</h4>
                    <p>Nom: ${info.name}</p>
                    <p>Numéro: ${info.phone}</p>
                </div>
            </div>
        `;
    }
}

function updatePaymentDetails() {
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
    const paymentDetails = document.getElementById('payment-details');
    
    if (paymentInfo[selectedMethod]) {
        const info = paymentInfo[selectedMethod];
        paymentDetails.innerHTML = `
            <div class="payment-info">
                <i class="fas fa-info-circle"></i>
                <div class="payment-info-content">
                    <h4>${selectedMethod === 'moncash' ? 'MonCash' : 'NatCash'}</h4>
                    <p>Nom: ${info.name}</p>
                    <p>Numéro: ${info.phone}</p>
                    <p>Effectuez le paiement et prenez une capture d'écran</p>
                </div>
            </div>
        `;
    }
}

async function handleDeposit(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('Veuillez vous connecter pour effectuer un dépôt', 'error');
        return;
    }
    
    const amount = parseInt(document.getElementById('deposit-amount').value);
    const email = document.getElementById('deposit-email').value;
    const method = document.querySelector('input[name="deposit-method"]:checked').value;
    const proofFile = document.getElementById('deposit-proof').files[0];
    
    if (amount < 150) {
        showNotification('Le montant minimum est de 150 HTG', 'error');
        return;
    }
    
    if (!proofFile) {
        showNotification('Veuillez uploader une preuve de paiement', 'error');
        return;
    }
    
    try {
        const storageRef = storage.ref();
        const proofRef = storageRef.child(`deposit-proofs/${currentUser.uid}/${Date.now()}_${proofFile.name}`);
        const uploadTask = await proofRef.put(proofFile);
        const proofUrl = await uploadTask.ref.getDownloadURL();

        const transactionData = {
            userId: currentUser.uid,
            userEmail: currentUser.email,
            type: 'deposit',
            amount: amount,
            method: method,
            email: email,
            proofUrl: proofUrl,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        await db.collection('transactions').add(transactionData);
        
        showNotification('Demande de dépôt soumise avec succès!', 'success');
        closeAllModals();
        document.getElementById('deposit-form').reset();
        
    } catch (error) {
        console.error('Erreur lors du dépôt:', error);
        showNotification('Erreur lors du dépôt', 'error');
    }
}

async function handleWithdraw(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('Veuillez vous connecter pour effectuer un retrait', 'error');
        return;
    }
    
    const amount = parseInt(document.getElementById('withdraw-amount').value);
    const phone = document.getElementById('withdraw-phone').value;
    const method = document.querySelector('input[name="withdraw-method"]:checked').value;
    const currentBalance = parseFloat(document.getElementById('available-balance').textContent);
    
    if (amount > currentBalance) {
        showNotification('Solde insuffisant', 'error');
        return;
    }
    
    if (amount < 100) {
        showNotification('Le montant minimum est de 100 HTG', 'error');
        return;
    }
    
    try {
        const transactionData = {
            userId: currentUser.uid,
            type: 'withdraw',
            amount: amount,
            method: method,
            phone: phone,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        await db.collection('transactions').add(transactionData);
        
        showNotification('Demande de retrait soumise avec succès!', 'success');
        closeAllModals();
        document.getElementById('withdraw-form').reset();
        
    } catch (error) {
        console.error('Erreur lors du retrait:', error);
        showNotification('Erreur lors du retrait', 'error');
    }
}

function refreshWallet() {
    loadUserData();
    showNotification('Portefeuille actualisé', 'success');
}

// Paiement
function showPaymentModal() {
    if (cart.length === 0) {
        showNotification('Votre panier est vide', 'warning');
        return;
    }
    
    // Vérifier le solde du portefeuille
    const currentBalance = parseFloat(document.getElementById('available-balance').textContent);
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    if (currentBalance < total) {
        showInsufficientBalanceModal(total, currentBalance);
        return;
    }
    
    const paymentItems = document.getElementById('payment-items');
    const paymentTotal = document.getElementById('payment-total');
    
    paymentItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'summary-item';
        itemElement.innerHTML = `
            <span>${item.name} - ${item.game}</span>
            <span>${item.price} HTG</span>
        `;
        paymentItems.appendChild(itemElement);
    });
    
    paymentTotal.textContent = total;
    updatePaymentDetails();
    document.getElementById('payment-modal').style.display = 'block';
}

function showInsufficientBalanceModal(total, currentBalance) {
    const insufficientModal = document.createElement('div');
    insufficientModal.className = 'modal';
    insufficientModal.style.display = 'block';
    insufficientModal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Solde Insuffisant</h2>
            <div class="balance-warning">
                <i class="fas fa-exclamation-triangle" style="color: var(--warning-color); font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>Votre solde actuel est insuffisant pour effectuer cette commande.</p>
                <div class="balance-details">
                    <p>Total de la commande: <strong>${total} HTG</strong></p>
                    <p>Solde disponible: <strong>${currentBalance} HTG</strong></p>
                    <p>Manquant: <strong style="color: var(--danger-color);">${total - currentBalance} HTG</strong></p>
                </div>
                <div class="balance-actions">
                    <button class="btn-primary" id="go-to-wallet">Recharger mon portefeuille</button>
                    <button class="btn-outline" id="cancel-order">Annuler</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(insufficientModal);

    insufficientModal.querySelector('.close-modal').addEventListener('click', function() {
        insufficientModal.remove();
    });

    insufficientModal.querySelector('#go-to-wallet').addEventListener('click', function() {
        insufficientModal.remove();
        closeAllModals();
        showPage('wallet');
    });

    insufficientModal.querySelector('#cancel-order').addEventListener('click', function() {
        insufficientModal.remove();
    });

    window.addEventListener('click', function(event) {
        if (event.target === insufficientModal) {
            insufficientModal.remove();
        }
    });
}

async function handlePayment(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('Veuillez vous connecter pour commander', 'error');
        return;
    }
    
    const playerId = document.getElementById('player-id').value;
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    const specialNotes = document.getElementById('special-notes').value;
    const proofFile = document.getElementById('payment-proof').files[0];
    const currentBalance = parseFloat(document.getElementById('available-balance').textContent);
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    // Vérifier à nouveau le solde
    if (currentBalance < total) {
        showNotification('Solde insuffisant', 'error');
        return;
    }
    
    if (!proofFile) {
        showNotification('Veuillez uploader une preuve de paiement', 'error');
        return;
    }
    
    try {
        const storageRef = storage.ref();
        const proofRef = storageRef.child(`order-proofs/${currentUser.uid}/${Date.now()}_${proofFile.name}`);
        const uploadTask = await proofRef.put(proofFile);
        const proofUrl = await uploadTask.ref.getDownloadURL();

        const orderData = {
            userId: currentUser.uid,
            userEmail: currentUser.email,
            items: cart,
            total: total,
            playerId: playerId,
            paymentMethod: paymentMethod,
            paymentProof: proofUrl,
            specialNotes: specialNotes,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        const orderRef = await db.collection('orders').add(orderData);
        const orderNumber = `GPS-${orderRef.id.substring(0, 8).toUpperCase()}`;
        
        // Déduire le montant du portefeuille
        await deductFromWallet(total);
        
        showConfirmationModal(orderNumber, orderData.total);
        cart = [];
        updateCartUI();
        saveCartToStorage();
        
    } catch (error) {
        console.error('Erreur lors de la commande:', error);
        showNotification('Erreur lors de la commande: ' + error.message, 'error');
    }
}

// Fonction pour déduire du portefeuille
async function deductFromWallet(amount) {
    if (!currentUser) return;
    
    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            const newBalance = (userData.walletBalance || 0) - amount;
            
            await db.collection('users').doc(currentUser.uid).update({
                walletBalance: newBalance
            });
            
            // Mettre à jour l'interface
            document.getElementById('wallet-amount').textContent = newBalance.toFixed(2);
            document.getElementById('available-balance').textContent = newBalance.toFixed(2);
            
            showNotification(`Montant déduit: ${amount} HTG`, 'success');
        }
    } catch (error) {
        console.error('Erreur lors de la déduction du portefeuille:', error);
        throw new Error('Erreur lors de la déduction du portefeuille: ' + error.message);
    }
}

function showConfirmationModal(orderNumber, total) {
    document.getElementById('order-number').textContent = orderNumber;
    document.getElementById('order-total-confirm').textContent = total;
    document.getElementById('payment-modal').style.display = 'none';
    document.getElementById('confirmation-modal').style.display = 'block';
    
    // Mettre à jour le solde affiché
    loadUserData();
}

// Profil
function switchProfileTab(tabName) {
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// Admin
async function loadAdminData() {
    if (!isAdmin) return;

    try {
        await loadAdminStats();
        await loadPendingOrders();
        await loadAdminUsers();
        await loadAdminTransactions();
        await loadPendingDeposits();
    } catch (error) {
        console.error('Erreur lors du chargement des données admin:', error);
        showNotification('Erreur de chargement des données admin', 'error');
    }
}

async function loadAdminStats() {
    try {
        const usersSnapshot = await db.collection('users').get();
        document.getElementById('total-users').textContent = usersSnapshot.size;

        const ordersSnapshot = await db.collection('orders').get();
        document.getElementById('total-orders').textContent = ordersSnapshot.size;

        let totalRevenue = 0;
        ordersSnapshot.forEach(doc => {
            const order = doc.data();
            if (order.status === 'completed') {
                totalRevenue += order.total || 0;
            }
        });
        document.getElementById('total-revenue').textContent = totalRevenue + ' HTG';
    } catch (error) {
        console.error('Erreur lors du chargement des stats admin:', error);
    }
}

async function loadPendingOrders() {
    const ordersTable = document.getElementById('orders-table-body');
    ordersTable.innerHTML = '';

    try {
        const ordersSnapshot = await db.collection('orders')
            .where('status', '==', 'pending')
            .orderBy('createdAt', 'desc')
            .get();

        if (ordersSnapshot.empty) {
            ordersTable.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--gray-color);">
                        Aucune commande en attente
                    </td>
                </tr>
            `;
            return;
        }

        for (const doc of ordersSnapshot.docs) {
            const order = doc.data();
            const userDoc = await db.collection('users').doc(order.userId).get();
            const userData = userDoc.data();

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doc.id.substring(0, 8)}</td>
                <td>
                    <strong>${userData.firstName} ${userData.lastName}</strong><br>
                    <small>${userData.email}</small>
                </td>
                <td>${order.items.length} produit(s)</td>
                <td>${order.total} HTG</td>
                <td>${new Date(order.createdAt?.toDate()).toLocaleDateString()}</td>
                <td>
                    <button class="btn-outline view-order-details" data-order-id="${doc.id}">
                        <i class="fas fa-eye"></i> Voir
                    </button>
                </td>
            `;
            ordersTable.appendChild(row);
        }

        document.querySelectorAll('.view-order-details').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.dataset.orderId;
                showOrderDetails(orderId);
            });
        });
    } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
        ordersTable.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--danger-color);">
                    Erreur de chargement
                </td>
            </tr>
        `;
    }
}

async function loadPendingDeposits() {
    const depositsTable = document.getElementById('deposits-table-body');
    if (!depositsTable) return;

    depositsTable.innerHTML = '';

    try {
        const depositsSnapshot = await db.collection('transactions')
            .where('type', '==', 'deposit')
            .where('status', '==', 'pending')
            .orderBy('createdAt', 'desc')
            .get();

        if (depositsSnapshot.empty) {
            depositsTable.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: var(--gray-color);">
                        Aucun dépôt en attente
                    </td>
                </tr>
            `;
            return;
        }

        for (const doc of depositsSnapshot.docs) {
            const deposit = doc.data();
            const userDoc = await db.collection('users').doc(deposit.userId).get();
            const userData = userDoc.data();

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${userData.firstName} ${userData.lastName}</td>
                <td>${userData.email}</td>
                <td>${deposit.amount} HTG</td>
                <td>${deposit.method}</td>
                <td>${deposit.email}</td>
                <td>
                    <button class="btn-outline view-deposit-proof" data-deposit-id="${doc.id}" data-proof-url="${deposit.proofUrl}">
                        <i class="fas fa-eye"></i> Voir preuve
                    </button>
                </td>
                <td>
                    <button class="btn-success approve-deposit" data-deposit-id="${doc.id}" data-user-id="${deposit.userId}" data-amount="${deposit.amount}">
                        <i class="fas fa-check"></i> Approuver
                    </button>
                    <button class="btn-danger reject-deposit" data-deposit-id="${doc.id}">
                        <i class="fas fa-times"></i> Rejeter
                    </button>
                </td>
            `;
            depositsTable.appendChild(row);
        }

        // Événements pour les boutons de dépôt
        document.querySelectorAll('.view-deposit-proof').forEach(btn => {
            btn.addEventListener('click', function() {
                const proofUrl = this.dataset.proofUrl;
                showDepositProof(proofUrl);
            });
        });

        document.querySelectorAll('.approve-deposit').forEach(btn => {
            btn.addEventListener('click', function() {
                const depositId = this.dataset.depositId;
                const userId = this.dataset.userId;
                const amount = parseFloat(this.dataset.amount);
                approveDeposit(depositId, userId, amount);
            });
        });

        document.querySelectorAll('.reject-deposit').forEach(btn => {
            btn.addEventListener('click', function() {
                const depositId = this.dataset.depositId;
                rejectDeposit(depositId);
            });
        });
    } catch (error) {
        console.error('Erreur lors du chargement des dépôts:', error);
    }
}

async function showDepositProof(proofUrl) {
    const proofModal = document.createElement('div');
    proofModal.className = 'modal';
    proofModal.style.display = 'block';
    proofModal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Preuve de Paiement</h2>
            <div style="text-align: center; padding: 1rem;">
                <img src="${proofUrl}" alt="Preuve de paiement" style="max-width: 100%; max-height: 500px; border-radius: 8px;">
            </div>
        </div>
    `;

    document.body.appendChild(proofModal);

    proofModal.querySelector('.close-modal').addEventListener('click', function() {
        proofModal.remove();
    });

    window.addEventListener('click', function(event) {
        if (event.target === proofModal) {
            proofModal.remove();
        }
    });
}

async function approveDeposit(depositId, userId, amount) {
    try {
        // Mettre à jour le statut de la transaction
        await db.collection('transactions').doc(depositId).update({
            status: 'approved',
            approvedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Ajouter le montant au portefeuille de l'utilisateur
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        const newBalance = (userData.walletBalance || 0) + amount;

        await db.collection('users').doc(userId).update({
            walletBalance: newBalance
        });

        showNotification('Dépôt approuvé avec succès', 'success');
        loadAdminData();
        
    } catch (error) {
        console.error('Erreur lors de l\'approbation du dépôt:', error);
        showNotification('Erreur lors de l\'approbation', 'error');
    }
}

async function rejectDeposit(depositId) {
    try {
        await db.collection('transactions').doc(depositId).update({
            status: 'rejected',
            rejectedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showNotification('Dépôt rejeté', 'warning');
        loadAdminData();
        
    } catch (error) {
        console.error('Erreur lors du rejet du dépôt:', error);
        showNotification('Erreur lors du rejet', 'error');
    }
}

async function loadAdminUsers() {
    const usersTable = document.getElementById('users-table-body');
    usersTable.innerHTML = '';

    try {
        const usersSnapshot = await db.collection('users').get();

        if (usersSnapshot.empty) {
            usersTable.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: var(--gray-color);">
                        Aucun utilisateur
                    </td>
                </tr>
            `;
            return;
        }

        for (const doc of usersSnapshot.docs) {
            const user = doc.data();
            const userOrders = await db.collection('orders')
                .where('userId', '==', doc.id)
                .get();

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.whatsapp || 'Non renseigné'}</td>
                <td>${new Date(user.createdAt?.toDate()).toLocaleDateString()}</td>
                <td>${userOrders.size}</td>
            `;
            usersTable.appendChild(row);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        usersTable.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: var(--danger-color);">
                    Erreur de chargement
                </td>
            </tr>
        `;
    }
}

async function loadAdminTransactions() {
    const transactionsTable = document.getElementById('transactions-table-body');
    transactionsTable.innerHTML = '';

    try {
        const transactionsSnapshot = await db.collection('transactions')
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();

        if (transactionsSnapshot.empty) {
            transactionsTable.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--gray-color);">
                        Aucune transaction
                    </td>
                </tr>
            `;
            return;
        }

        for (const doc of transactionsSnapshot.docs) {
            const transaction = doc.data();
            const userDoc = await db.collection('users').doc(transaction.userId).get();
            const userData = userDoc.data();

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <span class="status-${transaction.type}">${transaction.type === 'deposit' ? 'Dépôt' : 'Retrait'}</span>
                </td>
                <td>${userData.firstName} ${userData.lastName}</td>
                <td>${transaction.amount} HTG</td>
                <td>${transaction.method}</td>
                <td>
                    <span class="status-${transaction.status}">
                        ${transaction.status === 'pending' ? 'En attente' : 
                          transaction.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                    </span>
                </td>
                <td>${new Date(transaction.createdAt?.toDate()).toLocaleDateString()}</td>
            `;
            transactionsTable.appendChild(row);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des transactions:', error);
        transactionsTable.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--danger-color);">
                    Erreur de chargement
                </td>
            </tr>
        `;
    }
}

async function showOrderDetails(orderId) {
    try {
        const orderDoc = await db.collection('orders').doc(orderId).get();
        const order = orderDoc.data();
        const userDoc = await db.collection('users').doc(order.userId).get();
        const userData = userDoc.data();

        document.getElementById('admin-order-id').textContent = orderId.substring(0, 8);
        document.getElementById('admin-order-date').textContent = new Date(order.createdAt?.toDate()).toLocaleString();
        document.getElementById('admin-order-status').textContent = 
            order.status === 'pending' ? 'En attente' : 
            order.status === 'approved' ? 'Approuvé' : 'Rejeté';
        document.getElementById('admin-order-status').className = `status-${order.status}`;
        document.getElementById('admin-order-total').textContent = order.total + ' HTG';

        document.getElementById('admin-user-name').textContent = `${userData.firstName} ${userData.lastName}`;
        document.getElementById('admin-user-email').textContent = userData.email;
        document.getElementById('admin-user-phone').textContent = userData.whatsapp || 'Non renseigné';

        document.getElementById('admin-payment-method').textContent = order.paymentMethod || 'Non spécifié';
        document.getElementById('admin-player-id').textContent = order.playerId || 'Non renseigné';

        const orderItems = document.getElementById('admin-order-items');
        orderItems.innerHTML = '';
        
        order.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'product-item';
            itemElement.innerHTML = `
                <div class="product-info">
                    <div class="product-name">${item.name}</div>
                    <div class="product-game">${item.game}</div>
                </div>
                <div class="product-price">${item.price} HTG</div>
            `;
            orderItems.appendChild(itemElement);
        });

        const paymentProof = document.getElementById('admin-payment-proof');
        if (order.paymentProof) {
            paymentProof.innerHTML = `<img src="${order.paymentProof}" alt="Preuve de paiement" style="max-width: 100%; border-radius: 8px;">`;
        } else {
            paymentProof.innerHTML = '<p>Aucune preuve de paiement uploadée</p>';
        }

        document.getElementById('approve-order').onclick = () => approveOrder(orderId);
        document.getElementById('reject-order').onclick = () => rejectOrder(orderId);

        document.getElementById('admin-order-modal').style.display = 'block';

    } catch (error) {
        console.error('Erreur lors du chargement des détails de commande:', error);
        showNotification('Erreur de chargement des détails', 'error');
    }
}

async function approveOrder(orderId) {
    try {
        await db.collection('orders').doc(orderId).update({
            status: 'approved',
            approvedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showNotification('Commande approuvée avec succès', 'success');
        document.getElementById('admin-order-modal').style.display = 'none';
        loadAdminData();
        
    } catch (error) {
        console.error('Erreur lors de l\'approbation:', error);
        showNotification('Erreur lors de l\'approbation', 'error');
    }
}

async function rejectOrder(orderId) {
    try {
        await db.collection('orders').doc(orderId).update({
            status: 'rejected',
            rejectedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showNotification('Commande rejetée', 'warning');
        document.getElementById('admin-order-modal').style.display = 'none';
        loadAdminData();
        
    } catch (error) {
        console.error('Erreur lors du rejet:', error);
        showNotification('Erreur lors du rejet', 'error');
    }
}

function switchAdminTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`admin-${tabName}`).classList.add('active');
}

// Gestion du thème
function changeTheme(theme) {
    if (theme === 'light') {
        document.body.style.setProperty('--dark-color', '#f8f9fa');
        document.body.style.setProperty('--light-color', '#1a1a2e');
        document.body.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
    } else {
        document.body.style.setProperty('--dark-color', '#1a1a2e');
        document.body.style.setProperty('--light-color', '#f8f9fa');
        document.body.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
    }
    
    // Sauvegarder la préférence
    localStorage.setItem('gameplay-theme', theme);
}

// Charger le thème sauvegardé
function loadTheme() {
    const savedTheme = localStorage.getItem('gameplay-theme') || 'dark';
    const themeRadio = document.querySelector(`input[name="theme"][value="${savedTheme}"]`);
    if (themeRadio) {
        themeRadio.checked = true;
        changeTheme(savedTheme);
    }
}

// Utilitaires
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = 'notification';
    notification.classList.add(type, 'show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}