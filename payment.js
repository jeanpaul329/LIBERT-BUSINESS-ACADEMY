// ============================================
// SYSTÈME DE PAIEMENT - LIBERTÉ BUSINESS ACADEMY
// Version avec Mobile Money Direct + Espèces
// ============================================

// Données des formations
const formations = {
    1: { name: "Guide Complet du Freelance 2026", price: 27, currency: "EUR", icon: "📚" },
    2: { name: "Guide Automatisation Business 2026", price: 47, currency: "EUR", icon: "🤖" },
    3: { name: "Guide Marketing Digital 2026", price: 37, currency: "EUR", icon: "📱" },
    4: { name: "Guide E-commerce Rentable 2026", price: 42, currency: "EUR", icon: "🛒" },
    5: { name: "Guide Investissement & Finance 2026", price: 52, currency: "EUR", icon: "💰" },
    6: { name: "Guide Productivité & Organisation 2026", price: 32, currency: "EUR", icon: "⚡" },
    7: { name: "Guide Création de Startup 2026", price: 57, currency: "EUR", icon: "🚀" },
    8: { name: "Guide Analytics & Data 2026", price: 47, currency: "EUR", icon: "📊" },
    9: { name: "Création de Contenu Vidéo", price: 197, currency: "EUR", icon: "🎥" },
    10: { name: "Business en Ligne", price: 247, currency: "EUR", icon: "💼" },
    11: { name: "Marketing Digital", price: 197, currency: "EUR", icon: "📈" }
};

// Numéros Mobile Money pour paiement direct
const MOBILE_MONEY_NUMBERS = {
    mtn: "+229 01 48 50 06 13",
    moov: "+229 01 91 66 77 27",
    celtiis: "+229 01 94 56 49 06"
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
        nameElement.innerHTML = `${formation.icon} ${formation.name}`;
        console.log('✅ Nom affiché:', formation.name);
    }
    
    if (priceElement) {
        priceElement.textContent = `${formation.price}€`;
        console.log('✅ Prix affiché:', formation.price + '€');
    }

    document.getElementById('selectedFormationId').value = formationId;
    document.getElementById('selectedFormationPriceValue').value = formation.price;

    // Afficher la modale
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('✅ Modale ouverte');
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
    
    // Masquer les instructions
    document.getElementById('momoInstructions').style.display = 'none';
    document.getElementById('cashInstructions').style.display = 'none';
    
    const btnPayment = document.querySelector('.btn-payment');
    if (btnPayment) {
        btnPayment.disabled = true;
        btnPayment.textContent = 'Sélectionnez un moyen de paiement';
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

    // Masquer toutes les instructions
    document.getElementById('momoInstructions').style.display = 'none';
    document.getElementById('cashInstructions').style.display = 'none';

    // Activer le bouton de paiement et changer le texte
    const btnPayment = document.querySelector('.btn-payment');
    if (btnPayment) {
        btnPayment.disabled = false;
        
        switch(method) {
            case 'momo':
                btnPayment.innerHTML = '📱 Voir les instructions Mobile Money';
                break;
            case 'cash':
                btnPayment.innerHTML = '💵 Voir les instructions Espèces';
                break;
            default:
                btnPayment.innerHTML = '💳 Procéder au paiement';
        }
    }
}

// Copier un numéro dans le presse-papier
function copyNumber(number, button) {
    navigator.clipboard.writeText(number).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '✅ Copié !';
        button.style.background = '#48bb78';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Erreur de copie:', err);
        alert('Numéro: ' + number);
    });
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

            console.log('🚀 Traitement du paiement via:', selectedPaymentMethod);

            // Traiter selon la méthode choisie
            switch(selectedPaymentMethod) {
                case 'momo':
                    showMomoInstructions();
                    break;
                case 'cash':
                    showCashInstructions();
                    break;
                default:
                    alert("Méthode de paiement non supportée");
            }
        });
    }

    // Fermer la modale en cliquant sur l'overlay
    const overlay = document.querySelector('.payment-modal__overlay');
    if (overlay) {
        overlay.addEventListener('click', closePaymentModal);
    }

    console.log('✅ Système de paiement chargé avec succès');
    console.log('📱 Mobile Money: Activé');
    console.log('💵 Paiement Espèces: Activé');
});

