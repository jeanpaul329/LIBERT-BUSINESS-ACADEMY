/**
 * LIBERTÉ BUSINESS ACADEMY - Payment System
 * Stripe & PayPal Integration
 * @author Jean Paul Bognon
 * @version 1.0.0
 */

// ============================================
// CONFIGURATION
// ============================================
const PAYMENT_CONFIG = {
    stripe: {
        publicKey: 'pk_test_51XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // ⚠️ REMPLACER
        apiVersion: '2023-10-16'
    },
    paypal: {
        clientId: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // ⚠️ REMPLACER
        currency: 'EUR',
        intent: 'capture'
    },
    apiUrl: 'https://api.liberte-business-academy.com' // ⚠️ REMPLACER
};

// ============================================
// STRIPE PAYMENT
// ============================================
class StripePayment {
    constructor() {
        this.stripe = null;
        this.init();
    }

    async init() {
        // Load Stripe.js
        if (!window.Stripe) {
            await this.loadStripeScript();
        }
        this.stripe = Stripe(PAYMENT_CONFIG.stripe.publicKey);
    }

    loadStripeScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async createCheckoutSession(product) {
        try {
            const response = await fetch(`${PAYMENT_CONFIG.apiUrl}/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    product: product,
                    successUrl: `${window.location.origin}/produits/success.html`,
                    cancelUrl: `${window.location.origin}/produits/cancel.html`
                })
            });

            const session = await response.json();
            return session;
        } catch (error) {
            console.error('Error creating checkout session:', error);
            throw error;
        }
    }

    async redirectToCheckout(sessionId) {
        const { error } = await this.stripe.redirectToCheckout({
            sessionId: sessionId
        });

        if (error) {
            console.error('Error redirecting to checkout:', error);
            throw error;
        }
    }

    async process(product) {
        try {
            this.showLoader('Redirection vers le paiement sécurisé...');
            
            const session = await this.createCheckoutSession(product);
            await this.redirectToCheckout(session.id);
        } catch (error) {
            this.hideLoader();
            this.showError('Une erreur est survenue. Veuillez réessayer.');
        }
    }

    showLoader(message) {
        const loader = document.createElement('div');
        loader.id = 'payment-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(loader);
    }

    hideLoader() {
        const loader = document.getElementById('payment-loader');
        if (loader) loader.remove();
    }

    showError(message) {
        alert(message);
    }
}

// ============================================
// PAYPAL PAYMENT
// ============================================
class PayPalPayment {
    constructor() {
        this.paypal = null;
        this.init();
    }

    async init() {
        // Load PayPal SDK
        if (!window.paypal) {
            await this.loadPayPalScript();
        }
        this.paypal = window.paypal;
    }

    loadPayPalScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://www.paypal.com/sdk/js?client-id=${PAYMENT_CONFIG.paypal.clientId}&currency=${PAYMENT_CONFIG.paypal.currency}`;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async createOrder(product) {
        return {
            purchase_units: [{
                description: product.name,
                amount: {
                    currency_code: PAYMENT_CONFIG.paypal.currency,
                    value: product.price.toFixed(2)
                }
            }]
        };
    }

    async onApprove(data, actions) {
        try {
            const order = await actions.order.capture();
            
            // Track purchase
            if (window.Analytics) {
                window.Analytics.trackPurchase(
                    order.id,
                    order.purchase_units[0].amount.value,
                    [{ name: order.purchase_units[0].description }]
                );
            }

            // Redirect to success page
            window.location.href = '/produits/success.html';
        } catch (error) {
            console.error('Error capturing PayPal order:', error);
            alert('Une erreur est survenue lors du paiement.');
        }
    }

    async process(product) {
        try {
            const container = document.createElement('div');
            container.id = 'paypal-button-container';
            document.body.appendChild(container);

            this.paypal.Buttons({
                createOrder: () => this.createOrder(product),
                onApprove: (data, actions) => this.onApprove(data, actions),
                onError: (err) => {
                    console.error('PayPal error:', err);
                    alert('Une erreur est survenue avec PayPal.');
                    container.remove();
                },
                onCancel: () => {
                    container.remove();
                }
            }).render('#paypal-button-container');
        } catch (error) {
            console.error('Error processing PayPal payment:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
    }
}

// ============================================
// PAYMENT MANAGER
// ============================================
class PaymentManager {
    constructor() {
        this.stripe = new StripePayment();
        this.paypal = new PayPalPayment();
        this.currentProduct = null;
    }

    setProduct(product) {
        this.currentProduct = product;
    }

    async processStripe() {
        if (!this.currentProduct) {
            console.error('No product set');
            return;
        }

        await this.stripe.process(this.currentProduct);
    }

    async processPayPal() {
        if (!this.currentProduct) {
            console.error('No product set');
            return;
        }

        await this.paypal.process(this.currentProduct);
    }
}

// ============================================
// INITIALIZATION
// ============================================
const Payment = new PaymentManager();

// Export global
window.Payment = Payment;

console.log('✅ Payment system initialized');
