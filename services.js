// API Base URL - replace with your actual API base URL
const API_BASE_URL = 'http://localhost:3000/v1';

// Helper function to get auth token from cookie
function getAuthToken() {
    try {
        const userData = document.cookie.split(';')
            .find(cookie => cookie.trim().startsWith('user_data='));
        
        if (!userData) return null;
        
        const parsedData = JSON.parse(userData.split('=')[1]);
        return parsedData.token;
    } catch (e) {
        console.error('Error getting auth token:', e);
        return null;
    }
}

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error('No authentication token found');
        }

        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `API call failed: ${response.statusText}`);
        }

        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

// Team APIs
export const TeamService = {
    // Create a new team
    async createTeam(teamData) {
        try {
            return await apiCall('/team', {
                method: 'POST',
                body: JSON.stringify(teamData)
            });
        } catch (error) {
            console.error('Create team error:', error);
            throw new Error('Failed to create team: ' + error.message);
        }
    },

    // Get all teams with pagination
    async getTeams(page = 1, limit = 10) {
        try {
            return await apiCall(`/team?page=${page}&limit=${limit}`);
        } catch (error) {
            console.error('Get teams error:', error);
            throw new Error('Failed to load teams: ' + error.message);
        }
    },

    // Get team details
    async getTeamDetails(teamId) {
        try {
            if (!teamId) {
                throw new Error('Team ID is required');
            }
            return await apiCall(`/team/${teamId}`);
        } catch (error) {
            console.error('Get team details error:', error);
            throw new Error('Failed to load team details: ' + error.message);
        }
    },

    // Get team players
    async getTeamPlayers(teamId) {
        try {
            if (!teamId) {
                throw new Error('Team ID is required');
            }
            return await apiCall(`/team/${teamId}/players`);
        } catch (error) {
            console.error('Get team players error:', error);
            throw new Error('Failed to load team players: ' + error.message);
        }
    }
};

// Player APIs
export const PlayerService = {
    // Add player to team
    async addPlayer(playerData) {
        try {
            if (!playerData.teamId) {
                throw new Error('Team ID is required');
            }
            return await apiCall('/player', {
                method: 'POST',
                body: JSON.stringify(playerData)
            });
        } catch (error) {
            console.error('Add player error:', error);
            throw new Error('Failed to add player: ' + error.message);
        }
    },

    // Update player details
    async updatePlayer(playerId, playerData) {
        try {
            if (!playerId) {
                throw new Error('Player ID is required');
            }
            return await apiCall(`/player/${playerId}`, {
                method: 'PUT',
                body: JSON.stringify(playerData)
            });
        } catch (error) {
            console.error('Update player error:', error);
            throw new Error('Failed to update player: ' + error.message);
        }
    }
};

// Error handling wrapper
export function withErrorHandling(fn) {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            console.error('Operation failed:', error);
            throw error;
        }
    };
} 