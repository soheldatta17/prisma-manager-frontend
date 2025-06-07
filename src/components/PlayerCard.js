export function createPlayerCard(player) {
    return `
    <div class="bg-white rounded-xl overflow-hidden shadow-md card-hover">
        <img src="${player.image || 'https://placehold.co/400x300'}" alt="${player.name}" class="w-full h-48 object-cover">
        <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">${player.name}</h3>
            <p class="text-gray-600 mb-2">${player.position}</p>
            <p class="gradient-text text-3xl font-bold mb-4">#${player.number}</p>
            <div class="flex justify-around pt-4 border-t border-gray-100">
                ${getPlayerStats(player)}
            </div>
        </div>
    </div>`;
}

function getPlayerStats(player) {
    const statsMap = {
        forward: () => `
            <span class="flex items-center space-x-2">
                <i class="fas fa-futbol text-blue-600"></i>
                <span class="text-gray-700">${player.goals}</span>
            </span>
            <span class="flex items-center space-x-2">
                <i class="fas fa-shoe-prints text-blue-600"></i>
                <span class="text-gray-700">${player.assists}</span>
            </span>`,
        midfielder: () => `
            <span class="flex items-center space-x-2">
                <i class="fas fa-futbol text-blue-600"></i>
                <span class="text-gray-700">${player.goals}</span>
            </span>
            <span class="flex items-center space-x-2">
                <i class="fas fa-shoe-prints text-blue-600"></i>
                <span class="text-gray-700">${player.assists}</span>
            </span>`,
        defender: () => `
            <span class="flex items-center space-x-2">
                <i class="fas fa-shield-alt text-blue-600"></i>
                <span class="text-gray-700">${player.tackles}</span>
            </span>
            <span class="flex items-center space-x-2">
                <i class="fas fa-futbol text-blue-600"></i>
                <span class="text-gray-700">${player.goals}</span>
            </span>`,
        goalkeeper: () => `
            <span class="flex items-center space-x-2">
                <i class="fas fa-hand-paper text-blue-600"></i>
                <span class="text-gray-700">${player.saves}</span>
            </span>
            <span class="flex items-center space-x-2">
                <i class="fas fa-times text-blue-600"></i>
                <span class="text-gray-700">${player.cleanSheets}</span>
            </span>`
    };

    const getStats = statsMap[player.type.toLowerCase()] || statsMap.forward;
    return getStats();
} 