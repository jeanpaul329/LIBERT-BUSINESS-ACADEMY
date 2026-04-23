/**
 * LIBERTÉ BUSINESS ACADEMY - Utilities
 * Fonctions utilitaires réutilisables
 * @author Jean Paul Bognon
 * @version 1.0.0
 */

// ============================================
// VALIDATION
// ============================================
const Validator = {
    email(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    phone(phone) {
        const re = /^[\d\s\-\+\(\)]+$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    },

    required(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    },

    minLength(value, min) {
        return value.length >= min;
    },

    maxLength(value, max) {
        return value.length <= max;
    },

    number(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },

    url(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
};

// ============================================
// FORMATAGE
// ============================================
const Formatter = {
    price(amount, currency = 'EUR') {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    date(date, format = 'long') {
        const options = {
            short: { year: 'numeric', month: '2-digit', day: '2-digit' },
            long: { year: 'numeric', month: 'long', day: 'numeric' },
            full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
        };

        return new Intl.DateTimeFormat('fr-FR', options[format] || options.long).format(new Date(date));
    },

    number(num, decimals = 0) {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(num);
    },

    phone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
        if (match) {
            return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
        }
        return phone;
    },

    truncate(text, length = 100, suffix = '...') {
        if (text.length <= length) return text;
        return text.substring(0, length).trim() + suffix;
    }
};

// ============================================
// STORAGE
// ============================================
const Storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    },

    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }
};

// ============================================
// COOKIES
// ============================================
const Cookie = {
    set(name, value, days = 365) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    },

    get(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },

    remove(name) {
        this.set(name, '', -1);
    }
};

// ============================================
// DOM UTILITIES
// ============================================
const DOM = {
    $(selector) {
        return document.querySelector(selector);
    },

    $(selector) {
        return document.querySelectorAll(selector);
    },

    create(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'class') {
                element.className = value;
            } else if (key === 'style') {
                Object.assign(element.style, value);
            } else {
                element.setAttribute(key, value);
            }
        });
        if (content) element.innerHTML = content;
        return element;
    },

    remove(element) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        element?.remove();
    },

    addClass(element, className) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        element?.classList.add(className);
    },

    removeClass(element, className) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        element?.classList.remove(className);
    },

    toggleClass(element, className) {
        if (typeof element === 'string') {
            element = this.$(element);
        }
        element?.classList.toggle(className);
    }
};

// ============================================
// HTTP REQUESTS
// ============================================
const HTTP = {
    async get(url, options = {}) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                ...options
            });
            return await response.json();
        } catch (error) {
            console.error('HTTP GET error:', error);
            throw error;
        }
    },

    async post(url, data, options = {}) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                body: JSON.stringify(data),
                ...options
            });
            return await response.json();
        } catch (error) {
            console.error('HTTP POST error:', error);
            throw error;
        }
    },

    async put(url, data, options = {}) {
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                body: JSON.stringify(data),
                ...options
            });
            return await response.json();
        } catch (error) {
            console.error('HTTP PUT error:', error);
            throw error;
        }
    },

    async delete(url, options = {}) {
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                ...options
            });
            return await response.json();
        } catch (error) {
            console.error('HTTP DELETE error:', error);
            throw error;
        }
    }
};

// ============================================
// DEVICE DETECTION
// ============================================
const Device = {
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    isTablet() {
        return /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent);
    },

    isDesktop() {
        return !this.isMobile() && !this.isTablet();
    },

    getOS() {
        const userAgent = navigator.userAgent;
        if (/Windows/i.test(userAgent)) return 'Windows';
        if (/Mac/i.test(userAgent)) return 'MacOS';
        if (/Linux/i.test(userAgent)) return 'Linux';
        if (/Android/i.test(userAgent)) return 'Android';
        if (/iOS|iPhone|iPad|iPod/i.test(userAgent)) return 'iOS';
        return 'Unknown';
    },

    getBrowser() {
        const userAgent = navigator.userAgent;
        if (/Chrome/i.test(userAgent)) return 'Chrome';
        if (/Firefox/i.test(userAgent)) return 'Firefox';
        if (/Safari/i.test(userAgent)) return 'Safari';
        if (/Edge/i.test(userAgent)) return 'Edge';
        if (/Opera/i.test(userAgent)) return 'Opera';
        return 'Unknown';
    }
};

// ============================================
// DEBOUNCE & THROTTLE
// ============================================
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// EXPORT GLOBAL
// ============================================
window.Utils = {
    Validator,
    Formatter,
    Storage,
    Cookie,
    DOM,
    HTTP,
    Device,
    debounce,
    throttle
};

console.log('✅ Utilities loaded');
