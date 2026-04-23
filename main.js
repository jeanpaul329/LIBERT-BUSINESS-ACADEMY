/**
 * LIBERTÉ BUSINESS ACADEMY - Main JavaScript
 * JavaScript pour la page d'accueil (index.html)
 * @author Jean Paul Bognon
 * @version 1.0.0
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    apiUrl: 'https://api.liberte-business-academy.com',
    stripePublicKey: 'pk_test_51XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    analyticsId: 'G-XXXXXXXXXX'
};

// ============================================
// NAVIGATION
// ============================================
class Navigation {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.navLinks = document.querySelector('.nav-links');
        this.init();
    }

    init() {
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupSmoothScroll();
    }

    setupScrollEffect() {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll
            if (currentScroll > lastScroll && currentScroll > 500) {
                this.navbar.style.transform = 'translateY(-100%)';
            } else {
                this.navbar.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }

    setupMobileMenu() {
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => {
                this.navLinks.classList.toggle('active');
                this.mobileMenuBtn.classList.toggle('active');
            });

            // Close menu when clicking on a link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    this.navLinks.classList.remove('active');
                    this.mobileMenuBtn.classList.remove('active');
                });
            });
        }
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ============================================
// PRODUCT CARDS
// ============================================
class ProductCards {
    constructor() {
        this.cards = document.querySelectorAll('.product-card');
        this.init();
    }

    init() {
        this.setupHoverEffects();
        this.setupClickTracking();
        this.setupLazyLoading();
    }

    setupHoverEffects() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    setupClickTracking() {
        this.cards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.cta-button')) {
                    const productName = card.querySelector('h3')?.textContent;
                    if (window.Analytics) {
                        window.Analytics.trackEvent('product_card_click', {
                            product_name: productName
                        });
                    }
                }
            });
        });
    }

    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ============================================
// SHOPPING CART
// ============================================
class ShoppingCart {
    constructor() {
        this.cart = this.loadCart();
        this.cartButton = document.querySelector('.cart-button');
        this.cartBadge = document.querySelector('.cart-badge');
        this.init();
    }

    init() {
        this.updateBadge();
        this.setupAddToCartButtons();
        this.setupCartModal();
    }

    loadCart() {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    addItem(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateBadge();
        this.showNotification('Produit ajouté au panier !');

        // Track event
        if (window.Analytics) {
            window.Analytics.trackAddToCart(product.name, product.price);
        }
    }

    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateBadge();
        this.renderCart();
    }

    updateBadge() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (this.cartBadge) {
            this.cartBadge.textContent = totalItems;
            this.cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    setupAddToCartButtons() {
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const card = btn.closest('.product-card');
                const product = {
                    id: card.dataset.productId || Date.now(),
                    name: card.querySelector('h3')?.textContent,
                    price: parseFloat(card.querySelector('.price')?.textContent.replace(/[^\d.]/g, '')),
                    image: card.querySelector('img')?.src
                };
                this.addItem(product);
            });
        });
    }

    setupCartModal() {
        if (this.cartButton) {
            this.cartButton.addEventListener('click', () => {
                this.showCartModal();
            });
        }
    }

    showCartModal() {
        const modal = document.createElement('div');
        modal.className = 'cart-modal';
        modal.innerHTML = `
            <div class="cart-modal-content">
                <div class="cart-modal-header">
                    <h2>Mon Panier</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="cart-items"></div>
                <div class="cart-total">
                    <strong>Total:</strong>
                    <span class="total-amount"></span>
                </div>
                <button class="checkout-btn">Passer la commande</button>
            </div>
        `;

        document.body.appendChild(modal);
        this.renderCart();

        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    renderCart() {
        const cartItems = document.querySelector('.cart-items');
        const totalAmount = document.querySelector('.total-amount');

        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
            totalAmount.textContent = '0 €';
            return;
        }

        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price} €</p>
                    <span>Quantité: ${item.quantity}</span>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmount.textContent = `${total.toFixed(2)} €`;

        // Setup remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                this.removeItem(btn.dataset.id);
            });
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 LIBERTÉ BUSINESS ACADEMY - Initialisation...');

    // Initialize all components
    new Navigation();
    new ProductCards();
    new ShoppingCart();

    console.log('✅ Tous les composants sont initialisés');
});

// ============================================
// EXPORT GLOBAL
// ============================================
window.LiberteAcademy = {
    version: '1.0.0',
    config: CONFIG
};
