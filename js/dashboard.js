// Dashboard Management System
class DashboardManager {
    constructor() {
        this.currentUser = authManager.getCurrentUser();
        this.currentSection = 'overview';
        this.init();
    }

    // Initialize dashboard
    init() {
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        this.setupNavigation();
        this.loadUserData();
        this.setupEventListeners();
        this.loadDashboardData();
    }

    // Setup sidebar navigation
    setupNavigation() {
        const menuItems = document.querySelectorAll('.menu-item');
        const sections = document.querySelectorAll('.dashboard-section');

        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = item.getAttribute('href').substring(1);
                
                // Update active menu item
                menuItems.forEach(mi => mi.classList.remove('active'));
                item.classList.add('active');
                
                // Show target section
                sections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === targetSection) {
                        section.classList.add('active');
                        this.currentSection = targetSection;
                        this.loadSectionData(targetSection);
                    }
                });
            });
        });
    }

    // Load user data into UI
    loadUserData() {
        const userData = authManager.getUserData(this.currentUser.email);
        if (!userData) return;

        // Update user name displays
        document.getElementById('userName').textContent = userData.name;
        document.getElementById('welcomeName').textContent = userData.name;
        
        // Update user avatar
        const avatarImg = document.querySelector('.user-avatar');
        if (avatarImg) {
            avatarImg.src = userData.avatar;
            avatarImg.alt = userData.name;
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Dropdown menu
        const dropdownBtn = document.querySelector('.dropdown-btn');
        const dropdownMenu = document.querySelector('.dropdown-menu');
        
        if (dropdownBtn && dropdownMenu) {
            dropdownBtn.addEventListener('click', () => {
                dropdownMenu.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.dropdown')) {
                    dropdownMenu.classList.remove('show');
                }
            });
        }

        // Logout functionality
        const logoutLink = document.querySelector('a[href="index.html"]');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                authManager.logout();
            });
        }

        // Book action buttons
        this.setupBookActions();
        
        // Search functionality
        this.setupSearch();
    }

    // Setup book action buttons
    setupBookActions() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-borrow') || e.target.closest('.btn-borrow')) {
                e.preventDefault();
                const bookCard = e.target.closest('.book-card') || e.target.closest('.carousel-book');
                if (bookCard) {
                    this.borrowBook(bookCard);
                }
            }

            if (e.target.matches('.btn-return') || e.target.closest('.btn-return')) {
                e.preventDefault();
                const bookCard = e.target.closest('.borrowed-book');
                if (bookCard) {
                    this.returnBook(bookCard);
                }
            }

            if (e.target.matches('.btn-renew') || e.target.closest('.btn-renew')) {
                e.preventDefault();
                const bookCard = e.target.closest('.borrowed-book');
                if (bookCard) {
                    this.renewBook(bookCard);
                }
            }

            if (e.target.matches('.btn-favorite') || e.target.closest('.btn-favorite')) {
                e.preventDefault();
                const bookCard = e.target.closest('.book-card');
                if (bookCard) {
                    this.toggleFavorite(bookCard);
                }
            }
        });
    }

    // Setup search functionality
    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        const filterSelect = document.querySelector('.filter-select');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value, this.getFilters());
            });
        }

        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.performSearch(searchInput?.value || '', this.getFilters());
            });
        }
    }

    // Get current filters
    getFilters() {
        const filterSelect = document.querySelector('.filter-select');
        return {
            category: filterSelect?.value || ''
        };
    }

    // Perform search
    performSearch(query, filters) {
        const results = bookManager.searchBooks(query, filters);
        this.displaySearchResults(results);
    }

    // Display search results
    displaySearchResults(books) {
        const booksGrid = document.querySelector('#browse .books-grid');
        if (!booksGrid) return;

        booksGrid.innerHTML = books.map(book => this.createBookCard(book)).join('');
    }

    // Load dashboard data
    loadDashboardData() {
        this.loadOverviewData();
        this.loadBorrowedBooks();
        this.loadRecommendations();
    }

    // Load overview section data
    loadOverviewData() {
        const userData = authManager.getUserData(this.currentUser.email);
        if (!userData) return;

        // Update stats
        const stats = {
            borrowed: userData.borrowedBooks.length,
            overdue: userData.borrowedBooks.filter(book => 
                new Date(book.dueDate) < new Date() && book.status !== 'returned'
            ).length,
            favorites: userData.favorites.length,
            totalRead: userData.readingHistory.length
        };

        this.updateStatCards(stats);
        this.updateReadingProgress(userData);
    }

    // Update stat cards
    updateStatCards(stats) {
        const statCards = document.querySelectorAll('.stat-card');
        if (statCards.length >= 4) {
            statCards[0].querySelector('h3').textContent = stats.borrowed;
            statCards[1].querySelector('h3').textContent = stats.overdue;
            statCards[2].querySelector('h3').textContent = stats.favorites;
            statCards[3].querySelector('h3').textContent = stats.totalRead;
        }
    }

    // Update reading progress
    updateReadingProgress(userData) {
        const monthlyProgress = (userData.readingGoals.monthly.completed / userData.readingGoals.monthly.target) * 100;
        const progressFill = document.querySelector('.progress-fill');
        const progressPercentage = document.querySelector('.progress-percentage');
        
        if (progressFill) {
            progressFill.style.width = `${monthlyProgress}%`;
        }
        if (progressPercentage) {
            progressPercentage.textContent = `${Math.round(monthlyProgress)}%`;
        }

        // Update streak
        const streakCount = document.querySelector('.streak-count');
        if (streakCount) {
            streakCount.textContent = `${userData.readingStreak} days`;
        }

        // Update pages read
        const pagesCount = document.querySelector('.pages-count');
        if (pagesCount) {
            pagesCount.textContent = userData.totalPagesRead.toLocaleString();
        }
    }

    // Load borrowed books
    loadBorrowedBooks() {
        const userData = authManager.getUserData(this.currentUser.email);
        if (!userData) return;

        const borrowedBooksContainer = document.querySelector('.borrowed-books-list');
        if (!borrowedBooksContainer) return;

        const borrowedBooksHTML = userData.borrowedBooks.map(book => 
            this.createBorrowedBookCard(book)
        ).join('');

        borrowedBooksContainer.innerHTML = borrowedBooksHTML || '<p>No borrowed books</p>';
    }

    // Load recommendations
    loadRecommendations() {
        const userData = authManager.getUserData(this.currentUser.email);
        if (!userData) return;

        const recommendations = bookManager.getRecommendations(
            userData.favorites,
            userData.readingHistory,
            6
        );

        const suggestionsCarousel = document.querySelector('.suggestions-carousel');
        if (suggestionsCarousel) {
            suggestionsCarousel.innerHTML = recommendations.map(book => 
                this.createCarouselBook(book)
            ).join('');
        }
    }

    // Load section-specific data
    loadSectionData(section) {
        switch (section) {
            case 'browse':
                this.loadBrowseBooks();
                break;
            case 'favorites':
                this.loadFavoriteBooks();
                break;
            case 'reading-progress':
                this.loadReadingProgressData();
                break;
            case 'recommendations':
                this.loadRecommendationsData();
                break;
            case 'notifications':
                this.loadNotifications();
                break;
        }
    }

    // Load browse books
    loadBrowseBooks() {
        const availableBooks = bookManager.getAvailableBooks();
        this.displaySearchResults(availableBooks);
    }

    // Load favorite books
    loadFavoriteBooks() {
        const userData = authManager.getUserData(this.currentUser.email);
        if (!userData) return;

        const favoriteBooks = userData.favorites.map(id => bookManager.getBook(id)).filter(Boolean);
        const favoritesGrid = document.querySelector('#favorites .books-grid');
        
        if (favoritesGrid) {
            favoritesGrid.innerHTML = favoriteBooks.map(book => 
                this.createBookCard(book, true)
            ).join('') || '<p>No favorite books yet</p>';
        }
    }

    // Load reading progress data
    loadReadingProgressData() {
        const userData = authManager.getUserData(this.currentUser.email);
        if (!userData) return;

        // Update progress cards
        this.updateReadingProgress(userData);

        // Load currently reading book
        const currentlyReading = userData.borrowedBooks[0]; // Assume first book is currently reading
        if (currentlyReading) {
            const readingBookContainer = document.querySelector('.reading-book');
            if (readingBookContainer) {
                readingBookContainer.innerHTML = this.createCurrentlyReadingCard(currentlyReading);
            }
        }
    }

    // Load recommendations data
    loadRecommendationsData() {
        const userData = authManager.getUserData(this.currentUser.email);
        if (!userData) return;

        const recommendations = bookManager.getRecommendations(
            userData.favorites,
            userData.readingHistory,
            10
        );

        const recommendationContainer = document.querySelector('.recommendation-categories');
        if (recommendationContainer) {
            recommendationContainer.innerHTML = this.createRecommendationCategories(recommendations);
        }
    }

    // Load notifications
    loadNotifications() {
        const userData = authManager.getUserData(this.currentUser.email);
        if (!userData) return;

        const notificationsContainer = document.querySelector('#notifications .notifications-list');
    }
}

