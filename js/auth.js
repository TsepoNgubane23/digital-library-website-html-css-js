// Authentication and User Management System
class AuthManager {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    // Load users from localStorage or initialize with default users
    loadUsers() {
        const savedUsers = localStorage.getItem('libraryUsers');
        if (savedUsers) {
            return JSON.parse(savedUsers);
        }
        
        // Default users with enhanced data
        const defaultUsers = {
            "philasandengobese@fake.com": {
                email: "philasandengobese@fake.com",
                password: "philasandengobese",
                name: "Philasande Ngobese",
                avatar: "images/Philasande.jpg",
                joinDate: "2024-01-15",
                membershipType: "Premium",
                borrowedBooks: [
                    {
                        id: "gatsby",
                        title: "The Great Gatsby",
                        author: "F. Scott Fitzgerald",
                        cover: "images/The Great Gatsby.png",
                        borrowDate: "2024-09-01",
                        dueDate: "2024-09-15",
                        status: "overdue",
                        renewals: 0
                    },
                    {
                        id: "mockingbird",
                        title: "To Kill a Mockingbird",
                        author: "Harper Lee",
                        cover: "images/To Kill a Mockingbird.png",
                        borrowDate: "2024-09-10",
                        dueDate: "2024-09-24",
                        status: "due-soon",
                        renewals: 1
                    },
                    {
                        id: "catcher",
                        title: "The Catcher in the Rye",
                        author: "J.D. Salinger",
                        cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300/5107.jpg",
                        borrowDate: "2024-09-01",
                        dueDate: "2024-10-08",
                        status: "active",
                        renewals: 0
                    }
                ],
                favorites: ["1984", "pride-prejudice", "lord-flies", "atomic-habits"],
                readingHistory: [
                    { bookId: "sapiens", completedDate: "2024-08-01", rating: 5, pagesRead: 450 },
                    { bookId: "educated", completedDate: "2024-07-15", rating: 4, pagesRead: 334 },
                    { bookId: "midnight-library", completedDate: "2024-06-30", rating: 5, pagesRead: 288 },
                    { bookId: "becoming", completedDate: "2024-09-10", rating: 5, pagesRead: 426 },
                    { bookId: "dune", completedDate: "2024-09-20", rating: 4, pagesRead: 688 }
                ],
                readingGoals: {
                    monthly: { target: 4, completed: 3 },
                    yearly: { target: 50, completed: 27 }
                },
                readingStreak: 15,
                totalPagesRead: 1580,
                notifications: [
                    { id: 1, message: "The Great Gatsby is overdue", type: "warning", date: "2024-09-16" },
                    { id: 2, message: "To Kill a Mockingbird is due today", type: "warning", date: "2024-09-24" },
                    { id: 3, message: "New book recommendation available", type: "info", date: "2024-09-20" }
                ]
            },
            "acnene@fake.com": {
                email: "acnene@fake.com",
                password: "acnene",
                name: "NC Nene",
                avatar: "images/NC Nene.jpg",
                joinDate: "2024-02-01",
                membershipType: "Standard",
                borrowedBooks: [
                    {
                        id: "atomic-habits",
                        title: "Atomic Habits",
                        author: "James Clear",
                        cover: "images/Atomic Habits.png",
                        borrowDate: "2024-09-10",
                        dueDate: "2024-09-24",
                        status: "active",
                        renewals: 0
                    }
                ],
                favorites: ["atomic-habits", "sapiens", "1984"],
                readingHistory: [
                    { bookId: "7-habits", completedDate: "2024-08-10", rating: 4, pagesRead: 372 },
                    { bookId: "mindset", completedDate: "2024-07-25", rating: 5, pagesRead: 276 },
                    { bookId: "think-grow-rich", completedDate: "2024-09-05", rating: 4, pagesRead: 238 }
                ],
                readingGoals: {
                    monthly: { target: 3, completed: 3 },
                    yearly: { target: 36, completed: 21 }
                },
                readingStreak: 12,
                totalPagesRead: 1124,
                notifications: [
                    { id: 1, message: "Reading goal almost reached!", type: "success", date: "2024-08-28" }
                ]
            }
        };
        
        this.saveUsers(defaultUsers);
        return defaultUsers;
    }

    // Save users to localStorage
    saveUsers(users = this.users) {
        localStorage.setItem('libraryUsers', JSON.stringify(users));
    }

    // Get current logged-in user
    getCurrentUser() {
        const savedUser = localStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    }

    // Login user
    login(email, password) {
        const user = this.users[email];
        if (user && user.password === password) {
            const loginData = {
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                membershipType: user.membershipType
            };
            localStorage.setItem('currentUser', JSON.stringify(loginData));
            this.currentUser = loginData;
            return { success: true, user: loginData };
        }
        return { success: false, message: 'Invalid email or password' };
    }