// ============================================
// MOBILE MONEY - INSTRUCTIONS
// ============================================
function showMomoInstructions() {
    console.log('📱 Affichage instructions Mobile Money');
    
    // Masquer le formulaire et afficher les instructions
    document.querySelector('.payment-form').style.display = 'none';
    document.getElementById('momoInstructions').style.display = 'block';
    
    // Mettre à jour les informations
    document.getElementById('momoFormationName').textContent = selectedFormation.name;
    document.getElementById('momoAmount').textContent = selectedFormation.price + '€';
    
    // Calculer le montant en FCFA (1 EUR = 655.957 FCFA)
    const amountFCFA = Math.round(selectedFormation.price * 655.957);
    document.getElementById('momoAmountFCFA').textContent = amountFCFA.toLocaleString('fr-FR') + ' FCFA';
}

// Confirmer le paiement Mobile Money
function confirmMomoPayment() {
    const transactionId = document.getElementById('momoTransactionId').value.trim();
    
    if (!transactionId) {
        alert('Veuillez entrer votre ID de transaction');
        return;
    }
    
    console.log('✅ Transaction Mobile Money confirmée:', transactionId);
    
    // Envoyer les données au serveur (à implémenter)
    const paymentData = {
        formation_id: selectedFormation.id,
        formation_name: selectedFormation.name,
        amount: selectedFormation.price,
        payment_method: 'mobile_money',
        transaction_id: transactionId,
        customer_name: document.getElementById('customerName').value,
        customer_email: document.getElementById('customerEmail').value,
        customer_phone: document.getElementById('customerPhone').value,
        timestamp: new Date().toISOString()
    };
    
    console.log('📤 Données de paiement:', paymentData);
    
    // Rediriger vers la page de confirmation
    alert('✅ Votre paiement a été enregistré !\n\nNous allons vérifier votre transaction et vous enverrons la formation par email sous 24h.\n\nID Transaction: ' + transactionId);
    window.location.href = 'confirmation.html?transaction_id=' + transactionId;
}

// ============================================
// PAIEMENT ESPÈCES - INSTRUCTIONS
// ============================================
function showCashInstructions() {
    console.log('💵 Affichage instructions Espèces');
    
    // Masquer le formulaire et afficher les instructions
    document.querySelector('.payment-form').style.display = 'none';
    document.getElementById('cashInstructions').style.display = 'block';
    
    // Mettre à jour les informations
    document.getElementById('cashFormationName').textContent = selectedFormation.name;
    document.getElementById('cashAmount').textContent = selectedFormation.price + '€';
    
    // Calculer le montant en FCFA
    const amountFCFA = Math.round(selectedFormation.price * 655.957);
    document.getElementById('cashAmountFCFA').textContent = amountFCFA.toLocaleString('fr-FR') + ' FCFA';
}

// Confirmer le paiement en espèces
function confirmCashPayment() {
    const meetingDate = document.getElementById('cashMeetingDate').value;
    const meetingTime = document.getElementById('cashMeetingTime').value;
    
    if (!meetingDate || !meetingTime) {
        alert('Veuillez sélectionner une date et une heure de rendez-vous');
        return;
    }
    
    console.log('✅ Rendez-vous espèces confirmé:', meetingDate, meetingTime);
    
    // Envoyer les données au serveur (à implémenter)
    const paymentData = {
        formation_id: selectedFormation.id,
        formation_name: selectedFormation.name,
        amount: selectedFormation.price,
        payment_method: 'cash',
        meeting_date: meetingDate,
        meeting_time: meetingTime,
        customer_name: document.getElementById('customerName').value,
        customer_email: document.getElementById('customerEmail').value,
        customer_phone: document.getElementById('customerPhone').value,
        timestamp: new Date().toISOString()
    };
    
    console.log('📤 Données de rendez-vous:', paymentData);
    
    // Rediriger vers la page de confirmation
    alert('✅ Votre rendez-vous a été enregistré !\n\nDate: ' + meetingDate + '\nHeure: ' + meetingTime + '\n\nNous vous confirmerons par SMS/Email.');
    window.location.href = 'confirmation.html?payment_method=cash&date=' + meetingDate;
}