// Create book card HTML
function createBookCard(book, isFavorite = false) {
    const favoriteClass = isFavorite ? 'favorited' : '';
    
    return `
        <div class="book-card ${favoriteClass}" data-book-id="${book.id}">
            <div class="book-cover-container">
                <img src="${book.cover}" alt="${book.title}" class="book-cover" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjNEY0NkU1Ii8+CjxyZWN0IHg9IjIwIiB5PSI0MCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIyMjAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSI3MCIgeT0iMTIwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNMTQgMlY4TDIwIDJNMjAgMlYxNEgyMFYyMEMxOSAyMSAxOCAyMiAxNyAyMkg3QzYgMjIgNSAyMSA0IDIwVjRDNCAzIDUgMiA2IDJIMTRaIi8+Cjwvc3ZnPgo8L3N2Zz4K';">
                <div class="book-overlay">
                    <div class="book-actions">
                        ${book.available ? 
                            `<button class="btn-borrow" onclick="borrowBook('${book.id}')">
                                <i class="fas fa-plus"></i> Borrow
                            </button>` : 
                            `<span class="unavailable">Unavailable</span>`
                        }
                        <button class="btn-favorite ${isFavorite ? 'active' : ''}" 
                                onclick="toggleFavorite('${book.id}')">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="book-info">
                <h4>${book.title}</h4>
                <p class="book-author">${book.author}</p>
                <div class="book-rating">
                    ${'★'.repeat(Math.floor(book.rating))}${'☆'.repeat(5-Math.floor(book.rating))}
                    <span class="rating-text">${book.rating}</span>
                </div>
                <p class="book-genre">${book.genre}</p>
            </div>
        </div>
    `;
}

