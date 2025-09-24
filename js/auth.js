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
            "22310418@live.mut.ac": {
                email: "22310418@live.mut.ac",
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
                        borrowDate: "2024-08-15",
                        dueDate: "2024-08-30",
                        status: "overdue",
                        renewals: 0
                    },
                    {
                        id: "mockingbird",
                        title: "To Kill a Mockingbird",
                        author: "Harper Lee",
                        cover: "images/To Kill a Mockingbird.png",
                        borrowDate: "2024-08-27",
                        dueDate: "2024-09-10",
                        status: "due-soon",
                        renewals: 1
                    },
                    {
                        id: "catcher",
                        title: "The Catcher in the Rye",
                        author: "J.D. Salinger",
                        cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300/5107.jpg",
                        borrowDate: "2024-09-01",
                        dueDate: "2024-09-15",
                        status: "active",
                        renewals: 0
                    }
                ],
                favorites: ["1984", "pride-prejudice", "lord-flies", "atomic-habits"],
                readingHistory: [
                    { bookId: "sapiens", completedDate: "2024-08-01", rating: 5 },
                    { bookId: "educated", completedDate: "2024-07-15", rating: 4 },
                    { bookId: "midnight-library", completedDate: "2024-06-30", rating: 5 }
                ],
                readingGoals: {
                    monthly: { target: 4, completed: 3 },
                    yearly: { target: 50, completed: 24 }
                },
                readingStreak: 12,
                totalPagesRead: 1247,
                notifications: [
                    { id: 1, message: "The Great Gatsby is overdue", type: "warning", date: "2024-09-01" },
                    { id: 2, message: "New book recommendation available", type: "info", date: "2024-08-30" }
                ]
            },
            "22459324@live.mut.ac": {
                email: "22459324@live.mut.ac",
                password: "ncnene",
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
                        borrowDate: "2024-08-20",
                        dueDate: "2024-09-03",
                        status: "active",
                        renewals: 0
                    }
                ],
                favorites: ["atomic-habits", "sapiens", "1984"],
                readingHistory: [
                    { bookId: "7-habits", completedDate: "2024-08-10", rating: 4 },
                    { bookId: "mindset", completedDate: "2024-07-25", rating: 5 }
                ],
                readingGoals: {
                    monthly: { target: 3, completed: 2 },
                    yearly: { target: 36, completed: 18 }
                },
                readingStreak: 8,
                totalPagesRead: 892,
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
        
        // Add to reading history
        user.readingHistory.push({
            bookId: book.id,
            completedDate: new Date().toISOString().split('T')[0],
            rating: null
        });

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

    // Initialize authentication system
    init() {
        // Check if user is logged in and redirect accordingly
        if (window.location.pathname.includes('dashboard.html') && !this.currentUser) {
            window.location.href = 'login.html';
        }
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
