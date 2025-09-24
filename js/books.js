// Book Management System
class BookManager {
    constructor() {
        this.books = this.loadBooks();
        this.init();
    }

    // Load books database
    loadBooks() {
        return {
            "1984": {
                id: "1984",
                title: "1984",
                author: "George Orwell",
                cover: "https://covers.openlibrary.org/b/isbn/9780452284234-L.jpg",
                isbn: "978-0-452-28423-4",
                category: "fiction",
                genre: "Dystopian Fiction",
                pages: 328,
                publishYear: 1949,
                description: "A dystopian social science fiction novel that follows the life of Winston Smith, a low-ranking member of 'the Party', who is frustrated by the omnipresent eyes of the party.",
                rating: 4.8,
                reviews: 1247,
                available: true,
                totalCopies: 5,
                availableCopies: 3,
                tags: ["classic", "dystopian", "political", "philosophy"]
            },
            "gatsby": {
                id: "gatsby",
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                cover: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg",
                isbn: "978-0-7432-7356-5",
                category: "fiction",
                genre: "Classic Literature",
                pages: 180,
                publishYear: 1925,
                description: "A classic American novel set in the summer of 1922, following Nick Carraway's interactions with his mysterious neighbor Jay Gatsby.",
                rating: 4.5,
                reviews: 892,
                available: false,
                totalCopies: 3,
                availableCopies: 0,
                tags: ["classic", "american", "romance", "tragedy"]
            },
            "mockingbird": {
                id: "mockingbird",
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                cover: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg",
                isbn: "978-0-06-112008-4",
                category: "fiction",
                genre: "Classic Literature",
                pages: 376,
                publishYear: 1960,
                description: "A gripping tale of racial injustice and childhood innocence in the American South.",
                rating: 4.7,
                reviews: 1156,
                available: false,
                totalCopies: 4,
                availableCopies: 0,
                tags: ["classic", "social-justice", "coming-of-age"]
            },
            "pride-prejudice": {
                id: "pride-prejudice",
                title: "Pride and Prejudice",
                author: "Jane Austen",
                cover: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
                isbn: "978-0-14-143951-8",
                category: "fiction",
                genre: "Romance",
                pages: 432,
                publishYear: 1813,
                description: "A romantic novel of manners following the character development of Elizabeth Bennet.",
                rating: 4.6,
                reviews: 967,
                available: true,
                totalCopies: 6,
                availableCopies: 4,
                tags: ["classic", "romance", "british", "regency"]
            },
            "harry-potter": {
                id: "harry-potter",
                title: "Harry Potter and the Philosopher's Stone",
                author: "J.K. Rowling",
                cover: "https://covers.openlibrary.org/b/isbn/9780747532699-L.jpg",
                isbn: "978-0-7475-3269-9",
                category: "fiction",
                genre: "Fantasy",
                pages: 223,
                publishYear: 1997,
                description: "The first novel in the Harry Potter series, following a young wizard's journey.",
                rating: 4.9,
                reviews: 2341,
                available: true,
                totalCopies: 8,
                availableCopies: 6,
                tags: ["fantasy", "magic", "young-adult", "adventure"]
            },
            "lord-rings": {
                id: "lord-rings",
                title: "The Lord of the Rings",
                author: "J.R.R. Tolkien",
                cover: "https://covers.openlibrary.org/b/isbn/9780544003415-L.jpg",
                isbn: "978-0-544-00341-5",
                category: "fiction",
                genre: "Fantasy",
                pages: 1216,
                publishYear: 1954,
                description: "An epic high fantasy novel following the quest to destroy the One Ring.",
                rating: 4.8,
                reviews: 1876,
                available: false,
                totalCopies: 4,
                availableCopies: 0,
                tags: ["fantasy", "epic", "adventure", "classic"]
            },
            "atomic-habits": {
                id: "atomic-habits",
                title: "Atomic Habits",
                author: "James Clear",
                cover: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
                isbn: "978-0-7352-1129-2",
                category: "non-fiction",
                genre: "Self-Help",
                pages: 320,
                publishYear: 2018,
                description: "A comprehensive guide to building good habits and breaking bad ones.",
                rating: 4.7,
                reviews: 1534,
                available: true,
                totalCopies: 7,
                availableCopies: 5,
                tags: ["self-help", "productivity", "psychology", "habits"]
            },
            "sapiens": {
                id: "sapiens",
                title: "Sapiens",
                author: "Yuval Noah Harari",
                cover: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg",
                isbn: "978-0-06-231609-7",
                category: "non-fiction",
                genre: "History",
                pages: 443,
                publishYear: 2011,
                description: "A brief history of humankind, exploring how Homo sapiens came to dominate Earth.",
                rating: 4.6,
                reviews: 1298,
                available: true,
                totalCopies: 5,
                availableCopies: 3,
                tags: ["history", "anthropology", "science", "evolution"]
            },
            "midnight-library": {
                id: "midnight-library",
                title: "The Midnight Library",
                author: "Matt Haig",
                cover: "https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg",
                isbn: "978-0-525-55948-1",
                category: "fiction",
                genre: "Contemporary Fiction",
                pages: 288,
                publishYear: 2020,
                description: "A novel about all the choices that go into a life well lived.",
                rating: 4.4,
                reviews: 987,
                available: true,
                totalCopies: 6,
                availableCopies: 4,
                tags: ["contemporary", "philosophy", "life", "choices"]
            },
            "educated": {
                id: "educated",
                title: "Educated",
                author: "Tara Westover",
                cover: "https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg",
                isbn: "978-0-399-59050-4",
                category: "non-fiction",
                genre: "Memoir",
                pages: 334,
                publishYear: 2018,
                description: "A memoir about a woman who grows up in a survivalist family and eventually earns a PhD from Cambridge.",
                rating: 4.5,
                reviews: 1123,
                available: true,
                totalCopies: 4,
                availableCopies: 2,
                tags: ["memoir", "education", "family", "transformation"]
            },
            "alchemist": {
                id: "alchemist",
                title: "The Alchemist",
                author: "Paulo Coelho",
                cover: "https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg",
                isbn: "978-0-06-112241-5",
                category: "fiction",
                genre: "Philosophical Fiction",
                pages: 163,
                publishYear: 1988,
                description: "A philosophical book about following your dreams and listening to your heart.",
                rating: 4.3,
                reviews: 1456,
                available: true,
                totalCopies: 5,
                availableCopies: 3,
                tags: ["philosophy", "dreams", "journey", "inspiration"]
            },
            "dune": {
                id: "dune",
                title: "Dune",
                author: "Frank Herbert",
                cover: "https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg",
                isbn: "978-0-441-17271-9",
                category: "fiction",
                genre: "Science Fiction",
                pages: 688,
                publishYear: 1965,
                description: "A science fiction novel set in the distant future amidst a feudal interstellar society.",
                rating: 4.6,
                reviews: 1687,
                available: false,
                totalCopies: 3,
                availableCopies: 0,
                tags: ["sci-fi", "space", "politics", "ecology"]
            },
            "seven-husbands": {
                id: "seven-husbands",
                title: "The Seven Husbands of Evelyn Hugo",
                author: "Taylor Jenkins Reid",
                cover: "https://covers.openlibrary.org/b/isbn/9781501139812-L.jpg",
                isbn: "978-1-5011-3981-2",
                category: "fiction",
                genre: "Historical Fiction",
                pages: 400,
                publishYear: 2017,
                description: "A reclusive Hollywood icon finally tells her story to a young journalist.",
                rating: 4.7,
                reviews: 1234,
                available: true,
                totalCopies: 4,
                availableCopies: 2,
                tags: ["historical", "hollywood", "lgbtq", "romance"]
            },
            "where-crawdads-sing": {
                id: "where-crawdads-sing",
                title: "Where the Crawdads Sing",
                author: "Delia Owens",
                cover: "https://covers.openlibrary.org/b/isbn/9780735219090-L.jpg",
                isbn: "978-0-7352-1909-0",
                category: "fiction",
                genre: "Mystery",
                pages: 384,
                publishYear: 2018,
                description: "A mystery novel about a young woman who raised herself in the marshes of North Carolina.",
                rating: 4.5,
                reviews: 2156,
                available: true,
                totalCopies: 5,
                availableCopies: 3,
                tags: ["mystery", "nature", "coming-of-age", "southern"]
            },
            "becoming": {
                id: "becoming",
                title: "Becoming",
                author: "Michelle Obama",
                cover: "https://covers.openlibrary.org/b/isbn/9781524763138-L.jpg",
                isbn: "978-1-5247-6313-8",
                category: "non-fiction",
                genre: "Memoir",
                pages: 448,
                publishYear: 2018,
                description: "The memoir of former First Lady Michelle Obama.",
                rating: 4.8,
                reviews: 1876,
                available: true,
                totalCopies: 6,
                availableCopies: 4,
                tags: ["memoir", "politics", "inspiration", "biography"]
            },
            "project-hail-mary": {
                id: "project-hail-mary",
                title: "Project Hail Mary",
                author: "Andy Weir",
                cover: "https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg",
                isbn: "978-0-5931-3520-4",
                category: "fiction",
                genre: "Science Fiction",
                pages: 496,
                publishYear: 2021,
                description: "A lone astronaut must save humanity in this thrilling science fiction novel.",
                rating: 4.9,
                reviews: 1543,
                available: true,
                totalCopies: 4,
                availableCopies: 2,
                tags: ["sci-fi", "space", "humor", "adventure"]
            }
        };
    }

