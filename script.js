
const API_KEY_WEATHER = "ccd4d02e1478725181a80d9585055a4c"; // NOTE: Replace with a real key for live weather
let currentView = 'login';
let loggedInUser = localStorage.getItem('ge_user');
const defaultBio = "Adventure Enthusiast | World Traveler | Digital Nomad";

// Structured Destination Data (Simulating a database/API response)
const destinations = [
    { name: "Tokyo, Japan", slug: "tokyo", lat: 35.6895, lon: 139.6917, category: "City & Culture", description: "Tokyo, Japan's bustling capital, mixes the ultramodern with traditional temples. Experience neon-lit skyscrapers, historic shrines, and world-class cuisine.", image: "https://res.cloudinary.com/aenetworks/image/upload/c_fill,ar_2,w_3840,h_1920,g_auto/dpr_auto/f_auto/q_auto:eco/v1/gettyimages-1390815938?_a=BAVAZGID0" },
    { name: "Paris, France", slug: "paris", lat: 48.8566, lon: 2.3522, category: "City & Romance", description: "The 'City of Light,' known for the Eiffel Tower, Louvre Museum, and world-renowned fashion and cuisine.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/TourEiffelLC.JPG/250px-TourEiffelLC.JPG" },
    { name: "Rome, Italy", slug: "rome", lat: 41.9028, lon: 12.4964, category: "History & Heritage", description: "Rome, the capital of Italy, is a city of immense historical significance, home to the Colosseum and Vatican City.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi1omkNzuPW2KPP7vHxkcWSuSX1eL7qc-BZw&s" },
    { name: "Ooty, India", slug: "ooty", lat: 11.4064, lon: 76.6932, category: "Hill Station & Nature", description: "A scenic hill station in Tamil Nadu, famous for its picturesque landscapes, tea gardens, and the Nilgiri Mountain Railway.", image: "https://www.tatacapital.com/blog/wp-content/uploads/2024/01/top-things-to-do-in-ooty.jpg" },
    { name: "New York, USA", slug: "new_york", lat: 40.7128, lon: -74.0060, category: "Urban & Entertainment", description: "The 'Big Apple,' a global hub for art, commerce, and culture, featuring Times Square and Central Park.", image: "https://cdn.britannica.com/61/93061-050-99147DCE/Statue-of-Liberty-Island-New-York-Bay.jpg" },
    { name: "Istanbul, Turkey", slug: "istanbul", lat: 41.0082, lon: 28.9784, category: "Crossroads & Architecture", description: "A transcontinental city famous for Hagia Sophia, the Blue Mosque, and its historical role bridging Europe and Asia.", image: "https://images.contentstack.io/v3/assets/blt06f605a34f1194ff/blt289d3aab2da77bc9/6777f31f93a84b03b5a37ef2/BCC-2023-EXPLORER-Istanbul-Fun-things-to-do-in-Istanbul-HEADER_MOBILE.jpg?format=webp&quality=60&width=1440" },
];
function toast(message, duration = 2500) {
    const t = document.getElementById('app-toast');
    if (!t) return console.log("Toast: " + message);
    
    t.textContent = message;
    t.classList.add('show');
    setTimeout(() => {
        t.classList.remove('show');
    }, duration);
}

/** Toggles dark/light mode */
function toggleTheme() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('ge_theme', isDark ? 'dark' : 'light');
    document.getElementById('theme-icon').textContent = isDark ? '☀️' : '🌙';
}

/** Initialize theme on load */
function initTheme() {
    document.getElementById('theme-toggle').onclick = toggleTheme;
    const savedTheme = localStorage.getItem('ge_theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        document.getElementById('theme-icon').textContent = '☀️';
    }
}


// ===============================================
// AUTHENTICATION & NAVIGATION
// ===============================================

/** Flips the login/signup flashcard */
function flipCard() {
    document.getElementById('flashcard').classList.toggle('flipped');
    // Clear messages when flipping
    document.getElementById('login-msg').textContent = '';
    document.getElementById('signup-msg').textContent = '';
}

