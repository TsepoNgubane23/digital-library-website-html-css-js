// Dashboard Management System
class DashboardManager {
    constructor() {
        this.currentUser = authManager.getCurrentUser();
        this.currentSection = 'overview';
        this.init();
    }

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

    setupNavigation() {
        const menuItems = document.querySelectorAll('.menu-item');
        const sections = document.querySelectorAll('.dashboard-section');

        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = item.getAttribute('href').substring(1);
                
                menuItems.forEach(mi => mi.classList.remove('active'));
                item.classList.add('active');
                
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

    loadUserData() {
        const userNameElement = document.querySelector('.user-name');
        const userEmailElement = document.querySelector('.user-email');
        
        if (userNameElement) {
            userNameElement.textContent = this.currentUser.name || this.currentUser.email;
        }
        if (userEmailElement) {
            userEmailElement.textContent = this.currentUser.email;
        }
    }

    setupEventListeners() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                authManager.logout();
                window.location.href = 'login.html';
            });
        }

        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-borrow') || e.target.closest('.btn-borrow')) {
                e.preventDefault();
                const bookCard = e.target.closest('.book-card');
                if (bookCard) this.borrowBook(bookCard);
            }
            if (e.target.matches('.btn-return') || e.target.closest('.btn-return')) {
                e.preventDefault();
                const bookCard = e.target.closest('.borrowed-book');
                if (bookCard) this.returnBook(bookCard);
            }
            if (e.target.matches('.btn-renew') || e.target.closest('.btn-renew')) {
                e.preventDefault();
                const bookCard = e.target.closest('.borrowed-book');
                if (bookCard) this.renewBook(bookCard);
            }
            if (e.target.matches('.btn-favorite') || e.target.closest('.btn-favorite')) {
                e.preventDefault();
                const bookCard = e.target.closest('.book-card');
                if (bookCard) this.toggleFavorite(bookCard);
            }
        });
    }

    loadDashboardData() {
        this.loadStats();
        this.loadSectionData(this.currentSection);
    }

    loadSectionData(sectionId) {
        switch(sectionId) {
            case 'overview': this.loadOverview(); break;
            case 'borrowed': this.loadBorrowedBooks(); break;
            case 'browse': this.loadBrowseBooks(); break;
            case 'favorites': this.loadFavoriteBooks(); break;
            case 'reading-progress': this.loadReadingProgress(); break;
            case 'history': this.loadReadingHistory(); break;
            case 'notifications': this.loadNotifications(); break;
            case 'achievements': this.loadAchievements(); break;
            case 'recommendations': this.loadRecommendations(); break;
            case 'community': this.loadCommunity(); break;
        }
    }

    loadOverview() {
        this.loadBorrowedBooks();
        this.loadCurrentlyReading();
    }

    loadStats() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        const userData = authManager.getUserData(currentUser.email);
        const stats = authManager.getUserStats(currentUser.email);
        
        this.updateStatCards(stats);
        this.updateReadingProgress(userData);
    }

    updateStatCards(stats) {
        const statCards = document.querySelectorAll('.stat-card');
        if (statCards.length >= 4) {
            statCards[0].querySelector('h3').textContent = stats.borrowed;
            statCards[1].querySelector('h3').textContent = stats.overdue;
            statCards[2].querySelector('h3').textContent = stats.favorites;
            statCards[3].querySelector('h3').textContent = stats.totalRead;
        }
    }

    updateReadingProgress(userData) {
        const monthlyProgressFill = document.querySelector('.monthly-progress .progress-fill');
        const monthlyProgressPercentage = document.querySelector('.monthly-progress .progress-percentage');
        const monthlyProgressText = document.querySelector('.monthly-progress .progress-text');
        
        if (monthlyProgressFill) {
            monthlyProgressFill.style.width = `${userData.readingGoals.monthly.progress}%`;
        }
        if (monthlyProgressPercentage) {
            monthlyProgressPercentage.textContent = `${Math.round(userData.readingGoals.monthly.progress)}%`;
        }
        if (monthlyProgressText) {
            monthlyProgressText.textContent = `${userData.readingGoals.monthly.completed}/${userData.readingGoals.monthly.target} books this month`;
        }
        
        // Update yearly progress
        const yearlyProgressFill = document.querySelector('.yearly-progress .progress-fill');
        const yearlyProgressPercentage = document.querySelector('.yearly-progress .progress-percentage');
        const yearlyProgressText = document.querySelector('.yearly-progress .progress-text');
        
        if (yearlyProgressFill) {
            yearlyProgressFill.style.width = `${yearlyProgress}%`;
        }
        if (yearlyProgressPercentage) {
            yearlyProgressPercentage.textContent = `${Math.round(yearlyProgress)}%`;
        }
        if (yearlyProgressText) {
            yearlyProgressText.textContent = `${userData.readingGoals.yearly.completed}/${userData.readingGoals.yearly.target} books this year`;
        }
        
        // Update reading streak
        const streakElement = document.querySelector('.reading-streak .streak-number');
        if (streakElement) {
            streakElement.textContent = userData.readingStreak;
        }
        
        // Update total pages read
        const pagesElement = document.querySelector('.total-pages .pages-number');
        if (pagesElement) {
            pagesElement.textContent = userData.totalPagesRead.toLocaleString();
        }
    }

    // Load reading history section
    loadReadingHistory() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        const userData = authManager.getUserData(currentUser.email);
        const historyContainer = document.querySelector('#history .reading-history-list');
        
        if (historyContainer && userData.readingHistory.length > 0) {
            historyContainer.innerHTML = userData.readingHistory
                .sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate))
                .map(entry => {
                    const book = bookManager.getBook(entry.bookId);
                    if (!book) return '';
                    
                    return `
                        <div class="history-item">
                            <div class="history-book-cover">
                                <img src="${book.cover}" alt="${book.title}" onerror="this.src='${bookManager.getDefaultBookCover()}'">
                            </div>
                            <div class="history-info">
                                <h4>${book.title}</h4>
                                <p class="history-author">by ${book.author}</p>
                                <p class="history-completed">Completed: ${formatDate(entry.completedDate)}</p>
                                ${entry.pagesRead ? `<p class="history-pages">${entry.pagesRead} pages</p>` : ''}
                                <div class="history-rating">
                                    ${Array.from({length: 5}, (_, i) => 
                                        `<i class="fas fa-star ${i < entry.rating ? 'rated' : ''}"></i>`
                                    ).join('')}
                                    <span class="rating-text">(${entry.rating}/5)</span>
                                </div>
                            </div>
                            <div class="history-actions">
                                <button class="btn btn-outline btn-small" onclick="addToFavorites('${book.id}')">
                                    <i class="fas fa-heart"></i>
                                </button>
                                ${book.available ? 
                                    `<button class="btn btn-primary btn-small" onclick="borrowBook(this)" data-book-id="${book.id}">Borrow Again</button>` :
                                    `<button class="btn btn-secondary btn-small" disabled>Unavailable</button>`
                                }
                            </div>
                        </div>
                    `;
                }).filter(item => item).join('');
        } else if (historyContainer) {
            historyContainer.innerHTML = `
                <div class="no-books-message">
                    <i class="fas fa-history"></i>
                    <h3>No reading history</h3>
                    <p>Books you complete will appear here</p>
                    <a href="#browse" class="btn btn-primary">Start Reading</a>
                </div>
            `;
        }
    }

    // Load notifications section
    loadNotifications() {
        const notificationsContainer = document.getElementById('notifications-list');
        const user = authManager.getCurrentUser();
        
        if (!user || !user.notifications) {
            notificationsContainer.innerHTML = '<p>No notifications available.</p>';
            return;
        }

        // Initialize notification filters if not already done
        this.initializeNotificationFilters();

        const notifications = user.notifications.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        notificationsContainer.innerHTML = notifications.map(notification => `
            <div class="notification-item notification-${notification.type}" data-id="${notification.id}" data-type="${notification.type}">
                <div class="notification-icon">
                    <i class="fas ${this.getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="notification-content">
                    <p class="notification-message">${notification.message}</p>
                    <p class="notification-date">${this.formatDate(notification.date)}</p>
                </div>
                <button class="notification-dismiss" onclick="dashboardManager.dismissNotification('${notification.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        // Update notification count
        this.updateNotificationCount();
    }

    initializeNotificationFilters() {
        // Add event listeners for notification filters
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                
                const filterType = e.target.dataset.filter;
                this.filterNotifications(filterType);
            });
        });

        // Add event listener for mark all as read
        const markAllReadBtn = document.getElementById('mark-all-read');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => {
                this.markAllNotificationsAsRead();
            });
        }

        // Add event listeners for notification settings
        const settingCheckboxes = document.querySelectorAll('.notification-settings input[type="checkbox"]');
        settingCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.updateNotificationSetting(e.target.name, e.target.checked);
            });
        });
    }

    filterNotifications(type) {
        const notifications = document.querySelectorAll('.notification-item');
        
        notifications.forEach(notification => {
            if (type === 'all' || notification.dataset.type === type) {
                notification.style.display = 'flex';
            } else {
                notification.style.display = 'none';
            }
        });
    }

    markAllNotificationsAsRead() {
        const user = authManager.getCurrentUser();
        if (user && user.notifications) {
            user.notifications.forEach(notification => {
                notification.read = true;
            });
            authManager.updateUser(user);
            this.loadNotifications();
            showNotification('All notifications marked as read', 'success');
        }
    }

    updateNotificationSetting(setting, enabled) {
        const user = authManager.getCurrentUser();
        if (user) {
            if (!user.notificationSettings) {
                user.notificationSettings = {};
            }
            user.notificationSettings[setting] = enabled;
            authManager.updateUser(user);
            showNotification(`Notification setting updated: ${setting}`, 'success');
        }
    }

    updateNotificationCount() {
        const user = authManager.getCurrentUser();
        const unreadCount = user && user.notifications ? 
            user.notifications.filter(n => !n.read).length : 0;
        
        const countElement = document.querySelector('.notification-count');
        if (countElement) {
            countElement.textContent = unreadCount;
            countElement.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    // Get notification icon based on type
    getNotificationIcon(type) {
        switch(type) {
            case 'warning': return 'fa-exclamation-triangle';
            case 'success': return 'fa-check-circle';
            case 'info': return 'fa-info-circle';
            case 'error': return 'fa-times-circle';
            default: return 'fa-bell';
        }
    }

    // Update achievements section
    loadAchievements() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        const userData = authManager.getUserData(currentUser.email);
        const achievementsContainer = document.querySelector('#achievements .achievements-grid');
        
        if (achievementsContainer) {
            const achievements = this.calculateAchievements(userData);
            achievementsContainer.innerHTML = achievements.map(achievement => `
                <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">
                        <i class="fas ${achievement.icon}"></i>
                    </div>
                    <div class="achievement-info">
                        <h4>${achievement.title}</h4>
                        <p>${achievement.description}</p>
                        <div class="achievement-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${achievement.progress}%"></div>
                            </div>
                            <span class="progress-text">${achievement.progressText}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    // Calculate user achievements
    calculateAchievements(userData) {
        const achievements = [
            {
                id: 'first-book',
                title: 'First Steps',
                description: 'Complete your first book',
                icon: 'fa-book-open',
                unlocked: userData.readingHistory.length >= 1,
                progress: Math.min((userData.readingHistory.length / 1) * 100, 100),
                progressText: `${userData.readingHistory.length}/1 books`
            },
            {
                id: 'bookworm',
                title: 'Bookworm',
                description: 'Read 10 books',
                icon: 'fa-glasses',
                unlocked: userData.readingHistory.length >= 10,
                progress: Math.min((userData.readingHistory.length / 10) * 100, 100),
                progressText: `${userData.readingHistory.length}/10 books`
            },
            {
                id: 'speed-reader',
                title: 'Speed Reader',
                description: 'Read 1000 pages',
                icon: 'fa-tachometer-alt',
                unlocked: userData.totalPagesRead >= 1000,
                progress: Math.min((userData.totalPagesRead / 1000) * 100, 100),
                progressText: `${userData.totalPagesRead}/1000 pages`
            },
            {
                id: 'streak-master',
                title: 'Streak Master',
                description: 'Maintain a 30-day reading streak',
                icon: 'fa-fire',
                unlocked: userData.readingStreak >= 30,
                progress: Math.min((userData.readingStreak / 30) * 100, 100),
                progressText: `${userData.readingStreak}/30 days`
            },
            {
                id: 'goal-crusher',
                title: 'Goal Crusher',
                description: 'Complete your yearly reading goal',
                icon: 'fa-trophy',
                unlocked: userData.readingGoals.yearly.completed >= userData.readingGoals.yearly.target,
                progress: Math.min((userData.readingGoals.yearly.completed / userData.readingGoals.yearly.target) * 100, 100),
                progressText: `${userData.readingGoals.yearly.completed}/${userData.readingGoals.yearly.target} books`
            },
            {
                id: 'diverse-reader',
                title: 'Diverse Reader',
                description: 'Read books from 5 different genres',
                icon: 'fa-palette',
                unlocked: false, // Would need genre tracking
                progress: 60,
                progressText: '3/5 genres'
            }
        ];

        return achievements;
    }

    // Load section-specific data
    loadSectionData(section) {
        switch (section) {
            case 'overview':
                this.loadOverviewData();
                break;
            case 'borrowed':
                this.loadBorrowedBooks();
                break;
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
            case 'community':
                this.loadCommunityData();
                break;
            case 'history':
                this.loadReadingHistory();
                break;
            case 'notifications':
                this.loadNotifications();
                break;
            case 'achievements':
                this.loadAchievements();
                break;
        }
    }

    // Load community data
    loadCommunityData() {
        // Initialize community tabs
        this.initializeCommunityTabs();
    }

    // Initialize community tabs functionality
    initializeCommunityTabs() {
        const tabButtons = document.querySelectorAll('.community-tabs .tab-btn');
        const tabContents = document.querySelectorAll('.community-content .tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });

        // Initialize discussion form
        const discussionInput = document.querySelector('.discussion-input');
        const startDiscussionBtn = document.querySelector('.start-discussion .btn');
        
        if (startDiscussionBtn) {
            startDiscussionBtn.addEventListener('click', () => {
                if (discussionInput && discussionInput.value.trim()) {
                    showNotification('Discussion started! Other members will be able to see and respond to your post.', 'success');
                    discussionInput.value = '';
                } else {
                    showNotification('Please enter a discussion topic', 'error');
                }
            });
        }

        // Initialize notification filters
        this.initializeNotificationFilters();
    }

    // Initialize notification filters
    initializeNotificationFilters() {
        const filterButtons = document.querySelectorAll('.notification-filters .filter-btn');
        const markAllReadBtn = document.getElementById('markAllRead');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Remove active class from all filter buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter notifications based on type
                this.filterNotifications(filter);
            });
        });

        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => {
                this.markAllNotificationsRead();
            });
        }
    }

    // Filter notifications by type
    filterNotifications(filter) {
        const notifications = document.querySelectorAll('.notification-item');
        
        notifications.forEach(notification => {
            if (filter === 'all') {
                notification.style.display = 'flex';
            } else {
                const hasFilterClass = notification.classList.contains(`notification-${filter}`);
                notification.style.display = hasFilterClass ? 'flex' : 'none';
            }
        });
    }

    // Mark all notifications as read
    markAllNotificationsRead() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        const userData = authManager.getUserData(currentUser.email);
        if (userData && userData.notifications) {
            userData.notifications = [];
            authManager.updateUserData(currentUser.email, userData);
            this.loadNotifications();
            showNotification('All notifications marked as read', 'success');
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

    // Check user's current borrowed books count
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        showNotification('Please log in to borrow books', 'error');
        return;
    }

    const userData = authManager.getUserData(currentUser.email);
    if (userData.borrowedBooks.length >= 5) {
        showNotification('Maximum borrow limit reached (5 books)', 'error');
        return;
    }

    const result = authManager.borrowBook(book);
    if (result.success) {
        showNotification('Book borrowed successfully!', 'success');
        bookManager.updateBookAvailability(bookId, false);
        
        // Update dashboard sections
        if (typeof dashboardManager !== 'undefined') {
            dashboardManager.loadStats();
            dashboardManager.refreshCurrentSection();
        }
        
        // Update admin stats if admin is logged in
        updateAdminStats();
    } else {
        showNotification(result.message, 'error');
    }
}

