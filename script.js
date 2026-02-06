// ===== DOM ELEMENTS =====
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const subTabs = document.querySelectorAll('.sub-tab');
const subTabContents = document.querySelectorAll('.sub-tab-content');
const header = document.querySelector('header');
const logo = document.querySelector('.logo');
const paperTabs = document.querySelectorAll('.paper-tab');
const paperContentSections = document.querySelectorAll('.paper-content-section');

// ===== TAB MANAGEMENT =====
class TabManager {
    constructor() {
        this.currentTab = 'current-affairs';
        this.init();
    }

    init() {
        // Initialize with Current Affairs tab active
        this.activateTab('current-affairs');
        
        // Add click events to main tabs
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        // Add click events to sub-tabs
        subTabs.forEach(subTab => {
    subTab.addEventListener('click', () => {
        const subTabId = subTab.getAttribute('data-sub-tab');
        const parentTab = subTab.closest('.tab-content').id;
        this.switchSubTab(parentTab, subTabId);
    });
});


        // Add click events to paper tabs
        paperTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const paperId = tab.getAttribute('data-paper');
                this.switchPaperTab(paperId);
            });
        });

        // Handle URL hash
        this.handleUrlHash();
    }

    handleUrlHash() {
        if (window.location.hash) {
            const tabId = window.location.hash.substring(1);
            if (tabId && document.getElementById(tabId)) {
                setTimeout(() => this.activateTab(tabId), 100);
            }
        }
    }

    switchTab(tabId) {
        // Remove active class from all tabs
        tabs.forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        
        tabContents.forEach(content => {
            content.classList.remove('active');
            content.setAttribute('hidden', 'true');
        });

        // Add active class to clicked tab
        const activeTab = document.querySelector(`[data-tab="${tabId}"]`);
        const activeContent = document.getElementById(tabId);
        
        if (activeTab && activeContent) {
            activeTab.classList.add('active');
            activeTab.setAttribute('aria-selected', 'true');
            activeContent.classList.add('active');
            activeContent.removeAttribute('hidden');
            
            this.currentTab = tabId;

            // Activate first sub-tab if exists
            const firstSubTab = activeContent.querySelector('.sub-tab');
            if (firstSubTab) {
                const firstSubTabId = firstSubTab.getAttribute('data-sub-tab');
                this.activateSubTab(firstSubTabId);
            }

            // Update URL without refresh
            history.pushState(null, null, `#${tabId}`);
            
            // Add animation
            this.animateTabSwitch(activeContent);
        }
    }

    switchSubTab(parentTab, subTabId) {
        const parentContent = document.getElementById(parentTab);
        if (!parentContent) return;

        // Remove active class from all sub-tabs in this parent
        parentContent.querySelectorAll('.sub-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        
        parentContent.querySelectorAll('.sub-tab-content').forEach(content => {
            content.classList.remove('active');
            content.setAttribute('hidden', 'true');
        });

        // Add active class to clicked sub-tab
        const activeSubTab = parentContent.querySelector(`[data-sub-tab="${subTabId}"]`);
        const activeSubContent = document.getElementById(subTabId);
        
        if (activeSubTab && activeSubContent) {
            activeSubTab.classList.add('active');
            activeSubTab.setAttribute('aria-selected', 'true');
            activeSubContent.classList.add('active');
            activeSubContent.removeAttribute('hidden');
            
            // Add animation
            this.animateSubTabSwitch(activeSubContent);
        }
    }

    switchPaperTab(paperId) {
        // Remove active class from all paper tabs
        paperTabs.forEach(tab => tab.classList.remove('active'));
        paperContentSections.forEach(content => {
            content.classList.remove('active');
            content.setAttribute('hidden', 'true');
        });

        // Add active class to clicked paper tab
        const activePaperTab = document.querySelector(`[data-paper="${paperId}"]`);
        const activePaperContent = document.getElementById(paperId);
        
        if (activePaperTab && activePaperContent) {
            activePaperTab.classList.add('active');
            activePaperContent.classList.add('active');
            activePaperContent.removeAttribute('hidden');
        }
    }

    activateTab(tabId) {
        const tab = document.querySelector(`[data-tab="${tabId}"]`);
        if (tab) tab.click();
    }

    activateSubTab(subTabId) {
        const subTab = document.querySelector(`[data-sub-tab="${subTabId}"]`);
        if (subTab) subTab.click();
    }

    animateTabSwitch(element) {
        element.style.animation = 'none';
        requestAnimationFrame(() => {
            element.style.animation = 'fadeIn 0.5s ease';
        });
    }

    animateSubTabSwitch(element) {
        element.style.animation = 'none';
        requestAnimationFrame(() => {
            element.style.animation = 'fadeIn 0.5s ease';
        });
    }
}

