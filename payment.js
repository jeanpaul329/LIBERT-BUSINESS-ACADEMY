// ============================================
// SYSTÈME DE PAIEMENT - LIBERTÉ BUSINESS ACADEMY
// Version corrigée avec clés API fonctionnelles
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

// Configuration des clés API - CORRIGÉES
const API_KEYS = {
    fedapay: {
        public_key: "pk_live_ieeyHcl3_lf-YW1YfoCbaO3w",
        sandbox: false
    },
    kkiapay: {
        public_key: "2ac6f7e0652611efbf02478c5adba4b8",
        sandbox: false
    }
};

let selectedFormation = null;
let selectedPaymentMethod = null;

// Ouvrir la modale de paiement
function openPaymentModal(formationId) {
    console.log('🔍 Ouverture modale pour formation:', formationId);
    
    const formation = formations[formationId];
    if (!formation) {
        console.error('❌ Formation introuvable:', formationId);
        alert("Formation introuvable");
        return;
    }

    selectedFormation = { id: formationId, ...formation };
    console.log('✅ Formation sélectionnée:', selectedFormation);

    // Mettre à jour les informations dans la modale
    const nameElement = document.getElementById('selectedFormationName');
    const priceElement = document.getElementById('selectedFormationPrice');
    
    if (nameElement) {
        nameElement.textContent = formation.name;
        console.log('✅ Nom affiché:', formation.name);
    } else {
        console.error('❌ Élément selectedFormationName introuvable');
    }
    
    if (priceElement) {
        priceElement.textContent = `${formation.price}€`;
        console.log('✅ Prix affiché:', formation.price + '€');
    } else {
        console.error('❌ Élément selectedFormationPrice introuvable');
    }

    document.getElementById('selectedFormationId').value = formationId;
    document.getElementById('selectedFormationPriceValue').value = formation.price;

    // Afficher la modale
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('✅ Modale ouverte');
    } else {
        console.error('❌ Modale introuvable');
    }
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
    
    const btnPayment = document.querySelector('.btn-payment');
    if (btnPayment) {
        btnPayment.disabled = true;
    }
}

// Sélectionner un moyen de paiement
function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    document.getElementById('selectedPaymentMethod').value = method;
    console.log('💳 Moyen de paiement sélectionné:', method);

    // Mettre à jour l'interface
    document.querySelectorAll('.payment-method-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.payment-method-card').classList.add('selected');

    // Activer le bouton de paiement
    const btnPayment = document.querySelector('.btn-payment');
    if (btnPayment) {
        btnPayment.disabled = false;
    }
}

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM chargé');
    
    // Gérer la soumission du formulaire
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📝 Formulaire soumis');

            const customerName = document.getElementById('customerName').value;
            const customerEmail = document.getElementById('customerEmail').value;
            const customerPhone = document.getElementById('customerPhone').value;

            console.log('👤 Client:', { customerName, customerEmail, customerPhone });

            if (!selectedPaymentMethod) {
                alert("Veuillez sélectionner un moyen de paiement");
                return;
            }

            if (!selectedFormation) {
                alert("Aucune formation sélectionnée");
                return;
            }

            console.log('🚀 Lancement du paiement via:', selectedPaymentMethod);

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
    } else {
        console.error('❌ Formulaire de paiement introuvable');
    }

    // Fermer la modale en cliquant sur l'overlay
    const overlay = document.querySelector('.payment-modal__overlay');
    if (overlay) {
        overlay.addEventListener('click', closePaymentModal);
    }

    console.log('✅ Système de paiement chargé avec succès');
    console.log('🔑 Fedapay: Mode PRODUCTION');
    console.log('🔑 Kkiapay: Mode PRODUCTION');
});

// ============================================
// FEDAPAY - CONFIGURATION CORRIGÉE
// ============================================
function processFedapayPayment(name, email, phone) {
    console.log('💳 Initialisation Fedapay...');
    
    if (typeof FedaPay === 'undefined') {
        console.error('❌ FedaPay SDK non chargé');
        alert('Erreur: Le système de paiement Fedapay n\'est pas disponible. Veuillez recharger la page.');
        return;
    }

    try {
        FedaPay.init({
            public_key: API_KEYS.fedapay.public_key,
            sandbox: API_KEYS.fedapay.sandbox
        });

        console.log('✅ Fedapay initialisé');

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
                console.error('❌ Erreur Fedapay:', transaction.reason);
                alert('Erreur: ' + transaction.reason);
            } else {
                console.log('✅ Transaction créée:', transaction);
                window.location.href = transaction.url;
            }
        });
    } catch (error) {
        console.error('❌ Erreur Fedapay:', error);
        alert('Erreur lors de l\'initialisation du paiement. Veuillez réessayer.');
    }
}

// ============================================
// KKIAPAY - CONFIGURATION CORRIGÉE
// ============================================
function processKkiapayPayment(name, email, phone) {
    console.log('📱 Initialisation Kkiapay...');
    
    if (typeof openKkiapayWidget === 'undefined') {
        console.error('❌ Kkiapay SDK non chargé');
        alert('Erreur: Le système de paiement Kkiapay n\'est pas disponible. Veuillez recharger la page.');
        return;
    }

    try {
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
            key: API_KEYS.kkiapay.public_key,
            sandbox: API_KEYS.kkiapay.sandbox
        });

        console.log('✅ Kkiapay widget ouvert');

        addSuccessListener(function(response) {
            console.log('✅ Paiement réussi:', response);
            window.location.href = '/confirmation.html?transaction_id=' + response.transactionId;
        });

        addFailedListener(function(error) {
            console.error('❌ Paiement échoué:', error);
            alert('Le paiement a échoué. Veuillez réessayer.');
        });
    } catch (error) {
        console.error('❌ Erreur Kkiapay:', error);
        alert('Erreur lors de l\'initialisation du paiement. Veuillez réessayer.');
    }
}
