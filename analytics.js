/**
 * LIBERTÉ BUSINESS ACADEMY - Analytics
 * Google Analytics & Facebook Pixel Integration
 * @author Jean Paul Bognon
 * @version 1.0.0
 */

// ============================================
// CONFIGURATION
// ============================================
const ANALYTICS_CONFIG = {
    googleAnalyticsId: 'G-XXXXXXXXXX', // ⚠️ REMPLACER
    facebookPixelId: 'XXXXXXXXXX',     // ⚠️ REMPLACER
    enabled: true
};

// ============================================
// GOOGLE ANALYTICS
// ============================================
class GoogleAnalytics {
    constructor(measurementId) {
        this.measurementId = measurementId;
        this.init();
    }

    init() {
        if (!ANALYTICS_CONFIG.enabled) return;

        // Load Google Analytics script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', this.measurementId);

        window.gtag = gtag;
    }

    trackEvent(eventName, params = {}) {
        if (window.gtag) {
            window.gtag('event', eventName, params);
        }
    }

    trackPageView(pagePath) {
        if (window.gtag) {
            window.gtag('config', this.measurementId, {
                page_path: pagePath
            });
        }
    }
}

// ============================================
// FACEBOOK PIXEL
// ============================================
class FacebookPixel {
    constructor(pixelId) {
        this.pixelId = pixelId;
        this.init();
    }

    init() {
        if (!ANALYTICS_CONFIG.enabled) return;

        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        
        fbq('init', this.pixelId);
        fbq('track', 'PageView');
    }

    trackEvent(eventName, params = {}) {
        if (window.fbq) {
            window.fbq('track', eventName, params);
        }
    }
}

// ============================================
// TRACKING MANAGER
// ============================================
class TrackingManager {
    constructor() {
        this.ga = new GoogleAnalytics(ANALYTICS_CONFIG.googleAnalyticsId);
        this.fb = new FacebookPixel(ANALYTICS_CONFIG.facebookPixelId);
    }

    trackEvent(eventName, params = {}) {
        this.ga.trackEvent(eventName, params);
        this.fb.trackEvent(eventName, params);
    }

    trackPageView(pagePath = window.location.pathname) {
        this.ga.trackPageView(pagePath);
    }

    trackProductView(productName, productPrice) {
        this.trackEvent('view_item', {
            item_name: productName,
            value: productPrice,
            currency: 'EUR'
        });
    }

    trackAddToCart(productName, productPrice) {
        this.trackEvent('add_to_cart', {
            item_name: productName,
            value: productPrice,
            currency: 'EUR'
        });
    }

    trackPurchase(transactionId, value, items) {
        this.trackEvent('purchase', {
            transaction_id: transactionId,
            value: value,
            currency: 'EUR',
            items: items
        });
    }
}

// ============================================
// INITIALIZATION
// ============================================
const Analytics = new TrackingManager();

// Export global
window.Analytics = Analytics;

console.log('✅ Analytics initialized');