// ===== STICKY HEADER =====
class StickyHeader {
    constructor() {
        this.lastScroll = 0;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Add shadow when scrolled
            if (currentScroll > 50) {
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
                header.style.padding = '10px 0';
            } else {
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
                header.style.padding = '15px 0';
            }

            // Logo animation on scroll
            if (currentScroll > 100) {
                logo.style.transform = 'scale(0.9)';
            } else {
                logo.style.transform = 'scale(1)';
            }

            this.lastScroll = currentScroll;
        });
    }
}

// ===== SEARCH FUNCTIONALITY =====
class SearchManager {
    constructor() {
        this.searchBox = null;
        this.init();
    }

    init() {
        this.createSearchBox();
        this.setupSearch();
    }

    createSearchBox() {
        this.searchBox = document.createElement('div');
        this.searchBox.className = 'search-box';
        this.searchBox.innerHTML = `
            <div class="search-container">
                <input type="text" class="search-input" placeholder="Search notes..." aria-label="Search notes">
                <button class="search-btn" aria-label="Search">
                    <i class="fas fa-search"></i>
                </button>
                <div class="search-results" aria-live="polite"></div>
            </div>
        `;
        
        document.body.appendChild(this.searchBox);
    }

    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchResults = document.querySelector('.search-results');
        const searchBtn = document.querySelector('.search-btn');

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length >= 2) {
                this.performSearch(query);
            } else {
                searchResults.style.display = 'none';
            }
        });

        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.toLowerCase().trim();
            if (query) {
                this.performSearch(query);
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                searchResults.style.display = 'none';
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchResults.style.display = 'none';
                searchInput.blur();
            }
        });
    }

    performSearch(query) {
        const results = this.searchContent(query);
        this.displayResults(results, query);
    }

    searchContent(query) {
        const results = [];
        const contentElements = document.querySelectorAll('h2, h3, h4, p, li, .topic-card, .category-card');
        
        contentElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(query)) {
                const parentCard = element.closest('.content-card, .topic-card, .category-card');
                if (parentCard) {
                    const title = element.closest('h2, h3, h4')?.textContent || 'Content';
                    const excerpt = element.textContent.substring(0, 100) + '...';
                    const tab = this.findParentTab(parentCard);
                    
                    results.push({
                        title,
                        excerpt,
                        element: parentCard,
                        tab
                    });
                }
            }
        });
        
        return results.slice(0, 10); // Limit to 10 results
    }

    findParentTab(element) {
        let parent = element;
        while (parent && !parent.classList.contains('tab-content')) {
            parent = parent.parentElement;
        }
        return parent ? parent.id : null;
    }

    displayResults(results, query) {
        const searchResults = document.querySelector('.search-results');
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
        } else {
            searchResults.innerHTML = results.map((result, index) => `
                <div class="search-result-item" data-index="${index}" role="button" tabindex="0">
                    <strong>${this.highlightText(result.title, query)}</strong>
                    <p>${this.highlightText(result.excerpt, query)}</p>
                    <small>${result.tab}</small>
                </div>
            `).join('');
            
            // Add click events to result items
            searchResults.querySelectorAll('.search-result-item').forEach((item, index) => {
                item.addEventListener('click', () => {
                    this.navigateToResult(results[index]);
                });
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.navigateToResult(results[index]);
                    }
                });
            });
        }
        
        searchResults.style.display = 'block';
    }

    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    navigateToResult(result) {
        // Switch to the appropriate tab
        if (result.tab) {
            const tabManager = new TabManager();
            tabManager.switchTab(result.tab);
            
            // Scroll to the element with highlight
            setTimeout(() => {
                result.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Add highlight effect
                result.element.style.animation = 'none';
                setTimeout(() => {
                    result.element.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.5)';
                    result.element.style.transition = 'box-shadow 0.3s ease';
                    
                    setTimeout(() => {
                        result.element.style.boxShadow = '';
                    }, 2000);
                }, 300);
            }, 500);
        }
        
        // Hide search results
        document.querySelector('.search-results').style.display = 'none';
    }
}

// ===== PROGRESS TRACKER =====
class ProgressTracker {
    constructor() {
        this.visitedTabs = new Set();
        this.progressBar = null;
        this.init();
    }