/** Handles user login */
function login() {
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();
    const msgEl = document.getElementById('login-msg');

    if (user.length < 3 || pass.length < 4) {
        msgEl.textContent = 'Please enter valid credentials.';
        return;
    }
    
    // In a real app, you would verify user/pass here.
    loggedInUser = user;
    localStorage.setItem('ge_user', user);
    localStorage.setItem('ge_profile_name', user); // Set default profile name
    toast(`Welcome back, ${user}!`);
    showView('home');
}

/** Handles user signup */
function signup() {
    const user = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const pass = document.getElementById('signup-password').value;
    const confirmPass = document.getElementById('signup-confirm').value;
    const msgEl = document.getElementById('signup-msg');

    if (!user || !email || pass.length < 6 || pass !== confirmPass) {
        msgEl.textContent = 'Check fields: Username/Email, Password must be 6+ chars and match.';
        return;
    }
    
    toast('Account created! Please login.');
    document.getElementById('flashcard').classList.remove('flipped'); // Flip back to login
    msgEl.textContent = '';
}

/** Handles user logout */
function logout() {
    localStorage.removeItem('ge_user');
    localStorage.removeItem('ge_wishlist');
    loggedInUser = null;
    toast('Logged out successfully!');
    showView('login');
}

/**
 * Main routing function to switch between app views.
 * @param {string} view - 'login', 'home', 'destinations', 'gallery', 'wishlist', 'profile'
 */