    // Get all books
    getAllBooks() {
        return Object.values(this.books);
    }

    // Get book by ID
    getBook(id) {
        return this.books[id] || null;
    }

    // Search books
    searchBooks(query, filters = {}) {
        const allBooks = this.getAllBooks();
        let results = allBooks;

        // Text search
        if (query) {
            const searchTerm = query.toLowerCase();
            results = results.filter(book => 
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.genre.toLowerCase().includes(searchTerm) ||
                book.tags.some(tag => tag.includes(searchTerm))
            );
        }

        // Category filter
        if (filters.category) {
            results = results.filter(book => book.category === filters.category);
        }

        // Availability filter
        if (filters.available !== undefined) {
            results = results.filter(book => book.available === filters.available);
        }

        // Genre filter
        if (filters.genre) {
            results = results.filter(book => book.genre === filters.genre);
        }

        // Rating filter
        if (filters.minRating) {
            results = results.filter(book => book.rating >= filters.minRating);
        }

        return results;
    }

    // Get books by category
    getBooksByCategory(category) {
        return this.getAllBooks().filter(book => book.category === category);
    }

    // Get available books
    getAvailableBooks() {
        return this.getAllBooks().filter(book => book.available);
    }

    // Get popular books (by rating and reviews)
    getPopularBooks(limit = 6) {
        return this.getAllBooks()
            .sort((a, b) => (b.rating * Math.log(b.reviews)) - (a.rating * Math.log(a.reviews)))
            .slice(0, limit);
    }