    init() {
        // Load saved progress
        this.loadProgress();
        
        // Mark current affairs as visited by default
        this.visitedTabs.add('current-affairs');
        
        // Track tab visits
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                this.markAsVisited(tabId);
            });
        });

        // Track sub-tab visits
        subTabs.forEach(subTab => {
            subTab.addEventListener('click', () => {
                const subTabId = subTab.getAttribute('data-sub-tab');
                this.markAsVisited(subTabId);
            });
        });

        // Create progress bar
        this.createProgressBar();
    }

    createProgressBar() {
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'progress-bar';
        this.progressBar.setAttribute('role', 'progressbar');
        this.progressBar.setAttribute('aria-valuemin', '0');
        this.progressBar.setAttribute('aria-valuemax', '100');
        document.body.appendChild(this.progressBar);
        
        // Update progress
        this.updateProgress();
    }

    markAsVisited(id) {
        this.visitedTabs.add(id);
        localStorage.setItem('visitedTabs', JSON.stringify([...this.visitedTabs]));
        this.updateProgress();
    }

    updateProgress() {
        const totalItems = tabs.length + subTabs.length;
        const progress = Math.min((this.visitedTabs.size / totalItems) * 100, 100);
        
        if (this.progressBar) {
            this.progressBar.style.width = `${progress}%`;
            this.progressBar.setAttribute('aria-valuenow', progress);
            this.progressBar.setAttribute('aria-label', `${Math.round(progress)}% of content viewed`);
        }
    }

    loadProgress() {
        const saved = localStorage.getItem('visitedTabs');
        if (saved) {
            this.visitedTabs = new Set(JSON.parse(saved));
        }
    }
}

// ===== BOOKMARK SYSTEM =====
class BookmarkManager {
    constructor() {
        this.bookmarks = new Set();
        this.init();
    }

    init() {
        this.loadBookmarks();
        this.addBookmarkButtons();
    }

    addBookmarkButtons() {
        // Add bookmark button to each content section
        document.querySelectorAll('.topic-card, .category-section').forEach(section => {
            const heading = section.querySelector('h3, h4');
            if (heading) {
                const bookmarkBtn = document.createElement('button');
                bookmarkBtn.className = 'bookmark-btn';
                bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i>';
                bookmarkBtn.title = 'Bookmark this section';
                bookmarkBtn.setAttribute('aria-label', `Bookmark ${heading.textContent}`);
                
                section.style.position = 'relative';
                section.appendChild(bookmarkBtn);
                
                bookmarkBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleBookmark(section, heading.textContent);
                });
                
                // Update icon if already bookmarked
                if (this.bookmarks.has(heading.textContent)) {
                    bookmarkBtn.innerHTML = '<i class="fas fa-bookmark" style="color: var(--accent);"></i>';
                }
            }
        });
    }

    toggleBookmark(section, title) {
        const bookmarkBtn = section.querySelector('.bookmark-btn');
        
        if (this.bookmarks.has(title)) {
            this.bookmarks.delete(title);
            bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i>';
            this.showNotification(`"${title}" removed from bookmarks`);
        } else {
            this.bookmarks.add(title);
            bookmarkBtn.innerHTML = '<i class="fas fa-bookmark" style="color: var(--accent);"></i>';
            this.showNotification(`"${title}" bookmarked!`);
        }
        
        this.saveBookmarks();
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    saveBookmarks() {
        localStorage.setItem('bookmarks', JSON.stringify([...this.bookmarks]));
    }

    loadBookmarks() {
        const saved = localStorage.getItem('bookmarks');
        if (saved) {
            this.bookmarks = new Set(JSON.parse(saved));
        }
    }
}

// ===== RESPONSIVE MENU =====
class ResponsiveMenu {
    constructor() {
        this.menuBtn = null;
        this.nav = null;
        this.init();
    }

    init() {
        this.createMenuButton();
        this.setupMenu();
    }

    createMenuButton() {
        this.menuBtn = document.createElement('button');
        this.menuBtn.className = 'menu-toggle';
        this.menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        this.menuBtn.setAttribute('aria-label', 'Toggle navigation menu');
        this.menuBtn.setAttribute('aria-expanded', 'false');
        
        const headerContent = document.querySelector('.header-content');
        headerContent.appendChild(this.menuBtn);
        
        this.nav = document.querySelector('.main-nav');
    }

    setupMenu() {
        this.menuBtn.addEventListener('click', () => {
            const isExpanded = this.menuBtn.getAttribute('aria-expanded') === 'true';
            this.menuBtn.setAttribute('aria-expanded', !isExpanded);
            this.nav.classList.toggle('active');
            
            // Change icon
            const icon = this.menuBtn.querySelector('i');
            icon.className = isExpanded ? 'fas fa-bars' : 'fas fa-times';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.main-nav') && !e.target.closest('.menu-toggle')) {
                this.nav.classList.remove('active');
                this.menuBtn.setAttribute('aria-expanded', 'false');
                this.menuBtn.querySelector('i').className = 'fas fa-bars';
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.nav.classList.remove('active');
                this.menuBtn.setAttribute('aria-expanded', 'false');
                this.menuBtn.querySelector('i').className = 'fas fa-bars';
            }
        });
    }
}