function showView(view) {
    currentView = view;
    const mainContent = document.getElementById('app-main-content');
    const loginView = document.getElementById('login-signup-view');
    
    if (view === 'login') {
        loginView.style.display = 'flex';
        mainContent.innerHTML = '';
        updateNavbar();
        return;
    }
    
    // If user is not logged in, force redirect to login
    if (!loggedInUser) {
         if (view !== 'login') {
            showView('login');
            toast('Please log in to access the app.');
            return;
        }
    }

    loginView.style.display = 'none';
    mainContent.innerHTML = '';
    updateNavbar();
    
    // Render the specific view content
    switch(view) {
        case 'home': renderHomeView(mainContent); break;
        case 'destinations': renderDestinationsView(mainContent); break;
        case 'gallery': renderGalleryView(mainContent); break;
        case 'wishlist': renderWishlistView(mainContent); break;
        case 'profile': renderProfileView(mainContent); break;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/** Updates the navigation bar links and buttons based on auth state */
function updateNavbar() {
    const navContainer = document.getElementById('nav-links-container');
    const authButton = document.getElementById('auth-button');
    navContainer.innerHTML = '';

    const links = [
        { name: 'Home', view: 'home' },
        { name: 'Destinations', view: 'destinations' },
        { name: 'Gallery', view: 'gallery' },
        { name: 'Wishlist', view: 'wishlist' },
        { name: 'Profile', view: 'profile' }, // Added explicit profile link
    ];

    if (loggedInUser) {
        links.forEach(link => {
            navContainer.innerHTML += `<a class="nav-link" onclick="showView('${link.view}')">${link.name}</a>`;
        });
        authButton.textContent = 'Logout';
        authButton.onclick = logout;
        authButton.classList.remove('btn-ghost');
        authButton.classList.add('btn-primary');
    } else {
        authButton.textContent = 'Login/Signup';
        authButton.onclick = () => showView('login');
        authButton.classList.remove('btn-primary');
        authButton.classList.add('btn-ghost');
    }
}
function renderHomeView(container) {
    const userProfileName = localStorage.getItem('ge_profile_name') || loggedInUser;
    container.innerHTML = `
        <div class="app-container">
            <!-- Profile Card -->
            <div class="card p-6 flex flex-col md:flex-row items-center gap-6 mb-8">
                <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                    <img src="https://placehold.co/100x100/0077b6/ffffff?text=${userProfileName.charAt(0).toUpperCase()}" alt="Profile Avatar" class="w-full h-full object-cover">
                </div>
                <div>
                    <h1 class="text-3xl font-extrabold text-gray-800" id="profile-display-name">${userProfileName}</h1>
                    <p class="text-gray-500 mb-4">${localStorage.getItem('ge_profile_bio') || defaultBio}</p>
                    <button onclick="showView('profile')" class="btn btn-primary text-sm">Edit Profile</button>
                </div>
            </div>
            
            <!-- Popular Destinations -->
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold">Popular Destinations</h2>
                <button onclick="showView('destinations')" class="text-sm text-gray-500 hover:text-gray-800 transition">View All →</button>
            </div>
            <div class="destination-grid">
                ${destinations.slice(0, 3).map(d => createDestinationCard(d)).join('')}
            </div>
        </div>
    `;
}

/** Renders the full destinations list with search */
function renderDestinationsView(container) {
    container.innerHTML = `
        <div class="app-container">
            <h2 class="text-3xl font-bold mb-6">Discover Your Next Adventure</h2>
            <input type="text" id="dest-search" oninput="filterDestinations()" placeholder="Search by place name or category..." class="w-full p-3 mb-6 rounded-lg border border-gray-300 focus:border-primary transition">
            <div class="destination-grid" id="full-destination-list">
                ${destinations.map(d => createDestinationCard(d)).join('')}
            </div>
        </div>
    `;
}

/** Filters destinations based on search input */
function filterDestinations() {
    const query = document.getElementById('dest-search').value.toLowerCase();
    const listContainer = document.getElementById('full-destination-list');
    listContainer.innerHTML = '';

    const filtered = destinations.filter(d => 
        d.name.toLowerCase().includes(query) || 
        d.category.toLowerCase().includes(query) || 
        d.description.toLowerCase().includes(query)
    );

    if (filtered.length > 0) {
        listContainer.innerHTML = filtered.map(d => createDestinationCard(d)).join('');
    } else {
        listContainer.innerHTML = `<p class="text-center text-gray-500 py-12">No destinations found matching "${query}".</p>`;
    }
}

/** Renders the gallery view with images and lightbox */
function renderGalleryView(container) {
    container.innerHTML = `
        <div class="app-container">
            <h2 class="text-3xl font-bold mb-6">Inspirational Photo Gallery</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                ${destinations.map(d => `
                    <div class="relative overflow-hidden rounded-xl shadow-lg cursor-pointer hover:shadow-2xl transition duration-300" onclick="openLightbox('${d.slug}')">
                        <img src="${d.image}" alt="${d.name}" class="w-full h-48 object-cover">
                        <div class="absolute inset-0 bg-black/30 flex items-end p-3 opacity-0 hover:opacity-100 transition">
                            <p class="text-white font-semibold">${d.name}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        <!-- Lightbox implementation is external to the main container -->
    `;
}

/** Renders the wishlist view */
function renderWishlistView(container) {
    const wishlist = JSON.parse(localStorage.getItem('ge_wishlist') || '[]');
    container.innerHTML = `
        <div class="app-container">
            <h2 class="text-3xl font-bold mb-6">My Dream Wishlist</h2>
            <div class="destination-grid" id="wishlist-list">
                ${wishlist.length > 0 
                    ? wishlist.map(d => createDestinationCard(d, true)).join('')
                    : '<p class="text-center text-gray-500 py-12 w-full col-span-full">Your wishlist is empty! Explore destinations to add them.</p>'
                }
            </div>
        </div>
    `;
}

/** Renders the profile editing view */
function renderProfileView(container) {
    const currentName = localStorage.getItem('ge_profile_name') || loggedInUser;
    const currentBio = localStorage.getItem('ge_profile_bio') || defaultBio;

    container.innerHTML = `
        <div class="app-container max-w-lg">
            <div class="card">
                <h2 class="text-3xl font-bold mb-6 text-center">Update Profile</h2>
                <div class="mb-4">
                    <label for="edit-name" class="block text-gray-700 font-medium mb-1">Display Name</label>
                    <input type="text" id="edit-name" value="${currentName}" class="w-full p-3 rounded-lg border border-gray-300">
                </div>
                <div class="mb-6">
                    <label for="edit-bio" class="block text-gray-700 font-medium mb-1">Short Bio</label>
                    <textarea id="edit-bio" rows="3" class="w-full p-3 rounded-lg border border-gray-300">${currentBio}</textarea>
                </div>
                <button onclick="saveProfile()" class="btn btn-primary w-full">Save Changes</button>
            </div>
        </div>
    `;
}

/** Saves profile edits to localStorage */
function saveProfile() {
    const newName = document.getElementById('edit-name').value.trim();
    const newBio = document.getElementById('edit-bio').value.trim();

    localStorage.setItem('ge_profile_name', newName);
    localStorage.setItem('ge_profile_bio', newBio);
    
    // Update the greeting element if it exists on the home view
    const profileDisplay = document.getElementById('profile-display-name');
    if (profileDisplay) profileDisplay.textContent = newName;

    toast('Profile updated successfully!');
    showView('home');
}

function createDestinationCard(dest, isWishlist = false) {
    const wishlist = JSON.parse(localStorage.getItem('ge_wishlist') || '[]');
    const isInWishlist = wishlist.some(d => d.slug === dest.slug);
    const actionText = isWishlist ? 'Remove' : (isInWishlist ? '★ Added' : 'Add to Wishlist');
    const actionClass = isWishlist ? 'btn-ghost' : (isInWishlist ? 'bg-green-500 text-white cursor-default' : 'btn-ghost');
    const actionFunction = isWishlist ? `removeFromWishlist('${dest.slug}')` : `addToWishlist('${dest.slug}')`;

    return `
        <div class="card dest-card overflow-hidden">
            <img src="${dest.image}" alt="${dest.name}" onerror="this.onerror=null; this.src='https://placehold.co/600x400/90e0ef/0077b6?text=Image+Error'">
            <div class="dest-card-body">
                <h3>${dest.name}</h3>
                <p class="mb-3">${dest.description.substring(0, 60)}...</p>
                <div class="flex justify-between items-center gap-2 mt-auto">
                    <button onclick="openModal('${dest.slug}')" class="btn btn-primary py-2 px-3 text-sm">View Details</button>
                    <button onclick="${actionFunction}" class="btn ${actionClass} py-2 px-3 text-sm" ${isInWishlist && !isWishlist ? 'disabled' : ''}>${actionText}</button>
                </div>
            </div>
        </div>
    `;
}
let mapInstance = null;
let currentDest = null;
function openModal(slug) {
    currentDest = destinations.find(d => d.slug === slug);
    if (!currentDest) return toast('Destination data not found.');

    const modal = document.getElementById('destination-modal');
    const nameEl = document.getElementById('modal-name');
    const categoryEl = document.getElementById('modal-category');
    const descEl = document.getElementById('modal-description');
    const imageEl = document.getElementById('modal-image');
    const bookLinkEl = document.getElementById('modal-book-link');
    const wishlistBtn = document.getElementById('modal-add-wishlist');

    // 1. Populate Text Content
    nameEl.textContent = currentDest.name;
    categoryEl.textContent = currentDest.category;
    descEl.textContent = currentDest.description;
    imageEl.src = currentDest.image;
    bookLinkEl.href = `https://www.google.com/search?q=${encodeURIComponent('book flight and stay in ' + currentDest.name)}`;
    
    // 2. Set Wishlist Button Action
    const isInWishlist = JSON.parse(localStorage.getItem('ge_wishlist') || '[]').some(d => d.slug === slug);
    wishlistBtn.textContent = isInWishlist ? '★ Added to Wishlist' : 'Add to Wishlist';
    wishlistBtn.disabled = isInWishlist;
    wishlistBtn.onclick = () => addToWishlist(currentDest.slug, true);

    // 3. Show Modal
    modal.classList.add('open');
    setTimeout(() => {
        renderMap(currentDest.lat, currentDest.lon);
        fetchWeather(currentDest.lat, currentDest.lon, currentDest.name);
    }, 300);
}
function closeModal() {
    document.getElementById('destination-modal').classList.remove('open');
    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
    }
}
function renderMap(lat, lon) {
    const mapContainer = document.getElementById('modal-map');
    if (mapInstance) {
        mapInstance.remove(); 
    }
    mapContainer.innerHTML = ''; 
    try {
        mapInstance = L.map('modal-map', {
            scrollWheelZoom: false 
        }).setView([lat, lon], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapInstance);

        L.marker([lat, lon]).addTo(mapInstance)
            .bindPopup(currentDest.name)
            .openPopup();
    } catch (error) {
        mapContainer.innerHTML = '<div class="flex justify-center items-center h-full text-gray-500">Map failed to load.</div>';
        console.error("Leaflet Map Error:", error);
    }
}
function fetchWeather(lat, lon, city) {
    const weatherEl = document.getElementById('modal-weather');
    weatherEl.innerHTML = '<div class="text-gray-500">Loading live weather...</div>';
    setTimeout(() => {
        const weatherData = {
            temp: (20 + (Math.random() * 10)).toFixed(1), // 20.0 to 30.0
            condition: ["Sunny", "Cloudy", "Rain Showers", "Arctic Chill"][Math.floor(Math.random() * 4)],
            wind: (5 + (Math.random() * 15)).toFixed(1)
        };

        weatherEl.innerHTML = `
            <div class="flex items-center gap-4">
                <span class="text-4xl">
                    ${weatherData.condition.includes('Sun') ? '☀️' : weatherData.condition.includes('Cloudy') ? '☁️' : '🌧️'}
                </span>
                <div>
                    <p class="text-2xl font-bold">${weatherData.temp}°C</p>
                    <p class="text-gray-600">${weatherData.condition} in ${city}</p>
                    <p class="text-xs text-gray-400">Wind: ${weatherData.wind} km/h</p>
                </div>
            </div>
        `;
    }, 1200);
}
function addToWishlist(slug, fromModal = false) {
    const dest = destinations.find(d => d.slug === slug);
    if (!dest) return;
    const list = JSON.parse(localStorage.getItem('ge_wishlist') || '[]');
    if (list.some(d => d.slug === slug)) {
        toast(`${dest.name} is already in your wishlist!`);
        return;
    }
    list.push(dest);
    localStorage.setItem('ge_wishlist', JSON.stringify(list));
    toast(`Added ${dest.name} to Wishlist!`);
    if (fromModal) {
        const wishlistBtn = document.getElementById('modal-add-wishlist');
        if(wishlistBtn) {
            wishlistBtn.textContent = '★ Added to Wishlist';
            wishlistBtn.disabled = true;
        }
        closeModal();
    }
    if (currentView === 'destinations' || currentView === 'wishlist') showView(currentView);
}
function removeFromWishlist(slug) {
    let list = JSON.parse(localStorage.getItem('ge_wishlist') || '[]');
    list = list.filter(d => d.slug !== slug);
    localStorage.setItem('ge_wishlist', JSON.stringify(list));
    toast('Destination removed from wishlist.');
    showView('wishlist');
}
function openLightbox(slug) {
    const dest = destinations.find(d => d.slug === slug);
    if (!dest) return;
    let lb = document.getElementById('app-lightbox');
    if (!lb) {
        lb = document.createElement('div');
        lb.id = 'app-lightbox';
        lb.className = 'fixed inset-0 bg-black/80 z-[4000] flex justify-center items-center transition-opacity duration-300 opacity-0 pointer-events-none';
        lb.innerHTML = `
            <button onclick="closeLightbox()" class="absolute top-6 right-6 text-white text-3xl z-50 hover:scale-110 transition">✕</button>
            <div class="max-w-4xl max-h-[90vh] p-4">
                <img id="lightbox-img" class="rounded-lg shadow-2xl max-w-full max-h-[85vh] object-contain" src="" alt="">
                <p id="lightbox-caption" class="text-white text-center mt-3 font-medium text-lg"></p>
            </div>
        `;
        document.body.appendChild(lb);
    }

    document.getElementById('lightbox-img').src = dest.image;
    document.getElementById('lightbox-caption').textContent = dest.name;
    lb.classList.add('opacity-100', 'pointer-events-auto');
}
function closeLightbox() {
    const lightbox = document.getElementById('app-lightbox');
    if (lightbox) {
        lightbox.classList.remove('opacity-100', 'pointer-events-auto');
    }
}
function initApp() {
    initTheme();
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (document.getElementById('destination-modal').classList.contains('open')) {
                closeModal();
            }
            const lightbox = document.getElementById('app-lightbox');
            if (lightbox && lightbox.classList.contains('opacity-100')) {
                closeLightbox();
            }
        }
    });
    if (loggedInUser) {
        showView('home');
    } else {
        showView('login');
    }
}
window.onload = initApp;
