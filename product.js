/**
 * LIBERTÉ BUSINESS ACADEMY - Product Page JavaScript
 * JavaScript pour les pages produits individuelles
 * @author Jean Paul Bognon
 * @version 1.0.0
 */

// ============================================
// CONFIGURATION PRODUIT
// ============================================
const PRODUCT_CONFIG = {
    stripePublicKey: 'pk_test_51XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    paypalClientId: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    apiEndpoint: 'https://api.liberte-business-academy.com'
};

// ============================================
// PAYMENT MODAL
// ============================================
class PaymentModal {
    constructor() {
        this.modal = null;
        this.currentProduct = null;
        this.init();
    }

    init() {
        this.setupBuyButtons();
    }

    setupBuyButtons() {
        document.querySelectorAll('.buy-btn, .cta-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.extractProductInfo();
                this.show();
            });
        });
    }

    extractProductInfo() {
        this.currentProduct = {
            name: document.querySelector('h1')?.textContent || 'Produit',
            price: parseFloat(document.querySelector('.price')?.textContent.replace(/[^\d.]/g, '')) || 0,
            description: document.querySelector('.product-description')?.textContent || '',
            image: document.querySelector('.product-image img')?.src || ''
        };
    }

    show() {
        this.modal = document.createElement('div');
        this.modal.className = 'payment-modal';
        this.modal.innerHTML = `
            <div class="payment-modal-content">
                <button class="close-modal">&times;</button>
                
                <div class="modal-header">
                    <h2>Finaliser votre achat</h2>
                    <p>Choisissez votre mode de paiement</p>
                </div>

                <div class="product-summary">
                    <img src="${this.currentProduct.image}" alt="${this.currentProduct.name}">
                    <div class="product-info">
                        <h3>${this.currentProduct.name}</h3>
                        <p class="product-price">${this.currentProduct.price} €</p>
                    </div>
                </div>

                <div class="payment-methods">
                    <button class="payment-btn stripe-btn">
                        <i class="fas fa-credit-card"></i>
                        <span>Payer par Carte Bancaire</span>
                        <small>Paiement sécurisé via Stripe</small>
                    </button>

                    <button class="payment-btn paypal-btn">
                        <i class="fab fa-paypal"></i>
                        <span>Payer avec PayPal</span>
                        <small>Paiement sécurisé via PayPal</small>
                    </button>
                </div>

                <div class="security-badges">
                    <div class="badge">
                        <i class="fas fa-lock"></i>
                        <span>Paiement 100% sécurisé</span>
                    </div>
                    <div class="badge">
                        <i class="fas fa-shield-alt"></i>
                        <span>Garantie 30 jours</span>
                    </div>
                    <div class="badge">
                        <i class="fas fa-infinity"></i>
                        <span>Accès à vie</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.modal);
        document.body.style.overflow = 'hidden';

        // Setup event listeners
        this.modal.querySelector('.close-modal').addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });

        this.modal.querySelector('.stripe-btn').addEventListener('click', () => {
            this.processStripePayment();
        });

        this.modal.querySelector('.paypal-btn').addEventListener('click', () => {
            this.processPayPalPayment();
        });
    }

    close() {
        if (this.modal) {
            this.modal.remove();
            document.body.style.overflow = '';
        }
    }

    async processStripePayment() {
        if (window.Payment) {
            this.close();
            window.Payment.setProduct(this.currentProduct);
            await window.Payment.processStripe();
        } else {
            alert('Le système de paiement n\'est pas encore configuré.');
        }
    }

    async processPayPalPayment() {
        if (window.Payment) {
            this.close();
            window.Payment.setProduct(this.currentProduct);
            await window.Payment.processPayPal();
        } else {
            alert('Le système de paiement n\'est pas encore configuré.');
        }
    }
}

// ============================================
// FAQ ACCORDION
// ============================================
class FAQAccordion {
    constructor() {
        this.items = document.querySelectorAll('.faq-item');
        this.init();
    }

    init() {
        this.items.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    this.toggleItem(item);
                });
            }
        });
    }

    toggleItem(item) {
        const answer = item.querySelector('.faq-answer');
        const isActive = item.classList.contains('active');

        // Close all items
        this.items.forEach(i => {
            i.classList.remove('active');
            const a = i.querySelector('.faq-answer');
            if (a) a.style.maxHeight = null;
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
            if (answer) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        }
    }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Product Page - Initialisation...');

    // Initialize all components
    new PaymentModal();
    new FAQAccordion();

    console.log('✅ Product Page - Tous les composants sont initialisés');
});

// ============================================
// EXPORT GLOBAL
// ============================================
window.ProductPage = {
    version: '1.0.0',
    config: PRODUCT_CONFIG
};