// ===== INITIALIZE ALL FEATURES =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all managers
    const tabManager = new TabManager();
    const stickyHeader = new StickyHeader();
    const progressTracker = new ProgressTracker();
    const searchManager = new SearchManager();
    const bookmarkManager = new BookmarkManager();
    const responsiveMenu = new ResponsiveMenu();
    
    // Initialize Print & Download Manager
    const printManager = new PrintDownloadManager();
    
    // Load dark mode preference
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        const darkModeBtn = document.querySelector('.dark-mode-btn');
        if (darkModeBtn) {
            darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + F for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            document.querySelector('.search-input')?.focus();
        }
        
        // Ctrl/Cmd + P for print
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            printManager.printCurrentTab();
        }
    });
    
    console.log('TGPSC Notes Professional Edition loaded successfully!');
});

// ===== PRINT & DOWNLOAD MANAGER =====
class PrintDownloadManager {
    constructor() {
        this.init();
    }

    init() {
        this.createToolbar();
    }

    createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'print-toolbar';
        toolbar.innerHTML = `
            <button class="print-btn" title="Print Notes" aria-label="Print current notes">
                <i class="fas fa-print"></i>
            </button>
            <button class="download-btn" title="Download as PDF" aria-label="Download as PDF">
                <i class="fas fa-download"></i>
            </button>
            <button class="dark-mode-btn" title="Toggle Dark Mode" aria-label="Toggle dark mode">
                <i class="fas fa-moon"></i>
            </button>
        `;
        
        document.body.appendChild(toolbar);
        
        // Add event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        // Print button
        document.querySelector('.print-btn')?.addEventListener('click', () => {
            this.printCurrentTab();
        });
        
        // Download button
        document.querySelector('.download-btn')?.addEventListener('click', () => {
            this.downloadAsPDF();
        });
        
        // Dark mode button
        document.querySelector('.dark-mode-btn')?.addEventListener('click', () => {
            this.toggleDarkMode();
        });
    }

    printCurrentTab() {
        const activeContent = document.querySelector('.tab-content.active');
        if (activeContent) {
            const printContent = activeContent.cloneNode(true);
            
            // Remove interactive elements
            printContent.querySelectorAll('button, .search-box, .print-toolbar, .bookmark-btn').forEach(el => el.remove());
            
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>TGPSC Notes - Print</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            line-height: 1.6; 
                            margin: 0;
                            padding: 20px;
                            color: #333;
                        }
                        .print-content { 
                            max-width: 800px; 
                            margin: 0 auto; 
                        }
                        h1, h2, h3 { 
                            color: #0c4b8a; 
                            margin-top: 1.5em;
                            margin-bottom: 0.5em;
                        }
                        h1 { font-size: 28px; }
                        h2 { font-size: 24px; }
                        h3 { font-size: 20px; }
                        ul, ol { 
                            margin-left: 20px;
                            margin-bottom: 1em;
                        }
                        li { 
                            margin-bottom: 0.5em;
                        }
                        .content-card {
                            background: white;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            margin-bottom: 20px;
                        }
                        .content-header {
                            border-bottom: 2px solid #0c4b8a;
                            padding-bottom: 10px;
                            margin-bottom: 20px;
                        }
                        .update-badge {
                            background: #ff6b6b;
                            color: white;
                            padding: 5px 15px;
                            border-radius: 15px;
                            font-size: 12px;
                            display: inline-block;
                        }
                        @media print {
                            @page { margin: 1cm; }
                            body { font-size: 12pt; }
                            .no-print { display: none !important; }
                            a { color: #0c4b8a; text-decoration: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="print-content">
                        <h1>TGPSC Notes - Printed Content</h1>
                        <p>Printed on: ${new Date().toLocaleDateString()}</p>
                        <hr>
                        ${printContent.innerHTML}
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close();
            
            // Wait for content to load
            printWindow.onload = function() {
                setTimeout(() => {
                    printWindow.focus();
                    printWindow.print();
                    printWindow.onafterprint = function() {
                        printWindow.close();
                    };
                }, 500);
            };
        }
    }

    downloadAsPDF() {
        // This would typically use a PDF generation library
        alert('PDF download feature requires server-side implementation.\nFor now, please use the print function and save as PDF.');
    }

    toggleDarkMode() {
        const body = document.body;
        const isDark = body.classList.toggle('dark-mode');
        const icon = document.querySelector('.dark-mode-btn i');
        
        if (isDark) {
            icon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        } else {
            icon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        }
    }
}