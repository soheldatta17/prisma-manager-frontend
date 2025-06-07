import { createNavbar } from '../../components/Navbar.js';
import { createPlayerCard } from '../../components/PlayerCard.js';
import { isAuthenticated, logout, showMessage } from './utils.js';

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // Setup navigation
    const currentPage = getCurrentPage();
    document.querySelector('nav').outerHTML = createNavbar(currentPage);

    // Setup profile button
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            if (confirm('Do you want to logout?')) {
                logout();
            }
        });
    }

    // Initialize page-specific content
    initializePageContent(currentPage);
});

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('team.html')) return 'team';
    if (path.includes('players.html')) return 'players';
    return 'home';
}

function initializePageContent(page) {
    switch (page) {
        case 'team':
            initializeTeamPage();
            break;
        case 'players':
            initializePlayersPage();
            break;
        default:
            initializeHomePage();
    }
}

function initializeTeamPage() {
    // Add team-specific initialization here
    console.log('Team page initialized');
}

function initializePlayersPage() {
    // Add players-specific initialization here
    console.log('Players page initialized');
}

function initializeHomePage() {
    // Add home-specific initialization here
    console.log('Home page initialized');
} 