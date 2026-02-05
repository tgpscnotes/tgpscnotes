// Tab Manager for TGPSC Notes
class TabManager {
    constructor() {
        this.currentTab = 'current-affairs';
        this.currentSubTab = null;
        this.init();
    }

    init() {
        this.loadStaticComponents();
        this.setupEventListeners();
        this.handleInitialLoad();
    }

    async loadStaticComponents() {
        try {
            // Load header
            const headerResponse = await fetch('includes/header.html');
            document.getElementById('header-container').innerHTML = await headerResponse.text();
            
            // Load tabs navigation
            const tabsResponse = await fetch('includes/tabs/navigation.html');
            document.getElementById('tabs-container').innerHTML = await tabsResponse.text();
            
            // Load default tab content
            await this.loadTabContent('current-affairs');
            
            // Load footer
            const footerResponse = await fetch('includes/footer.html');
            document.getElementById('footer-container').innerHTML = await footerResponse.text();
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    async loadTabContent(tabId) {
        this.currentTab = tabId;
        
        // Update active tab UI
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
            if (tab.getAttribute('data-tab') === tabId) {
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
            }
        });

        try {
            let content = '';
            
            // Load appropriate content based on tab
            switch(tabId) {
                case 'current-affairs':
                    const caResponse = await fetch('includes/tabs/current-affairs.html');
                    content = await caResponse.text();
                    break;
                case 'group1':
                    const g1Response = await fetch('includes/tabs/group1/index.html');
                    content = await g1Response.text();
                    break;
                case 'group2':
                    const g2Response = await fetch('includes/tabs/group2/index.html');
                    content = await g2Response.text();
                    break;
                case 'group3':
                    const g3Response = await fetch('includes/tabs/group3/index.html');
                    content = await g3Response.text();
                    break;
                case 'group4':
                    const g4Response = await fetch('includes/tabs/group4/index.html');
                    content = await g4Response.text();
                    break;
                case 'combined':
                    const combinedResponse = await fetch('includes/tabs/combined/index.html');
                    content = await combinedResponse.text();
                    break;
                default:
                    content = '<div class="content-card"><h2>Content Coming Soon</h2></div>';
            }
            
            document.getElementById('content-container').innerHTML = content;
            
            // Initialize sub-tabs if exists
            this.initSubTabs();
            
            // Update URL
            history.pushState({ tab: tabId }, '', `#${tabId}`);
            
        } catch (error) {
            console.error('Error loading tab content:', error);
            document.getElementById('content-container').innerHTML = 
                '<div class="content-card"><h2>Error loading content</h2></div>';
        }
    }

    async loadSubTabContent(subTabId) {
        this.currentSubTab = subTabId;
        
        // Get parent tab ID
        const parentTab = document.querySelector('.tab-content.active').id;
        const subTabContainer = document.getElementById(`${parentTab}-content`) || 
                               document.getElementById('content-container');
        
        try {
            let content = '';
            
            // Load sub-tab content based on parent tab
            if (parentTab === 'group1') {
                switch(subTabId) {
                    case 'group1-scheme':
                        const schemeResponse = await fetch('includes/tabs/group1/scheme.html');
                        content = await schemeResponse.text();
                        break;
                    case 'group1-prelims':
                        const prelimsResponse = await fetch('includes/tabs/group1/prelims.html');
                        content = await prelimsResponse.text();
                        break;
                    case 'group1-mains':
                        const mainsResponse = await fetch('includes/tabs/group1/mains.html');
                        content = await mainsResponse.text();
                        break;
                }
            }
            // Add similar cases for other groups...
            
            if (content) {
                subTabContainer.innerHTML = content;
                
                // Update sub-tab UI
                document.querySelectorAll('.sub-tab').forEach(tab => {
                    tab.classList.remove('active');
                    tab.setAttribute('aria-selected', 'false');
                    if (tab.getAttribute('data-sub-tab') === subTabId) {
                        tab.classList.add('active');
                        tab.setAttribute('aria-selected', 'true');
                    }
                });
                
                // Initialize paper tabs if exists
                this.initPaperTabs();
            }
            
        } catch (error) {
            console.error('Error loading sub-tab content:', error);
        }
    }

    initSubTabs() {
        const subTabs = document.querySelectorAll('.sub-tab');
        if (subTabs.length > 0) {
            subTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const subTabId = tab.getAttribute('data-sub-tab');
                    this.loadSubTabContent(subTabId);
                });
            });
            
            // Activate first sub-tab
            const firstSubTab = subTabs[0];
            if (firstSubTab) {
                const firstSubTabId = firstSubTab.getAttribute('data-sub-tab');
                this.loadSubTabContent(firstSubTabId);
            }
        }
    }

    initPaperTabs() {
        const paperTabs = document.querySelectorAll('.paper-tab');
        if (paperTabs.length > 0) {
            paperTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const paperId = tab.getAttribute('data-paper');
                    this.switchPaperTab(paperId);
                });
            });
        }
    }

    switchPaperTab(paperId) {
        const paperSections = document.querySelectorAll('.paper-content-section');
        paperSections.forEach(section => {
            section.classList.remove('active');
        });
        
        const activeSection = document.getElementById(paperId);
        if (activeSection) {
            activeSection.classList.add('active');
        }
        
        // Update paper tab UI
        document.querySelectorAll('.paper-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-paper') === paperId) {
                tab.classList.add('active');
            }
        });
    }

    setupEventListeners() {
        // Event delegation for main tabs
        document.addEventListener('click', (e) => {
            const tab = e.target.closest('.tab');
            if (tab) {
                e.preventDefault();
                const tabId = tab.getAttribute('data-tab');
                this.loadTabContent(tabId);
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.tab) {
                this.loadTabContent(e.state.tab);
            }
        });

        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (hash) {
                this.loadTabContent(hash);
            }
        });
    }

    handleInitialLoad() {
        // Check for hash in URL
        const hash = window.location.hash.substring(1);
        const validTabs = ['current-affairs', 'group1', 'group2', 'group3', 'group4', 'combined'];
        
        if (hash && validTabs.includes(hash)) {
            this.loadTabContent(hash);
        } else {
            // Default to current affairs
            this.loadTabContent('current-affairs');
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.tabManager = new TabManager();
});