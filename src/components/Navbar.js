export function createNavbar(activePage) {
    return `
    <nav class="navbar">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center py-4">
                <div class="flex items-center space-x-2 text-blue-600">
                    <i class="fas fa-futbol text-2xl"></i>
                    <span class="text-xl font-semibold">Soccer Club</span>
                </div>
                <div class="flex items-center space-x-6">
                    <a href="main.html" class="${activePage === 'home' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} flex items-center space-x-1">
                        <i class="fas fa-home"></i>
                        <span>Home</span>
                    </a>
                    <a href="team.html" class="${activePage === 'team' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} flex items-center space-x-1">
                        <i class="fas fa-users"></i>
                        <span>Team</span>
                    </a>
                    <a href="players.html" class="${activePage === 'players' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} flex items-center space-x-1">
                        <i class="fas fa-user"></i>
                        <span>Players</span>
                    </a>
                </div>
                <div class="relative">
                    <button id="profileBtn" class="w-10 h-10 rounded-full gradient-bg text-white flex items-center justify-center">
                        <i class="fas fa-user"></i>
                    </button>
                </div>
            </div>
        </div>
    </nav>`;
} 