// Create borrowed book card HTML
function createBorrowedBookCard(book) {
    const statusClass = book.status === 'overdue' ? 'overdue' : 
                       book.status === 'due-soon' ? 'due-soon' : '';
    
    return `
        <div class="borrowed-book" data-book-id="${book.id}">
            <div class="borrowed-book-cover-image">
                <img src="${book.cover}" alt="${book.title}" loading="lazy" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjNEY0NkU1Ii8+CjxyZWN0IHg9IjIwIiB5PSI0MCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIyMjAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSI3MCIgeT0iMTIwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNMTQgMlY4TDIwIDJNMjAgMlYxNEgyMFYyMEMxOSAyMSAxOCAyMiAxNyAyMkg3QzYgMjIgNSAyMSA0IDIwVjRDNCAzIDUgMiA2IDJIMTRaIi8+Cjwvc3ZnPgo8L3N2Zz4K';">
            </div>
            <div class="borrowed-book-info">
                <h3>${book.title}</h3>
                <p>by ${book.author}</p>
                <p class="due-date ${statusClass}">Due: ${formatDate(book.dueDate)}</p>
                <p class="renewals">Renewals: ${book.renewals}/2</p>
            </div>
            <div class="borrowed-book-actions">
                <button class="btn btn-primary btn-small btn-renew ${book.renewals >= 2 ? 'disabled' : ''}"
                        ${book.renewals >= 2 ? 'disabled' : ''}>
                    ${book.renewals >= 2 ? 'Max Renewals' : 'Renew'}
                </button>
                <button class="btn btn-secondary btn-small btn-return">Return</button>
            </div>
        </div>
    `;
}

