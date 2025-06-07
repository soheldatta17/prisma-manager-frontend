// Enhanced main.js with improved animations and interactions

// Get DOM elements
const profileBtn = document.getElementById('profileBtn');
const profileModal = document.getElementById('profileModal');
const closeProfile = document.getElementById('closeProfile');
const logoutBtn = document.getElementById('logoutBtn');
const navbar = document.getElementById('navbar');

// Profile info elements
const playerName = document.getElementById('playerName');
const playerEmail = document.getElementById('playerEmail');
const playerId = document.getElementById('playerId');
const playerJoined = document.getElementById('playerJoined');

// Token elements
const viewTokenBtn = document.getElementById('viewTokenBtn');
const tokenModal = document.getElementById('tokenModal');
const closeToken = document.getElementById('closeToken');
const tokenText = document.getElementById('tokenText');
const copyTokenBtn = document.getElementById('copyTokenBtn');

// Enhanced navbar scroll effect
window.addEventListener('scroll', () => {
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Cookie handling function
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            try {
                return JSON.parse(c.substring(nameEQ.length, c.length));
            } catch (e) {
                return null;
            }
        }
    }
    return null;
}

// Enhanced date formatting function
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Load user data from cookie
function loadUserData() {
    const userData = getCookie('user_data');
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }

    // Update profile information if elements exist
    if (playerName) playerName.textContent = userData.name;
    if (playerEmail) playerEmail.textContent = userData.email;
    if (playerId) playerId.textContent = userData.userId;
    if (playerJoined) playerJoined.textContent = formatDate(userData.createdAt);

    // Store token for later use if element exists
    if (tokenText) tokenText.textContent = userData.token;

    // Update welcome message if it exists
    const welcomeMessage = document.querySelector('.hero-section h1');
    if (welcomeMessage && welcomeMessage.textContent.includes('Welcome to Soccer Club')) {
        welcomeMessage.textContent = `Welcome back, ${userData.name}!`;
    }
}

// Enhanced logout function
function logout() {
    // Show confirmation with custom styling
    if (confirm('Are you sure you want to logout?')) {
        // Delete the cookie
        document.cookie = 'user_data=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
        
        // Show logout message
        showMessage('Successfully logged out. See you soon!', 'success');
        
        // Redirect after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Enhanced modal functions
function showModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Focus trap for accessibility
    const focusableElements = modal.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
}

function hideModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Token Modal Functions
function showTokenModal() {
    showModal(tokenModal);
}

function hideTokenModal() {
    hideModal(tokenModal);
}

// Enhanced copy token function
async function copyToken() {
    if (!tokenText || !copyTokenBtn) return;
    try {
        await navigator.clipboard.writeText(tokenText.textContent);
        copyTokenBtn.classList.add('copied');
        copyTokenBtn.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
        
        // Show success message
        showMessage('Token copied to clipboard!', 'success');
        
        setTimeout(() => {
            copyTokenBtn.classList.remove('copied');
            copyTokenBtn.innerHTML = '<i class="fas fa-copy"></i><span>Copy Token</span>';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy token:', err);
        showMessage('Failed to copy token to clipboard', 'error');
    }
}

// Enhanced message display function
function showMessage(message, type = 'success') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    messageDiv.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(messageDiv);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        messageDiv.classList.add('fade-out');
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 300);
    }, 4000);
}

// Event Listeners - Only add if elements exist
if (profileBtn && profileModal) {
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showModal(profileModal);
    });
}

if (closeProfile && profileModal) {
    closeProfile.addEventListener('click', () => {
        hideModal(profileModal);
    });
}

// Close modals when clicking outside
if (profileModal) {
    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) {
            hideModal(profileModal);
        }
    });
}

if (tokenModal) {
    tokenModal.addEventListener('click', (e) => {
        if (e.target === tokenModal) {
            hideTokenModal();
        }
    });
}

// Token Modal Event Listeners
if (viewTokenBtn) viewTokenBtn.addEventListener('click', showTokenModal);
if (closeToken) closeToken.addEventListener('click', hideTokenModal);
if (copyTokenBtn) copyTokenBtn.addEventListener('click', copyToken);

if (logoutBtn) logoutBtn.addEventListener('click', logout);

// Enhanced keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (profileModal && profileModal.classList.contains('active')) {
            hideModal(profileModal);
        }
        if (tokenModal && tokenModal.classList.contains('active')) {
            hideTokenModal();
        }
    }
});

// Load user data when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    
    // Enhanced animations for page elements
    const animateElements = document.querySelectorAll('.feature-card, .stat-card, .enhanced-card, .player-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// Enhanced hover effects for interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Add enhanced hover effects to cards
    const cards = document.querySelectorAll('.feature-card, .enhanced-card, .player-card, .stat-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .logout-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    button {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Enhanced active nav link highlighting
const currentPath = window.location.pathname;
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    if (linkPath === currentPath) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// Smooth scrolling for anchor links
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

// Enhanced performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData.loadEventEnd - perfData.loadEventStart > 3000) {
                console.warn('Page load time is slower than expected');
            }
        }, 0);
    });
}