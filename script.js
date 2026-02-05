// ===== TAB MANAGEMENT SYSTEM =====
class TabManager {
    constructor() {
        this.currentTab = 'current-affairs';
        this.currentSubTab = null;
        this.currentPaperTab = null;
        this.init();
    }

    init() {
        this.setupTabListeners();
        this.setupSubTabListeners();
        this.setupPaperTabListeners();
        this.setupQuickNavigation();
        this.updateBreadcrumb();
        
        // Initialize first tab
        this.switchTab(this.currentTab);
    }

    setupTabListeners() {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                this.switchTab(tabId);
            });
            
            // Keyboard navigation
            tab.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const tabId = tab.getAttribute('data-tab');
                    this.switchTab(tabId);
                }
            });
        });
    }

    setupSubTabListeners() {
        const subTabs = document.querySelectorAll('.sub-tab');
        subTabs.forEach(subTab => {
            subTab.addEventListener('click', () => {
                const subTabId = subTab.getAttribute('data-sub-tab');
                this.switchSubTab(subTabId);
            });
            
            // Keyboard navigation
            subTab.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const subTabId = subTab.getAttribute('data-sub-tab');
                    this.switchSubTab(subTabId);
                }
            });
        });
    }

    setupPaperTabListeners() {
        const paperTabs = document.querySelectorAll('.paper-tab');
        paperTabs.forEach(paperTab => {
            paperTab.addEventListener('click', () => {
                const paperTabId = paperTab.getAttribute('data-paper');
                this.switchPaperTab(paperTabId);
            });
        });
    }

    setupQuickNavigation() {
        const quickNav = document.querySelector('.tab-quick-nav');
        if (!quickNav) return;
        
        quickNav.querySelectorAll('.quick-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-target');
                const [tabId, subTabId] = target.split('-');
                
                this.switchTab(tabId);
                setTimeout(() => {
                    this.switchSubTab(subTabId);
                }, 100);
            });
        });
    }

    switchTab(tabId) {
        // Update URL hash
        history.pushState(null, '', `#${tabId}`);
        
        // Update main tabs
        document.querySelectorAll('.tab').forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        
        const activeTab = document.querySelector(`.tab[data-tab="${tabId}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.setAttribute('aria-selected', 'true');
        }

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(tc => {
            tc.classList.remove('active');
            tc.setAttribute('hidden', 'true');
        });
        
        const tabContent = document.getElementById(tabId);
        if (tabContent) {
            tabContent.classList.add('active');
            tabContent.removeAttribute('hidden');
        }

        // Reset sub-tabs and paper tabs
        this.currentTab = tabId;
        this.currentSubTab = null;
        this.currentPaperTab = null;

        // Update quick navigation
        this.updateQuickNavigation();

        // Update breadcrumb
        this.updateBreadcrumb();

        // Show loading animation
        this.showContentLoading();

        // Load content after a short delay
        setTimeout(() => {
            this.hideContentLoading();
            this.scrollToTop();
            
            // If the tab has sub-tabs, activate the first one
            const subTab = document.querySelector(`#${tabId} .sub-tab.active`);
            if (subTab) {
                const subTabId = subTab.getAttribute('data-sub-tab');
                this.switchSubTab(subTabId);
            }
        }, 300);
    }

    switchSubTab(subTabId) {
        // Update sub-tabs
        const subTabContainer = document.querySelector(`#${this.currentTab} .sub-tabs`);
        if (subTabContainer) {
            subTabContainer.querySelectorAll('.sub-tab').forEach(st => {
                st.classList.remove('active');
                st.setAttribute('aria-selected', 'false');
            });
            
            const activeSubTab = subTabContainer.querySelector(`.sub-tab[data-sub-tab="${subTabId}"]`);
            if (activeSubTab) {
                activeSubTab.classList.add('active');
                activeSubTab.setAttribute('aria-selected', 'true');
            }
        }

        // Update sub-tab content
        const subTabContentContainer = document.getElementById(this.currentTab);
        if (subTabContentContainer) {
            subTabContentContainer.querySelectorAll('.sub-tab-content').forEach(stc => {
                stc.classList.remove('active');
                stc.setAttribute('hidden', 'true');
            });
            
            const subTabContent = subTabContentContainer.querySelector(`#${subTabId}`);
            if (subTabContent) {
                subTabContent.classList.add('active');
                subTabContent.removeAttribute('hidden');
            }
        }

        this.currentSubTab = subTabId;
        this.currentPaperTab = null;

        // Update quick navigation
        this.updateQuickNavigation();

        // Update breadcrumb
        this.updateBreadcrumb();

        // Show loading animation
        this.showContentLoading();

        // Load content after a short delay
        setTimeout(() => {
            this.hideContentLoading();
            this.scrollToTop();
        }, 300);
    }

    switchPaperTab(paperTabId) {
        // Update paper tabs
        const paperTabContainer = document.querySelector(`#${this.currentSubTab} .papers-tab-nav`);
        if (paperTabContainer) {
            paperTabContainer.querySelectorAll('.paper-tab').forEach(pt => {
                pt.classList.remove('active');
                pt.setAttribute('aria-selected', 'false');
            });
            
            const activePaperTab = paperTabContainer.querySelector(`.paper-tab[data-paper="${paperTabId}"]`);
            if (activePaperTab) {
                activePaperTab.classList.add('active');
                activePaperTab.setAttribute('aria-selected', 'true');
            }
        }

        // Update paper tab content
        const paperContentContainer = document.getElementById(this.currentSubTab);
        if (paperContentContainer) {
            paperContentContainer.querySelectorAll('.paper-content-section').forEach(pc => {
                pc.classList.remove('active');
                pc.setAttribute('hidden', 'true');
            });
            
            const paperContent = paperContentContainer.querySelector(`#${paperTabId}`);
            if (paperContent) {
                paperContent.classList.add('active');
                paperContent.removeAttribute('hidden');
            }
        }

        this.currentPaperTab = paperTabId;

        // Update breadcrumb
        this.updateBreadcrumb();

        // Show loading animation
        this.showContentLoading();

        // Load content after a short delay
        setTimeout(() => {
            this.hideContentLoading();
            this.scrollToTop();
        }, 300);
    }

    updateQuickNavigation() {
        const quickNav = document.querySelector('.tab-quick-nav');
        if (!quickNav) return;
        
        quickNav.querySelectorAll('.quick-nav-btn').forEach(btn => {
            btn.classList.remove('active');
            const target = btn.getAttribute('data-target');
            if (target === `${this.currentTab}-${this.currentSubTab}`) {
                btn.classList.add('active');
            }
        });
    }

    updateBreadcrumb() {
        const breadcrumb = document.querySelector('.breadcrumb');
        if (!breadcrumb) return;
        
        // Clear existing breadcrumb items
        breadcrumb.innerHTML = '';
        
        // Add home
        const homeItem = this.createBreadcrumbItem('Home', 'fas fa-home', '#current-affairs');
        breadcrumb.appendChild(homeItem);
        
        // Add separator
        breadcrumb.appendChild(this.createBreadcrumbSeparator());
        
        // Add current tab
        const tabNames = {
            'current-affairs': 'Current Affairs',
            'group1': 'Group-I',
            'group2': 'Group-II',
            'group3': 'Group-III',
            'group4': 'Group-IV',
            'combined': 'Other Exams'
        };
        
        const tabIcon = document.querySelector(`.tab[data-tab="${this.currentTab}"] .tab-icon`).className;
        const tabItem = this.createBreadcrumbItem(
            tabNames[this.currentTab] || this.currentTab,
            tabIcon,
            `#${this.currentTab}`
        );
        breadcrumb.appendChild(tabItem);
        
        // Add sub-tab if exists
        if (this.currentSubTab) {
            breadcrumb.appendChild(this.createBreadcrumbSeparator());
            
            const subTabElement = document.querySelector(`.sub-tab[data-sub-tab="${this.currentSubTab}"]`);
            if (subTabElement) {
                const subTabIcon = subTabElement.querySelector('i').className;
                const subTabText = subTabElement.querySelector('span').textContent;
                const subTabItem = this.createBreadcrumbItem(
                    subTabText,
                    subTabIcon,
                    `#${this.currentSubTab}`,
                    true
                );
                breadcrumb.appendChild(subTabItem);
            }
        }
    }

    createBreadcrumbItem(text, icon, href, isActive = false) {
        const item = document.createElement('div');
        item.className = `breadcrumb-item ${isActive ? 'active' : ''}`;
        
        const iconEl = document.createElement('i');
        iconEl.className = icon;
        
        const link = document.createElement('a');
        link.href = href;
        link.textContent = text;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (href.startsWith('#')) {
                const target = href.substring(1);
                if (target.includes('-')) {
                    const [tabId, subTabId] = target.split('-');
                    this.switchTab(tabId);
                    setTimeout(() => this.switchSubTab(subTabId), 100);
                } else {
                    this.switchTab(target);
                }
            }
        });
        
        item.appendChild(iconEl);
        item.appendChild(link);
        return item;
    }

    createBreadcrumbSeparator() {
        const separator = document.createElement('div');
        separator.className = 'breadcrumb-separator';
        separator.innerHTML = '<i class="fas fa-chevron-right"></i>';
        return separator;
    }

    showContentLoading() {
        const activeContent = document.querySelector('.tab-content.active .sub-tab-content.active') || 
                              document.querySelector('.tab-content.active');
        
        if (activeContent) {
            activeContent.classList.add('content-loading');
        }
    }

    hideContentLoading() {
        document.querySelectorAll('.content-loading').forEach(el => {
            el.classList.remove('content-loading');
        });
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ===== CONTENT SEARCH SYSTEM =====
class ContentSearch {
    constructor() {
        this.searchResults = [];
        this.init();
    }

    init() {
        this.createSearchInterface();
        this.setupSearchListeners();
    }

    createSearchInterface() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <input type="text" class="search-input" placeholder="Search notes, topics, keywords...">
            <button class="search-btn" aria-label="Search">
                <i class="fas fa-search"></i>
            </button>
            <div class="search-results"></div>
        `;
        
        const header = document.querySelector('.header-content');
        if (header) {
            header.appendChild(searchContainer);
        }
    }

    setupSearchListeners() {
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');
        const searchResults = document.querySelector('.search-results');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (query.length > 2) {
                    this.performSearch(query);
                } else {
                    this.clearResults();
                }
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(searchInput.value.trim());
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch(searchInput.value.trim());
            });
        }

        // Close results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.clearResults();
            }
        });
    }

    performSearch(query) {
        if (!query || query.length < 3) {
            this.clearResults();
            return;
        }

        const results = [];
        const searchLower = query.toLowerCase();
        
        // Search in all content
        const contentElements = document.querySelectorAll(
            '.tab-content h1, .tab-content h2, .tab-content h3, .tab-content h4, ' +
            '.tab-content p, .tab-content li, .tab-content .topic-card, ' +
            '.tab-content .category-card, .tab-content .exam-card'
        );

        contentElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(searchLower)) {
                const parentTab = element.closest('.tab-content');
                const parentSubTab = element.closest('.sub-tab-content');
                
                if (parentTab && parentSubTab) {
                    results.push({
                        element: element,
                        tabId: parentTab.id,
                        subTabId: parentSubTab.id,
                        text: element.textContent.substring(0, 100) + '...'
                    });
                }
            }
        });

        this.displayResults(results);
    }

    displayResults(results) {
        const searchResults = document.querySelector('.search-results');
        if (!searchResults) return;

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
            searchResults.style.display = 'block';
            return;
        }

        let html = '';
        results.forEach((result, index) => {
            html += `
                <div class="search-result-item" data-index="${index}">
                    <div class="result-title">${this.getTabName(result.tabId)} › ${this.getSubTabName(result.subTabId)}</div>
                    <div class="result-text">${result.text}</div>
                </div>
            `;
        });

        searchResults.innerHTML = html;
        searchResults.style.display = 'block';

        // Add click handlers
        document.querySelectorAll('.search-result-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.navigateToResult(results[index]);
            });
        });
    }

    getTabName(tabId) {
        const tabNames = {
            'current-affairs': 'Current Affairs',
            'group1': 'Group-I',
            'group2': 'Group-II',
            'group3': 'Group-III',
            'group4': 'Group-IV',
            'combined': 'Other Exams'
        };
        return tabNames[tabId] || tabId;
    }

    getSubTabName(subTabId) {
        // Extract readable name from subTabId
        const parts = subTabId.split('-');
        if (parts.length >= 2) {
            const type = parts[parts.length - 1];
            if (type === 'scheme') return 'Scheme & Syllabus';
            if (type.startsWith('paper')) return `Paper-${type.slice(-1)}`;
        }
        return subTabId;
    }

    navigateToResult(result) {
        const tabManager = window.tabManager;
        if (tabManager) {
            tabManager.switchTab(result.tabId);
            setTimeout(() => {
                tabManager.switchSubTab(result.subTabId);
                
                // Scroll to the element
                setTimeout(() => {
                    result.element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    
                    // Highlight the element
                    result.element.style.backgroundColor = 'rgba(255, 235, 59, 0.3)';
                    setTimeout(() => {
                        result.element.style.backgroundColor = '';
                    }, 2000);
                }, 500);
            }, 100);
        }

        this.clearResults();
        document.querySelector('.search-input').value = '';
    }

    clearResults() {
        const searchResults = document.querySelector('.search-results');
        if (searchResults) {
            searchResults.style.display = 'none';
            searchResults.innerHTML = '';
        }
    }
}

// ===== BOOKMARK SYSTEM =====
class BookmarkManager {
    constructor() {
        this.bookmarks = JSON.parse(localStorage.getItem('tgpsc_bookmarks')) || [];
        this.init();
    }

    init() {
        this.createBookmarkButton();
        this.setupBookmarkListeners();
        this.loadBookmarks();
    }

    createBookmarkButton() {
        const button = document.createElement('button');
        button.className = 'bookmark-btn';
        button.innerHTML = '<i class="far fa-bookmark"></i>';
        button.title = 'Bookmark this page';
        button.setAttribute('aria-label', 'Bookmark this page');
        
        const header = document.querySelector('.header-content');
        if (header) {
            header.appendChild(button);
        }
    }

    setupBookmarkListeners() {
        const bookmarkBtn = document.querySelector('.bookmark-btn');
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', () => {
                this.toggleBookmark();
            });
        }

        // Update bookmark icon on tab change
        document.addEventListener('tabChanged', () => {
            this.updateBookmarkIcon();
        });
    }

    toggleBookmark() {
        const currentPath = this.getCurrentPath();
        const existingIndex = this.bookmarks.findIndex(b => b.path === currentPath);

        if (existingIndex > -1) {
            // Remove bookmark
            this.bookmarks.splice(existingIndex, 1);
            this.showNotification('Bookmark removed', 'info');
        } else {
            // Add bookmark
            const bookmark = {
                id: Date.now(),
                path: currentPath,
                title: this.getPageTitle(),
                timestamp: new Date().toISOString(),
                tab: window.tabManager?.currentTab,
                subTab: window.tabManager?.currentSubTab
            };
            this.bookmarks.unshift(bookmark);
            this.showNotification('Bookmark added', 'success');
        }

        this.saveBookmarks();
        this.updateBookmarkIcon();
    }

    getCurrentPath() {
        return `${window.tabManager?.currentTab}-${window.tabManager?.currentSubTab}`;
    }

    getPageTitle() {
        const tabName = this.getTabName(window.tabManager?.currentTab);
        const subTabName = this.getSubTabName(window.tabManager?.currentSubTab);
        return `${tabName} - ${subTabName}`;
    }

    getTabName(tabId) {
        const tabNames = {
            'current-affairs': 'Current Affairs',
            'group1': 'Group-I',
            'group2': 'Group-II',
            'group3': 'Group-III',
            'group4': 'Group-IV',
            'combined': 'Other Exams'
        };
        return tabNames[tabId] || tabId;
    }

    getSubTabName(subTabId) {
        if (!subTabId) return 'Overview';
        const element = document.querySelector(`.sub-tab[data-sub-tab="${subTabId}"] span`);
        return element ? element.textContent : subTabId;
    }

    updateBookmarkIcon() {
        const bookmarkBtn = document.querySelector('.bookmark-btn');
        if (!bookmarkBtn) return;

        const currentPath = this.getCurrentPath();
        const isBookmarked = this.bookmarks.some(b => b.path === currentPath);

        const icon = bookmarkBtn.querySelector('i');
        if (icon) {
            icon.className = isBookmarked ? 'fas fa-bookmark' : 'far fa-bookmark';
        }
    }

    saveBookmarks() {
        localStorage.setItem('tgpsc_bookmarks', JSON.stringify(this.bookmarks));
    }

    loadBookmarks() {
        // Load bookmarks from localStorage
        this.bookmarks = JSON.parse(localStorage.getItem('tgpsc_bookmarks')) || [];
        this.updateBookmarkIcon();
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ===== PRINT MANAGER =====
class PrintManager {
    constructor() {
        this.init();
    }

    init() {
        this.createPrintToolbar();
        this.setupPrintListeners();
    }

    createPrintToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'print-toolbar';
        toolbar.innerHTML = `
            <button class="print-btn" title="Print Current Page" aria-label="Print Current Page">
                <i class="fas fa-print"></i>
            </button>
            <button class="download-btn" title="Download as PDF" aria-label="Download as PDF">
                <i class="fas fa-file-pdf"></i>
            </button>
            <button class="dark-mode-btn" title="Toggle Dark Mode" aria-label="Toggle Dark Mode">
                <i class="fas fa-moon"></i>
            </button>
        `;
        
        document.body.appendChild(toolbar);
    }

    setupPrintListeners() {
        // Print button
        const printBtn = document.querySelector('.print-btn');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                this.printCurrentPage();
            });
        }

        // Download button
        const downloadBtn = document.querySelector('.download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadAsPDF();
            });
        }

        // Dark mode button
        const darkModeBtn = document.querySelector('.dark-mode-btn');
        if (darkModeBtn) {
            darkModeBtn.addEventListener('click', () => {
                this.toggleDarkMode();
            });
        }
    }

    printCurrentPage() {
        // Get current content
        const currentContent = document.querySelector('.tab-content.active .sub-tab-content.active') || 
                               document.querySelector('.tab-content.active');
        
        if (!currentContent) return;

        // Create print window
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>TGPSC Notes - ${document.title}</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .print-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0c4b8a; padding-bottom: 20px; }
                    .print-header h1 { color: #0c4b8a; margin-bottom: 10px; }
                    .print-meta { color: #666; font-size: 14px; }
                    .content-section { margin-bottom: 20px; }
                    .content-section h2 { color: #0c4b8a; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
                    .content-section h3 { color: #1a6bb3; margin-top: 15px; }
                    .topic-list { list-style: none; padding-left: 20px; }
                    .topic-list li { margin-bottom: 8px; position: relative; }
                    .topic-list li:before { content: "•"; color: #0c4b8a; font-weight: bold; position: absolute; left: -15px; }
                    @media print {
                        .no-print { display: none !important; }
                        body { font-size: 12pt; }
                        .page-break { page-break-before: always; }
                    }
                </style>
            </head>
            <body>
                <div class="print-header">
                    <h1>TGPSC Notes</h1>
                    <div class="print-meta">
                        Printed on: ${new Date().toLocaleDateString()} | 
                        Source: tgpscnotes.com
                    </div>
                </div>
                ${currentContent.innerHTML}
                <div class="print-footer" style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
                    <p>For more study materials, visit: https://tgpscnotes.com</p>
                    <p>© 2024 TGPSC Notes. All rights reserved.</p>
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        // Wait for content to load
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    }

    downloadAsPDF() {
        this.showNotification('PDF download feature coming soon!', 'info');
        // Note: For actual PDF download, you would need a backend service or use a library like jsPDF
    }

    toggleDarkMode() {
        const body = document.body;
        const isDarkMode = body.classList.contains('dark-mode');
        const icon = document.querySelector('.dark-mode-btn i');
        
        if (isDarkMode) {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            if (icon) icon.className = 'fas fa-moon';
            this.showNotification('Light mode activated', 'info');
        } else {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            if (icon) icon.className = 'fas fa-sun';
            this.showNotification('Dark mode activated', 'info');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ===== PROGRESS TRACKER =====
class ProgressTracker {
    constructor() {
        this.progress = JSON.parse(localStorage.getItem('tgpsc_progress')) || {};
        this.init();
    }

    init() {
        this.createProgressBar();
        this.setupProgressTracking();
        this.loadProgress();
    }

    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        document.body.appendChild(progressBar);
    }

    setupProgressTracking() {
        // Track scroll progress
        window.addEventListener('scroll', () => {
            this.updateScrollProgress();
        });

        // Track content viewing
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.markAsViewed(entry.target);
                }
            });
        }, { threshold: 0.5 });

        // Observe all content sections
        document.querySelectorAll('.topic-card, .category-card, .exam-card').forEach(card => {
            observer.observe(card);
        });
    }

    updateScrollProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    }

    markAsViewed(element) {
        const currentPath = this.getCurrentPath();
        const elementId = element.id || `element-${Date.now()}`;
        
        if (!this.progress[currentPath]) {
            this.progress[currentPath] = [];
        }
        
        if (!this.progress[currentPath].includes(elementId)) {
            this.progress[currentPath].push(elementId);
            this.saveProgress();
            this.updateProgressIndicator();
        }
    }

    getCurrentPath() {
        return `${window.tabManager?.currentTab}-${window.tabManager?.currentSubTab}`;
    }

    saveProgress() {
        localStorage.setItem('tgpsc_progress', JSON.stringify(this.progress));
    }

    loadProgress() {
        const currentPath = this.getCurrentPath();
        const viewedElements = this.progress[currentPath] || [];
        
        // Mark viewed elements
        viewedElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                element.classList.add('viewed');
            }
        });
    }

    updateProgressIndicator() {
        const currentPath = this.getCurrentPath();
        const viewedCount = (this.progress[currentPath] || []).length;
        const totalElements = document.querySelectorAll('.topic-card, .category-card, .exam-card').length;
        const percentage = totalElements > 0 ? Math.round((viewedCount / totalElements) * 100) : 0;
        
        // Update progress in tab if needed
        const tab = document.querySelector(`.tab[data-tab="${window.tabManager?.currentTab}"]`);
        if (tab && percentage > 0) {
            let progressBadge = tab.querySelector('.progress-badge');
            if (!progressBadge) {
                progressBadge = document.createElement('span');
                progressBadge.className = 'progress-badge';
                tab.appendChild(progressBadge);
            }
            progressBadge.textContent = `${percentage}%`;
        }
    }
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Tab Manager
    window.tabManager = new TabManager();
    
    // Initialize Search
    const searchManager = new ContentSearch();
    
    // Initialize Bookmark Manager
    const bookmarkManager = new BookmarkManager();
    
    // Initialize Print Manager
    const printManager = new PrintManager();
    
    // Initialize Progress Tracker
    const progressTracker = new ProgressTracker();
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1);
        if (hash && window.tabManager) {
            if (hash.includes('-')) {
                const [tabId, subTabId] = hash.split('-');
                window.tabManager.switchTab(tabId);
                setTimeout(() => window.tabManager.switchSubTab(subTabId), 100);
            } else {
                window.tabManager.switchTab(hash);
            }
        }
    });
    
    // Check for initial hash
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        setTimeout(() => {
            if (hash.includes('-')) {
                const [tabId, subTabId] = hash.split('-');
                window.tabManager.switchTab(tabId);
                setTimeout(() => window.tabManager.switchSubTab(subTabId), 100);
            } else {
                window.tabManager.switchTab(hash);
            }
        }, 100);
    }
    
    console.log('TGPSC Notes Professional Edition loaded successfully!');
});