// Create carousel book HTML
function createCarouselBook(book) {
    return `
        <div class="carousel-book" data-book-id="${book.id}">
            <div class="carousel-book-cover">
                <img src="${book.cover}" alt="${book.title}" loading="lazy"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjNEY0NkU1Ii8+CjxyZWN0IHg9IjIwIiB5PSI0MCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIyMjAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSI3MCIgeT0iMTIwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNMTQgMlY4TDIwIDJNMjAgMlYxNEgyMFYyMEMxOSAyMSAxOCAyMiAxNyAyMkg3QzYgMjIgNSAyMSA0IDIwVjRDNCAzIDUgMiA2IDJIMTRaIi8+Cjwvc3ZnPgo8L3N2Zz4K';">
            </div>
            <h4>${book.title}</h4>
            <p>${book.author}</p>
            <div class="book-rating">
                ${'★'.repeat(Math.floor(book.rating))}${'☆'.repeat(5-Math.floor(book.rating))}
            </div>
            <button class="btn btn-primary btn-small btn-borrow">Borrow</button>
        </div>
    `;
}

// Create currently reading card HTML
function createCurrentlyReadingCard(book) {
    const progress = Math.floor(Math.random() * 100); // Simulated progress
    const currentPage = Math.floor((progress / 100) * 180);
    
    return `
        <div class="reading-book-cover">
            <img src="${book.cover}" alt="${book.title}" loading="lazy"
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjNEY0NkU1Ii8+CjxyZWN0IHg9IjIwIiB5PSI0MCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIyMjAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSI3MCIgeT0iMTIwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNMTQgMlY4TDIwIDJNMjAgMlYxNEgyMFYyMEMxOSAyMSAxOCAyMiAxNyAyMkg3QzYgMjIgNSAyMSA0IDIwVjRDNCAzIDUgMiA2IDJIMTRaIi8+Cjwvc3ZnPgo8L3N2Zz4K';">
        </div>
        <div class="reading-info">
            <h4>${book.title}</h4>
            <p>by ${book.author}</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <p class="progress-text">Page ${currentPage} of ${book.pages} (${progress}%)</p>
        </div>
    `;
}

// Create star rating HTML
function createStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let starsHTML = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Borrow book
function borrowBook(bookElement) {
    const bookId = bookElement.dataset.bookId;
    const book = bookManager.getBook(bookId);
    
    if (!book || !book.available) {
        showNotification('Book is not available', 'error');
        return;
    }

    const result = authManager.borrowBook(book);
    if (result.success) {
        showNotification('Book borrowed successfully!', 'success');
        bookManager.updateBookAvailability(bookId, false);
        dashboardManager.refreshCurrentSection();
    } else {
        showNotification(result.message, 'error');
    }
}

// Return book
function returnBook(bookElement) {
    const bookId = bookElement.dataset.bookId;
    const result = authManager.returnBook(bookId);
    
    if (result.success) {
        showNotification('Book returned successfully!', 'success');
        bookManager.updateBookAvailability(bookId, true);
        dashboardManager.refreshCurrentSection();
    } else {
        showNotification(result.message, 'error');
    }
}

// Renew book
function renewBook(bookElement) {
    const bookId = bookElement.dataset.bookId;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userData = authManager.getUserData(currentUser.email);
    const book = userData.borrowedBooks.find(b => b.id === bookId);
    
    if (book && book.renewals < 2) {
        book.renewals++;
        const newDueDate = new Date(book.dueDate);
        newDueDate.setDate(newDueDate.getDate() + 14);
        book.dueDate = newDueDate.toISOString().split('T')[0];
        
        authManager.updateUserData(currentUser.email, userData);
        showNotification('Book renewed successfully!', 'success');
        dashboardManager.refreshCurrentSection();
    } else {
        showNotification('Maximum renewals reached', 'error');
    }
}

// Toggle favorite
function toggleFavorite(bookElement) {
    const bookId = bookElement.dataset.bookId;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userData = authManager.getUserData(currentUser.email);
    
    if (userData.favorites.includes(bookId)) {
        authManager.removeFromFavorites(bookId);
        showNotification('Removed from favorites', 'info');
    } else {
        authManager.addToFavorites(bookId);
        showNotification('Added to favorites', 'success');
    }
    
    dashboardManager.refreshCurrentSection();
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                       type === 'error' ? 'fa-exclamation-circle' : 
                       'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Refresh current section
function refreshCurrentSection() {
    if (window.dashboardManager) {
        dashboardManager.loadSectionData(dashboardManager.currentSection);
        if (dashboardManager.currentSection === 'overview') {
            dashboardManager.loadOverviewData();
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});
