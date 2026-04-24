// ============================================
// SYSTÈME DE PAIEMENT - LIBERTÉ BUSINESS ACADEMY
// ============================================

// Données des formations
const formations = {
    1: { name: "Guide Complet du Freelance 2026", price: 27, currency: "EUR" },
    2: { name: "Guide Automatisation Business 2026", price: 47, currency: "EUR" },
    3: { name: "Guide Marketing Digital 2026", price: 37, currency: "EUR" },
    4: { name: "Guide E-commerce Rentable 2026", price: 42, currency: "EUR" },
    5: { name: "Guide Investissement & Finance 2026", price: 52, currency: "EUR" },
    6: { name: "Guide Productivité & Organisation 2026", price: 32, currency: "EUR" },
    7: { name: "Guide Création de Startup 2026", price: 57, currency: "EUR" },
    8: { name: "Guide Analytics & Data 2026", price: 47, currency: "EUR" },
    9: { name: "Création de Contenu Vidéo", price: 197, currency: "EUR" },
    10: { name: "Business en Ligne", price: 247, currency: "EUR" },
    11: { name: "Marketing Digital", price: 197, currency: "EUR" }
};

// Configuration des clés API - VOS CLÉS SONT DÉJÀ CONFIGURÉES
const API_KEYS = {
    fedapay: {
        public_key: "pk_live_ieeyHcl3_lf-YW1YfoCbaO3w",
        sandbox: false // Mode PRODUCTION activé
    },
    kkiapay: {
        public_key: "2ac6f7e0652611efbf02478c5adba4b8",
        sandbox: false // Mode PRODUCTION activé
    }
};

let selectedFormation = null;
let selectedPaymentMethod = null;

// Ouvrir la modale de paiement
function openPaymentModal(formationId) {
    const formation = formations[formationId];
    if (!formation) {
        alert("Formation introuvable");
        return;
    }

    selectedFormation = { id: formationId, ...formation };

    // Mettre à jour les informations dans la modale
    document.getElementById('selectedFormationName').textContent = formation.name;
    document.getElementById('selectedFormationPrice').textContent = `${formation.price}€`;
    document.getElementById('selectedFormationId').value = formationId;
    document.getElementById('selectedFormationPriceValue').value = formation.price;

    // Afficher la modale
    document.getElementById('paymentModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fermer la modale de paiement
function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('active');
    document.body.style.overflow = '';
    
    // Réinitialiser le formulaire
    document.getElementById('paymentForm').reset();
    selectedFormation = null;
    selectedPaymentMethod = null;
    
    // Désélectionner tous les moyens de paiement
    document.querySelectorAll('.payment-method-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    document.querySelector('.btn-payment').disabled = true;
}

// Sélectionner un moyen de paiement
function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    document.getElementById('selectedPaymentMethod').value = method;

    // Mettre à jour l'interface
    document.querySelectorAll('.payment-method-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.payment-method-card').classList.add('selected');

    // Activer le bouton de paiement
    document.querySelector('.btn-payment').disabled = false;
}

// Gérer la soumission du formulaire
document.getElementById('paymentForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerPhone = document.getElementById('customerPhone').value;

    if (!selectedPaymentMethod) {
        alert("Veuillez sélectionner un moyen de paiement");
        return;
    }

    if (!selectedFormation) {
        alert("Aucune formation sélectionnée");
        return;
    }

    // Lancer le paiement selon la méthode choisie
    switch(selectedPaymentMethod) {
        case 'fedapay':
            processFedapayPayment(customerName, customerEmail, customerPhone);
            break;
        case 'kkiapay':
            processKkiapayPayment(customerName, customerEmail, customerPhone);
            break;
        default:
            alert("Méthode de paiement non supportée");
    }
});

// ============================================
// FEDAPAY - CLÉ CONFIGURÉE
// ============================================
function processFedapayPayment(name, email, phone) {
    FedaPay.init({
        public_key: "pk_live_ieeyHcl3_lf-YW1YfoCbaO3w",
        sandbox: false
    });

    FedaPay.transaction.create({
        description: selectedFormation.name,
        amount: selectedFormation.price,
        currency: {
            iso: selectedFormation.currency
        },
        customer: {
            firstname: name.split(' ')[0],
            lastname: name.split(' ').slice(1).join(' ') || name.split(' ')[0],
            email: email,
            phone_number: {
                number: phone,
                country: 'bj'
            }
        },
        callback_url: window.location.origin + '/confirmation.html'
    }, function(transaction) {
        if (transaction.reason) {
            alert('Erreur: ' + transaction.reason);
        } else {
            window.location.href = transaction.url;
        }
    });
}

// ============================================
// KKIAPAY - CLÉ CONFIGURÉE
// ============================================
function processKkiapayPayment(name, email, phone) {
    openKkiapayWidget({
        amount: selectedFormation.price,
        position: "center",
        callback: window.location.origin + '/confirmation.html',
        data: JSON.stringify({
            formation_id: selectedFormation.id,
            formation_name: selectedFormation.name,
            customer_name: name,
            customer_email: email
        }),
        theme: "#667eea",
        key: "2ac6f7e0652611efbf02478c5adba4b8",
        sandbox: false
    });

    addSuccessListener(function(response) {
        console.log('Paiement réussi:', response);
        window.location.href = '/confirmation.html?transaction_id=' + response.transactionId;
    });

    addFailedListener(function(error) {
        console.error('Paiement échoué:', error);
        alert('Le paiement a échoué. Veuillez réessayer.');
    });
}

// Fermer la modale en cliquant sur l'overlay
document.querySelector('.payment-modal__overlay')?.addEventListener('click', closePaymentModal);

// Modifier les boutons "Découvrir" pour ouvrir la modale
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Système de paiement chargé avec succès');
    console.log('🔑 Fedapay: Mode PRODUCTION');
    console.log('🔑 Kkiapay: Mode PRODUCTION');
});