    // Get new arrivals (by publish year)
    getNewArrivals(limit = 6) {
        return this.getAllBooks()
            .sort((a, b) => b.publishYear - a.publishYear)
            .slice(0, limit);
    }

    // Get recommendations based on user's reading history
    getRecommendations(userFavorites = [], userHistory = [], limit = 6) {
        const allBooks = this.getAllBooks();
        const userBookIds = [...userFavorites, ...userHistory.map(h => h.bookId)];
        
        // Get books user hasn't read
        const unreadBooks = allBooks.filter(book => !userBookIds.includes(book.id));
        
        // Score books based on similarity to user's preferences
        const scoredBooks = unreadBooks.map(book => {
            let score = book.rating; // Base score
            
            // Bonus for books in same genres as user's favorites
            userFavorites.forEach(favId => {
                const favBook = this.getBook(favId);
                if (favBook && favBook.genre === book.genre) {
                    score += 1;
                }
                if (favBook && favBook.tags.some(tag => book.tags.includes(tag))) {
                    score += 0.5;
                }
            });
            
            return { ...book, recommendationScore: score };
        });
        
        return scoredBooks
            .sort((a, b) => b.recommendationScore - a.recommendationScore)
            .slice(0, limit);
    }

    // Update book availability
    updateBookAvailability(bookId, available) {
        if (this.books[bookId]) {
            this.books[bookId].available = available;
            if (available) {
                this.books[bookId].availableCopies = Math.min(
                    this.books[bookId].availableCopies + 1,
                    this.books[bookId].totalCopies
                );
            } else {
                this.books[bookId].availableCopies = Math.max(
                    this.books[bookId].availableCopies - 1,
                    0
                );
            }
        }
    }

    // Add book review
    addReview(bookId, rating, comment, userId) {
        if (this.books[bookId]) {
            if (!this.books[bookId].userReviews) {
                this.books[bookId].userReviews = [];
            }
            
            this.books[bookId].userReviews.push({
                userId,
                rating,
                comment,
                date: new Date().toISOString().split('T')[0]
            });
            
            // Recalculate average rating
            const allRatings = this.books[bookId].userReviews.map(r => r.rating);
            this.books[bookId].rating = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;
            this.books[bookId].reviews = allRatings.length;
        }
    }

    // Get book reviews
    getBookReviews(bookId) {
        const book = this.books[bookId];
        return book ? (book.userReviews || []) : [];
    }

    // Initialize the book manager
    init() {
        this.setupImageFallbacks();
    }

    // Setup image fallback handling
    setupImageFallbacks() {
        // Add error handling for book cover images
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG' && e.target.classList.contains('book-cover')) {
                e.target.src = this.getDefaultBookCover();
            }
        }, true);
    }

    // Get default book cover for fallback
    getDefaultBookCover() {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjNEY0NkU1Ii8+CjxyZWN0IHg9IjIwIiB5PSI0MCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIyMjAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSI3MCIgeT0iMTIwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNMTQgMlY4TDIwIDJNMjAgMlYxNEgyMFYyMEMxOSAyMSAxOCAyMiAxNyAyMkg3QzYgMjIgNSAyMSA0IDIwVjRDNCAzIDUgMiA2IDJIMTRaIi8+Cjwvc3ZnPgo8L3N2Zz4K';
    }
}

// Initialize book manager
const bookManager = new BookManager();
bookManager.init();
// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BookManager;
}