// Return book
function returnBook(bookElement) {
    const bookId = bookElement.dataset.bookId;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        showNotification('Please log in to return books', 'error');
        return;
    }

    const result = authManager.returnBook(bookId);
    
    if (result.success) {
        showNotification('Book returned successfully!', 'success');
        bookManager.updateBookAvailability(bookId, true);
        
        // Update dashboard sections
        if (typeof dashboardManager !== 'undefined') {
            dashboardManager.loadStats();
            dashboardManager.refreshCurrentSection();
        }
        
        // Update admin stats if admin is logged in
        updateAdminStats();
        
        // Add to reading history with completion tracking
        const userData = authManager.getUserData(currentUser.email);
        const returnedBook = userData.readingHistory.find(h => h.bookId === bookId);
        if (returnedBook) {
            userData.totalPagesRead += Math.floor(Math.random() * 200) + 100; // Mock pages read
            authManager.updateUserData(currentUser.email, userData);
        }
    } else {
        showNotification(result.message, 'error');
    }
}

// Renew book
function renewBook(bookElement) {
    const bookId = bookElement.dataset.bookId;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        showNotification('Please log in to renew books', 'error');
        return;
    }

    const userData = authManager.getUserData(currentUser.email);
    const book = userData.borrowedBooks.find(b => b.id === bookId);
    
    if (!book) {
        showNotification('Book not found in your borrowed list', 'error');
        return;
    }

    if (book.renewals >= 2) {
        showNotification('Maximum renewals reached (2 renewals allowed)', 'error');
        return;
    }

    // Check if book is overdue
    const today = new Date();
    const dueDate = new Date(book.dueDate);
    if (today > dueDate) {
        showNotification('Cannot renew overdue books. Please return first.', 'error');
        return;
    }

    // Renew the book
    book.renewals++;
    const newDueDate = new Date(book.dueDate);
    newDueDate.setDate(newDueDate.getDate() + 14);
    book.dueDate = newDueDate.toISOString().split('T')[0];
    
    // Update book status
    const daysDiff = Math.ceil((newDueDate - today) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 3) {
        book.status = 'due-soon';
    } else {
        book.status = 'active';
    }
    
    authManager.updateUserData(currentUser.email, userData);
    showNotification(`Book renewed successfully! New due date: ${formatDate(book.dueDate)}`, 'success');
    
    // Update dashboard sections
    if (typeof dashboardManager !== 'undefined') {
        dashboardManager.loadStats();
        dashboardManager.refreshCurrentSection();
    }
    
    // Update admin stats if admin is logged in
    updateAdminStats();
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

