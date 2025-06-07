import { TeamService, PlayerService, withErrorHandling } from './services.js';

class TeamManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Create team form submission
        document.getElementById('createTeamForm')?.addEventListener('submit', 
            withErrorHandling(async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const teamData = {
                    name: formData.get('teamName'),
                    location: formData.get('location'),
                    league: formData.get('league'),
                    founded: parseInt(formData.get('founded'))
                };
                await this.createTeam(teamData);
            })
        );

        // Add player form submission
        document.getElementById('addPlayerForm')?.addEventListener('submit',
            withErrorHandling(async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const playerData = {
                    teamId: formData.get('teamId'),
                    roleId: formData.get('roleId'),
                    position: formData.get('position'),
                    jerseyNumber: parseInt(formData.get('jerseyNumber'))
                };
                await this.addPlayer(playerData);
            })
        );

        // Load more teams button
        document.getElementById('loadMoreTeams')?.addEventListener('click',
            withErrorHandling(async () => {
                this.currentPage++;
                await this.loadTeams(this.currentPage);
            })
        );
    }

    async createTeam(teamData) {
        try {
            const response = await TeamService.createTeam(teamData);
            this.displaySuccessMessage('Team created successfully!');
            await this.loadTeams(1); // Refresh the teams list
            return response;
        } catch (error) {
            this.displayErrorMessage(error.message || 'Failed to create team');
            throw error;
        }
    }

    async loadTeams(page = 1) {
        const container = document.getElementById('teamsContainer');
        if (!container) return;

        try {
            // Show loading state
            container.innerHTML = '<div class="loading">Loading teams...</div>';

            const response = await TeamService.getTeams(page, this.itemsPerPage);
            
            if (!response.content || !response.content.data) {
                throw new Error('Invalid response format from server');
            }

            this.displayTeams(response.content.data, page === 1);
            this.updatePagination(response.content.meta);
            return response;
        } catch (error) {
            container.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>${error.message || 'Failed to load teams'}</p>
                    <button class="retry-btn" onclick="teamManager.loadTeams(${page})">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                </div>
            `;
            throw error;
        }
    }

    async loadTeamDetails(teamId) {
        const modal = document.getElementById('teamDetailsModal');
        if (!modal) return;

        const content = modal.querySelector('.modal-content');
        if (!content) return;

        try {
            // Show loading state
            content.innerHTML = '<div class="loading">Loading team details...</div>';
            modal.style.display = 'block';

            const response = await TeamService.getTeamDetails(teamId);
            
            if (!response.content || !response.content.data) {
                throw new Error('Invalid response format from server');
            }

            this.displayTeamDetails(response.content.data);
            return response;
        } catch (error) {
            content.innerHTML = `
                <div class="modal-header">
                    <h2>Error</h2>
                    <button class="close-btn" data-close="teamDetailsModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="error-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>${error.message || 'Failed to load team details'}</p>
                    <button class="retry-btn" onclick="teamManager.loadTeamDetails('${teamId}')">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                </div>
            `;
            throw error;
        }
    }

    async loadTeamPlayers(teamId) {
        try {
            const response = await TeamService.getTeamPlayers(teamId);
            this.displayTeamPlayers(response.content.data);
            return response;
        } catch (error) {
            this.displayErrorMessage('Failed to load team players');
            throw error;
        }
    }

    async addPlayer(playerData) {
        try {
            const response = await PlayerService.addPlayer(playerData);
            this.displaySuccessMessage('Player added successfully!');
            await this.loadTeamPlayers(playerData.teamId); // Refresh the players list
            return response;
        } catch (error) {
            this.displayErrorMessage('Failed to add player');
            throw error;
        }
    }

    async updatePlayer(playerId, playerData) {
        try {
            const response = await PlayerService.updatePlayer(playerId, playerData);
            this.displaySuccessMessage('Player updated successfully!');
            await this.loadTeamPlayers(playerData.teamId); // Refresh the players list
            return response;
        } catch (error) {
            this.displayErrorMessage('Failed to update player');
            throw error;
        }
    }

    // UI Helper Methods
    displayTeams(teams, clearExisting = true) {
        const container = document.getElementById('teamsContainer');
        if (!container) return;

        if (clearExisting) {
            container.innerHTML = '';
        }

        teams.forEach(team => {
            const teamElement = this.createTeamElement(team);
            container.appendChild(teamElement);
        });
    }

    createTeamElement(team) {
        const div = document.createElement('div');
        div.className = 'team-card';
        div.innerHTML = `
            <h3>${team.name}</h3>
            <p><strong>Location:</strong> ${team.location}</p>
            <p><strong>League:</strong> ${team.league}</p>
            <p><strong>Founded:</strong> ${team.founded}</p>
            <button onclick="teamManager.loadTeamDetails('${team.id}')">View Details</button>
        `;
        return div;
    }

    displayTeamDetails(team) {
        const modal = document.getElementById('teamDetailsModal');
        if (!modal) return;

        const content = modal.querySelector('.modal-content');
        if (!content) return;

        content.innerHTML = `
            <div class="modal-header">
                <h2>${team.name}</h2>
                <button class="close-btn" data-close="teamDetailsModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="team-info">
                <p><strong>Location:</strong> ${team.location}</p>
                <p><strong>League:</strong> ${team.league}</p>
                <p><strong>Founded:</strong> ${team.founded}</p>
                <p><strong>Total Players:</strong> ${team.stats.total_players}</p>
                <p><strong>Total Staff:</strong> ${team.stats.total_staff}</p>
            </div>
            <div class="team-actions">
                <button class="primary-btn" onclick="teamManager.showAddPlayerModal('${team.id}')">
                    <i class="fas fa-user-plus"></i> Add Player
                </button>
            </div>
            <div class="players-section">
                <h3>Team Players</h3>
                <div id="playersContainer" class="players-grid"></div>
            </div>
        `;

        modal.style.display = 'block';
        // Load team players immediately
        this.loadTeamPlayers(team.id);
    }

    showAddPlayerModal(teamId) {
        const modal = document.getElementById('addPlayerModal');
        if (!modal) return;

        // Set the team ID in the hidden input
        const teamIdInput = document.getElementById('teamId');
        if (teamIdInput) {
            teamIdInput.value = teamId;
        }

        // Show the modal
        modal.classList.add('active');
        modal.querySelector('.modal-content').style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'translateY(0)';
    }

    displayTeamPlayers(players) {
        const container = document.getElementById('playersContainer');
        if (!container) return;

        if (players.length === 0) {
            container.innerHTML = '<p class="no-players">No players added yet.</p>';
            return;
        }

        container.innerHTML = '';
        players.forEach(player => {
            const playerElement = this.createPlayerElement(player);
            container.appendChild(playerElement);
        });
    }

    createPlayerElement(player) {
        const div = document.createElement('div');
        div.className = 'player-card';
        div.innerHTML = `
            <div class="player-header">
                <h4>${player.name}</h4>
                <span class="jersey-number">#${player.jersey_number}</span>
            </div>
            <div class="player-info">
                <p><strong>Position:</strong> ${player.position}</p>
                <p><strong>Joined:</strong> ${new Date(player.joined_at).toLocaleDateString()}</p>
            </div>
            <div class="player-actions">
                <button class="edit-btn" onclick="teamManager.showEditPlayerModal('${player.id}')">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        `;
        return div;
    }

    showEditPlayerModal(playerId) {
        // Implementation for editing player details
        console.log('Edit player:', playerId);
        // You can implement the edit functionality here
    }

    updatePagination(meta) {
        const loadMoreBtn = document.getElementById('loadMoreTeams');
        if (!loadMoreBtn) return;

        loadMoreBtn.style.display = 
            this.currentPage < meta.total_pages ? 'block' : 'none';
    }

    displaySuccessMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message success';
        messageDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.classList.add('fade-out');
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }

    displayErrorMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message error';
        messageDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.classList.add('fade-out');
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
}

// Initialize the team manager
const teamManager = new TeamManager();
export default teamManager; 