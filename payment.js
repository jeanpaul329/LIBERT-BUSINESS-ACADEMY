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
📄 2. HTML DE LA MODALE COMPLÈTE (À REMPLACER)
Dans votre index.html, REMPLACEZ toute la section de la modale par ce code (avant </body>) :

<!-- ============================================ -->
<!-- MODALE DE PAIEMENT COMPLÈTE -->
<!-- ============================================ -->
<div id="paymentModal" class="payment-modal">
    <div class="payment-modal__overlay"></div>
    <div class="payment-modal__content">
        <button class="payment-modal__close" onclick="closePaymentModal()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>

        <div class="payment-modal__header">
            <h2 class="payment-modal__title">💳 Finaliser votre achat</h2>
            <p class="payment-modal__subtitle">Choisissez votre mode de paiement</p>
        </div>

        <div class="payment-modal__body">
            <!-- Résumé de la commande -->
            <div class="payment-summary">
                <div class="payment-summary__item">
                    <span class="payment-summary__label">Formation sélectionnée</span>
                    <span class="payment-summary__value" id="selectedFormationName">-</span>
                </div>
                <div class="payment-summary__item">
                    <span class="payment-summary__label">Prix total</span>
                    <span class="payment-summary__value payment-summary__price" id="selectedFormationPrice">0€</span>
                </div>
            </div>

            <!-- Formulaire de paiement -->
            <form id="paymentForm" class="payment-form">
                <input type="hidden" id="selectedFormationId" name="formation_id">
                <input type="hidden" id="selectedFormationPriceValue" name="formation_price">
                <input type="hidden" id="selectedPaymentMethod" name="payment_method">

                <!-- Informations client -->
                <div class="form-group">
                    <label class="form-label">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Nom complet
                    </label>
                    <input type="text" id="customerName" name="customer_name" class="form-input" placeholder="Jean Dupont" required>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        Email
                    </label>
                    <input type="email" id="customerEmail" name="customer_email" class="form-input" placeholder="jean.dupont@email.com" required>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        Téléphone
                    </label>
                    <input type="tel" id="customerPhone" name="customer_phone" class="form-input" placeholder="+229 XX XX XX XX XX" required>
                </div>

                <!-- Moyens de paiement -->
                <div class="payment-methods">
                    <h3 class="payment-methods__title">Choisissez votre mode de paiement</h3>
                    <div class="payment-methods__grid">
                        
                        <!-- Mobile Money -->
                        <div class="payment-method-card" onclick="selectPaymentMethod('momo')">
                            <div class="payment-method-card__icon">
                                📱
                            </div>
                            <div class="payment-method-card__info">
                                <h4 class="payment-method-card__name">Mobile Money</h4>
                                <p class="payment-method-card__description">MTN • Moov • Celtiis</p>
                            </div>
                            <div class="payment-method-card__countries">🇧🇯</div>
                        </div>

                        <!-- Espèces -->
                        <div class="payment-method-card" onclick="selectPaymentMethod('cash')">
                            <div class="payment-method-card__icon">
                                💵
                            </div>
                            <div class="payment-method-card__info">
                                <h4 class="payment-method-card__name">Espèces</h4>
                                <p class="payment-method-card__description">Paiement en main propre</p>
                            </div>
                            <div class="payment-method-card__countries">🇧🇯</div>
                        </div>

                    </div>
                </div>

                <!-- Bouton de paiement -->
                <button type="submit" class="btn btn-primary btn-block btn-payment" disabled>
                    Sélectionnez un moyen de paiement
                </button>
            </form>

            <!-- Instructions Mobile Money (masqué par défaut) -->
            <div id="momoInstructions" class="payment-instructions" style="display: none;">
                <div class="instructions-header">
                    <h3>📱 Instructions de paiement Mobile Money</h3>
                    <p>Formation: <strong id="momoFormationName"></strong></p>
                    <p class="instructions-amount">Montant: <strong id="momoAmount"></strong> (<span id="momoAmountFCFA"></span>)</p>
                </div>

                <div class="instructions-steps">
                    <div class="instruction-step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Choisissez votre opérateur</h4>
                            <div class="momo-numbers">
                                <div class="momo-number-card">
                                    <div class="momo-operator">📱 MTN Mobile Money</div>
                                    <div class="momo-number">+229 01 48 50 06 13</div>
                                    <button type="button" class="btn-copy" onclick="copyNumber('+22901485006 13', this)">📋 Copier</button>
                                </div>
                                <div class="momo-number-card">
                                    <div class="momo-operator">📱 Moov Money</div>
                                    <div class="momo-number">+229 01 91 66 77 27</div>
                                    <button type="button" class="btn-copy" onclick="copyNumber('+22901916677 27', this)">📋 Copier</button>
                                </div>
                                <div class="momo-number-card">
                                    <div class="momo-operator">📱 Celtiis Cash</div>
                                    <div class="momo-number">+229 01 94 56 49 06</div>
                                    <button type="button" class="btn-copy" onclick="copyNumber('+22901945649 06', this)">📋 Copier</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="instruction-step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Effectuez le transfert</h4>
                            <p>Envoyez le montant exact via votre application Mobile Money</p>
                        </div>
                    </div>

                    <div class="instruction-step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Entrez votre ID de transaction</h4>
                            <input type="text" id="momoTransactionId" class="form-input" placeholder="Ex: MP240423.1234.A12345" required>
                            <p class="help-text">Vous le trouverez dans le SMS de confirmation de votre opérateur</p>
                        </div>
                    </div>
                </div>

                <button type="button" class="btn btn-primary btn-block" onclick="confirmMomoPayment()">
                    ✅ Confirmer le paiement
                </button>
                <button type="button" class="btn btn-secondary btn-block" onclick="closePaymentModal()" style="margin-top: 1rem;">
                    ← Retour
                </button>
            </div>

            <!-- Instructions Espèces (masqué par défaut) -->
            <div id="cashInstructions" class="payment-instructions" style="display: none;">
                <div class="instructions-header">
                    <h3>💵 Instructions de paiement en Espèces</h3>
                    <p>Formation: <strong id="cashFormationName"></strong></p>
                    <p class="instructions-amount">Montant: <strong id="cashAmount"></strong> (<span id="cashAmountFCFA"></span>)</p>
                </div>

                <div class="instructions-steps">
                    <div class="instruction-step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Prenez rendez-vous</h4>
                            <p>Choisissez une date et heure pour le paiement en main propre</p>
                            <div class="form-group">
                                <label class="form-label">Date du rendez-vous</label>
                                <input type="date" id="cashMeetingDate" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Heure du rendez-vous</label>
                                <input type="time" id="cashMeetingTime" class="form-input" required>
                            </div>
                        </div>
                    </div>

                    <div class="instruction-step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Lieu de rendez-vous</h4>
                            <p>📍 <strong>Liberté Business Academy</strong></p>
                            <p>Cotonou, Bénin</p>
                            <p class="help-text">L'adresse exacte vous sera communiquée par SMS/Email après confirmation</p>
                        </div>
                    </div>

                    <div class="instruction-step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Confirmation</h4>
                            <p>Vous recevrez un SMS/Email de confirmation avec:</p>
                            <ul>
                                <li>✅ L'adresse exacte du rendez-vous</li>
                                <li>✅ Le nom de la personne à rencontrer</li>
                                <li>✅ Le montant exact à apporter</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <button type="button" class="btn btn-primary btn-block" onclick="confirmCashPayment()">
                    ✅ Confirmer le rendez-vous
                </button>
                <button type="button" class="btn btn-secondary btn-block" onclick="closePaymentModal()" style="margin-top: 1rem;">
                    ← Retour
                </button>
            </div>

        </div>
    </div>
</div>

<!-- ============================================ -->
<!-- SCRIPTS DE PAIEMENT -->
<!-- ============================================ -->
<script src="payment.js"></script>

</body>
</html>