// Update admin stats function
function updateAdminStats() {
    // This function will be called to update admin dashboard statistics
    // when books are borrowed, returned, or renewed
    const adminStatsEvent = new CustomEvent('updateAdminStats', {
        detail: {
            timestamp: new Date().toISOString(),
            action: 'book_transaction'
        }
    });
    document.dispatchEvent(adminStatsEvent);
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

// Utility function for date formatting
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Utility function to check if date is overdue
function isOverdue(dateString) {
    const today = new Date();
    const dueDate = new Date(dateString);
    return today > dueDate;
}

// Utility function to get days until due
function getDaysUntilDue(dateString) {
    const today = new Date();
    const dueDate = new Date(dateString);
    return Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
}

// Global function to dismiss notifications
function dismissNotification(notificationId) {
    const result = authManager.dismissNotification(notificationId);
    if (result.success) {
        showNotification('Notification dismissed', 'success');
        // Reload notifications section if active
        if (typeof dashboardManager !== 'undefined') {
            dashboardManager.loadNotifications();
        }
    }
}

// Global function to add to favorites from history
function addToFavorites(bookId) {
    const result = authManager.addToFavorites(bookId);
    if (result.success) {
        showNotification('Added to favorites', 'success');
        // Update favorites section if active
        if (typeof dashboardManager !== 'undefined') {
            dashboardManager.loadFavoriteBooks();
            dashboardManager.loadStats();
        }
    } else {
        showNotification(result.message, 'error');
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboardManager = new DashboardManager();
});
