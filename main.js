// Get DOM elements
const profileBtn = document.getElementById('profileBtn');
const profileModal = document.getElementById('profileModal');
const closeProfile = document.getElementById('closeProfile');
const logoutBtn = document.getElementById('logoutBtn');

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

// Format date function
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
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${userData.name}!`;
    }
}

// Handle logout
function logout() {
    // Delete the cookie
    document.cookie = 'user_data=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
    // Redirect to login page
    window.location.href = 'index.html';
}

// Token Modal Functions
function showTokenModal() {
    if (!tokenModal) return;
    tokenModal.classList.add('active');
    const content = tokenModal.querySelector('.token-content');
    if (content) {
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
    }
}

function hideTokenModal() {
    if (!tokenModal) return;
    const content = tokenModal.querySelector('.token-content');
    if (content) {
        content.style.opacity = '0';
        content.style.transform = 'translateY(-20px)';
    }
    setTimeout(() => {
        tokenModal.classList.remove('active');
    }, 300);
}

async function copyToken() {
    if (!tokenText || !copyTokenBtn) return;
    try {
        await navigator.clipboard.writeText(tokenText.textContent);
        copyTokenBtn.classList.add('copied');
        copyTokenBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyTokenBtn.classList.remove('copied');
            copyTokenBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Token';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy token:', err);
        alert('Failed to copy token to clipboard');
    }
}

// Event Listeners - Only add if elements exist
if (profileBtn && profileModal) {
    profileBtn.addEventListener('click', () => {
        profileModal.classList.add('active');
        const content = profileModal.querySelector('.profile-content');
        if (content) {
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }
    });
}

if (closeProfile && profileModal) {
    closeProfile.addEventListener('click', () => {
        const content = profileModal.querySelector('.profile-content');
        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'translateY(-20px)';
        }
        setTimeout(() => {
            profileModal.classList.remove('active');
        }, 300);
    });
}

if (profileModal) {
    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal && closeProfile) {
            closeProfile.click();
        }
    });
}

// Token Modal Event Listeners
if (viewTokenBtn) viewTokenBtn.addEventListener('click', showTokenModal);
if (closeToken) closeToken.addEventListener('click', hideTokenModal);
if (copyTokenBtn) copyTokenBtn.addEventListener('click', copyToken);

if (tokenModal) {
    tokenModal.addEventListener('click', (e) => {
        if (e.target === tokenModal) {
            hideTokenModal();
        }
    });
}

if (logoutBtn) logoutBtn.addEventListener('click', logout);

// Load user data when page loads
document.addEventListener('DOMContentLoaded', loadUserData);

// Add hover effect to feature cards
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Add active state to current nav link
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('active');
    }
}); 