    // Register new user
    register(userData) {
        const { email, password, firstName, lastName, phone } = userData;
        
        if (this.users[email]) {
            return { success: false, message: 'User already exists' };
        }

        const newUser = {
            email,
            password,
            name: `${firstName} ${lastName}`,
            avatar: "images/default-avatar.png",
            joinDate: new Date().toISOString().split('T')[0],
            membershipType: "Standard",
            phone,
            borrowedBooks: [],
            favorites: [],
            readingHistory: [],
            readingGoals: {
                monthly: { target: 3, completed: 0 },
                yearly: { target: 36, completed: 0 }
            },
            readingStreak: 0,
            totalPagesRead: 0,
            notifications: [
                { id: 1, message: "Welcome to DigiLibrary!", type: "success", date: new Date().toISOString().split('T')[0] }
            ]
        };

        this.users[email] = newUser;
        this.saveUsers();
        
        return { success: true, message: 'Registration successful' };
    }

    // Logout user
    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        window.location.href = 'index.html';
    }

    // Get user data by email
    getUserData(email) {
        return this.users[email] || null;
    }

    // Update user data
    updateUserData(email, updates) {
        if (this.users[email]) {
            this.users[email] = { ...this.users[email], ...updates };
            this.saveUsers();
            return true;
        }
        return false;
    }

    // Delete user account
    deleteUser(email) {
        if (this.users[email]) {
            delete this.users[email];
            this.saveUsers();
            return true;
        }
        return false;
    }

    // Get all users (for admin)
    getAllUsers() {
        return Object.values(this.users);
    }

    // Borrow book
    borrowBook(bookData) {
        if (!this.currentUser) return { success: false, message: 'Not logged in' };
        
        const user = this.users[this.currentUser.email];
        if (!user) return { success: false, message: 'User not found' };

        if (user.borrowedBooks.length >= 5) {
            return { success: false, message: 'Maximum borrow limit reached (5 books)' };
        }

        const borrowDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14); // 14 days loan period

        const borrowRecord = {
            ...bookData,
            borrowDate: borrowDate.toISOString().split('T')[0],
            dueDate: dueDate.toISOString().split('T')[0],
            status: 'active',
            renewals: 0
        };

        user.borrowedBooks.push(borrowRecord);
        this.saveUsers();
        
        return { success: true, message: 'Book borrowed successfully' };
    }

    // Return book
    returnBook(bookId) {
        if (!this.currentUser) return { success: false, message: 'Not logged in' };
        
        const user = this.users[this.currentUser.email];
        if (!user) return { success: false, message: 'User not found' };

        const bookIndex = user.borrowedBooks.findIndex(book => book.id === bookId);
        if (bookIndex === -1) {
            return { success: false, message: 'Book not found in borrowed list' };
        }

        const book = user.borrowedBooks[bookIndex];
        user.borrowedBooks.splice(bookIndex, 1);
        
        // Add to reading history with enhanced data
        const completionDate = new Date().toISOString().split('T')[0];
        const existingHistoryIndex = user.readingHistory.findIndex(h => h.bookId === book.id);
        
        if (existingHistoryIndex === -1) {
            user.readingHistory.push({
                bookId: book.id,
                completedDate: completionDate,
                rating: Math.floor(Math.random() * 2) + 4, // Random rating 4-5 for demo
                pagesRead: Math.floor(Math.random() * 300) + 200 // Random pages 200-500
            });
        }

        // Update reading goals
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const completionMonth = new Date(completionDate).getMonth();
        const completionYear = new Date(completionDate).getFullYear();
        
        if (currentMonth === completionMonth && currentYear === completionYear) {
            user.readingGoals.monthly.completed++;
        }
        if (currentYear === completionYear) {
            user.readingGoals.yearly.completed++;
        }

        // Update reading streak (simplified logic)
        user.readingStreak++;
        
        // Update total pages read
        const lastHistory = user.readingHistory[user.readingHistory.length - 1];
        if (lastHistory && lastHistory.pagesRead) {
            user.totalPagesRead += lastHistory.pagesRead;
        }

        this.saveUsers();
        return { success: true, message: 'Book returned successfully' };
    }

    // Add to favorites
    addToFavorites(bookId) {
        if (!this.currentUser) return { success: false, message: 'Not logged in' };
        
        const user = this.users[this.currentUser.email];
        if (!user) return { success: false, message: 'User not found' };

        if (!user.favorites.includes(bookId)) {
            user.favorites.push(bookId);
            this.saveUsers();
        }
        
        return { success: true, message: 'Added to favorites' };
    }

    // Remove from favorites
    removeFromFavorites(bookId) {
        if (!this.currentUser) return { success: false, message: 'Not logged in' };
        
        const user = this.users[this.currentUser.email];
        if (!user) return { success: false, message: 'User not found' };

        const index = user.favorites.indexOf(bookId);
        if (index > -1) {
            user.favorites.splice(index, 1);
            this.saveUsers();
        }
        
        return { success: true, message: 'Removed from favorites' };
    }

    // Renew book
    renewBook(bookId) {
        if (!this.currentUser) return { success: false, message: 'Not logged in' };
        
        const user = this.users[this.currentUser.email];
        if (!user) return { success: false, message: 'User not found' };

        const book = user.borrowedBooks.find(book => book.id === bookId);
        if (!book) {
            return { success: false, message: 'Book not found in borrowed list' };
        }

        if (book.renewals >= 2) {
            return { success: false, message: 'Maximum renewals reached (2 renewals allowed)' };
        }

        // Check if book is overdue
        const today = new Date();
        const dueDate = new Date(book.dueDate);
        if (today > dueDate) {
            return { success: false, message: 'Cannot renew overdue books. Please return first.' };
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

        this.saveUsers();
        return { success: true, message: `Book renewed successfully! New due date: ${book.dueDate}` };
    }

    // Add notification
    addNotification(message, type = 'info') {
        if (!this.currentUser) return;
        
        const user = this.users[this.currentUser.email];
        if (!user) return;

        const notification = {
            id: Date.now(),
            message,
            type,
            date: new Date().toISOString().split('T')[0]
        };

        user.notifications.unshift(notification);
        
        // Keep only last 10 notifications
        if (user.notifications.length > 10) {
            user.notifications = user.notifications.slice(0, 10);
        }

        this.saveUsers();
    }

    // Dismiss notification
    dismissNotification(notificationId) {
        if (!this.currentUser) return { success: false, message: 'Not logged in' };
        
        const user = this.users[this.currentUser.email];
        if (!user) return { success: false, message: 'User not found' };

        const notificationIndex = user.notifications.findIndex(n => n.id === notificationId);
        if (notificationIndex > -1) {
            user.notifications.splice(notificationIndex, 1);
            this.saveUsers();
            return { success: true, message: 'Notification dismissed' };
        }

        return { success: false, message: 'Notification not found' };
    }

    // Update reading goals
    updateReadingGoals(monthlyTarget, yearlyTarget) {
        if (!this.currentUser) return { success: false, message: 'Not logged in' };
        
        const user = this.users[this.currentUser.email];
        if (!user) return { success: false, message: 'User not found' };

        user.readingGoals.monthly.target = monthlyTarget;
        user.readingGoals.yearly.target = yearlyTarget;

        this.saveUsers();
        return { success: true, message: 'Reading goals updated successfully' };
    }

    // Get user statistics
    getUserStats(email = null) {
        const userEmail = email || (this.currentUser ? this.currentUser.email : null);
        if (!userEmail) return null;

        const user = this.users[userEmail];
        if (!user) return null;

        const today = new Date();
        const overdueBooks = user.borrowedBooks.filter(book => new Date(book.dueDate) < today);
        const dueSoonBooks = user.borrowedBooks.filter(book => {
            const dueDate = new Date(book.dueDate);
            const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            return daysDiff <= 3 && daysDiff >= 0;
        });

        return {
            borrowed: user.borrowedBooks.length,
            overdue: overdueBooks.length,
            dueSoon: dueSoonBooks.length,
            favorites: user.favorites.length,
            totalRead: user.readingHistory.length,
            totalPages: user.totalPagesRead,
            readingStreak: user.readingStreak,
            monthlyProgress: user.readingGoals.monthly,
            yearlyProgress: user.readingGoals.yearly,
            notifications: user.notifications.length
        };
    }

    // Initialize authentication system
    init() {
        // Check if user is logged in and redirect accordingly
        if (window.location.pathname.includes('dashboard.html') && !this.currentUser) {
            window.location.href = 'login.html';
        }

        // Update book statuses on init
        this.updateBookStatuses();
    }

    // Update book statuses based on due dates
    updateBookStatuses() {
        if (!this.currentUser) return;

        const user = this.users[this.currentUser.email];
        if (!user) return;

        const today = new Date();
        let statusUpdated = false;

        user.borrowedBooks.forEach(book => {
            const dueDate = new Date(book.dueDate);
            const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

            let newStatus;
            if (daysDiff < 0) {
                newStatus = 'overdue';
            } else if (daysDiff <= 3) {
                newStatus = 'due-soon';
            } else {
                newStatus = 'active';
            }

            if (book.status !== newStatus) {
                book.status = newStatus;
                statusUpdated = true;

                // Add notification for status changes
                if (newStatus === 'overdue') {
                    this.addNotification(`${book.title} is now overdue`, 'warning');
                } else if (newStatus === 'due-soon') {
                    this.addNotification(`${book.title} is due soon (${daysDiff} days)`, 'warning');
                }
            }
        });

        if (statusUpdated) {
            this.saveUsers();
        }
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
