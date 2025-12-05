//
// NOTE: This file previously started with a Markdown code fence (```javascript)
// which breaks JavaScript parsing. The fence has been removed.
//
// Notes array (single source of truth for notes)
let notes = [];

// Search backend feature flag and base URL
window.__useBackendSearch = true; // set to false to force Wikipedia-only
window.__searchApiBase = window.__searchApiBase || 'http://localhost:8081';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    initApp();
});

function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    let currentFocus = -1;
    let visibleTopics = [];

    function filterTopics(query) {
        query = query.toLowerCase();
        const topicsList = document.getElementById('topics-list');
        if (!topicsList) return;

        visibleTopics = [];
        Array.from(topicsList.children).forEach(li => {
            const text = li.textContent.toLowerCase();
            const resourceLinks = Array.from(li.querySelectorAll('.topic-resources a'))
                .map(a => a.textContent.toLowerCase());
            
            const matches = text.includes(query) || 
                          resourceLinks.some(link => link.includes(query));
            
            li.style.display = matches ? '' : 'none';
            if (matches) visibleTopics.push(li);
        });

        // Reset focus index when filter changes
        currentFocus = -1;
    }

    searchInput.addEventListener('input', (e) => filterTopics(e.target.value));
            searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                if (!visibleTopics.length) return;
                e.preventDefault();
                const direction = e.key === 'ArrowDown' ? 1 : -1;
                currentFocus = (currentFocus + direction + visibleTopics.length) % visibleTopics.length;
                visibleTopics[currentFocus]?.querySelector('select, input, a')?.focus();
            }
        });
    }

    function initShortcuts() {
    const modal = document.getElementById('shortcuts-modal');
    const toggle = document.getElementById('shortcuts-toggle');
    const close = modal?.querySelector('.close-modal');
    
    function trapFocus(container) {
        const getFocusables = () => container.querySelectorAll('a, button, input, textarea, [tabindex]:not([tabindex="-1"])');
        function onKeyDown(e) {
            if (e.key !== 'Tab') return;
            const focusables = getFocusables();
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
        container.addEventListener('keydown', onKeyDown);
        return () => container.removeEventListener('keydown', onKeyDown);
    }

    let releaseTrap = null;

    function showModal() {
        if (modal) {
            modal.hidden = false;
            // focus first button inside content
            const firstFocusable = modal.querySelector('.shortcuts-content button, .shortcuts-content [tabindex]:not([tabindex="-1"])');
            (firstFocusable || modal).focus();
            releaseTrap = trapFocus(modal);
        }
    }
    
    function hideModal() {
        if (modal) {
            modal.hidden = true;
            if (typeof releaseTrap === 'function') releaseTrap();
            toggle?.focus();
        }
    }

    if (toggle) toggle.addEventListener('click', showModal);
    if (close) close.addEventListener('click', hideModal);
    // Close on backdrop click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) hideModal();
        });
    }
    
    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ignore shortcuts when typing in inputs or textareas
        const target = e.target;
        const isEditing = target && (target.matches && target.matches('input, textarea'));
        if (isEditing) {
            if (e.key === 'Escape' && target.blur) target.blur();
            return;
        }

        switch (e.key) {
            case '/':
                e.preventDefault();
                document.getElementById('search-input')?.focus();
                break;
            case '?':
                e.preventDefault();
                showModal();
                break;
            case 'n':
                e.preventDefault();
                document.getElementById('add-note')?.click();
                break;
            case 't':
                e.preventDefault();
                document.getElementById('theme-toggle')?.click();
                break;
            case 'Escape':
                if (!modal?.hidden) {
                    hideModal();
                }
                break;
        }
    });
}

function initApp() {
    // Add a welcome message to the console
    console.log('Welcome! The JavaScript file is properly linked and running.');
    
    // Example function to demonstrate JavaScript is working
    const currentYear = new Date().getFullYear();
    updateFooterYear(currentYear);
    
    // Add some interactivity
    addHeaderAnimation();
    // Initialize study tracker and theme
    initTheme();
    initStudyTracker();
    // Initialize search and keyboard shortcuts
    initSearch();
    initShortcuts();
    // Initialize notes functionality
    setupNotes();
    // Data import/export
    initDataIO();
    // Initialize note search (extends existing search)
    initNoteSearch();
    // Update empty states on load
    updateEmptyStates();
    // Initialize sticky navigation
    initStickyNav();
    // Initialize pomodoro and flashcards
    initPomodoro();
    initFlashcards();
    // Backend search toggle UI
    initBackendToggle();
    // Identity/date badge in sticky brand
    initCurrentDateBadge();
    // Initialize Wendell Odom section
    initWendellOdom();
    // Populate home page stats if on home page
    populateHomeStats();
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Close resource forms on Escape
        if (e.key === 'Escape') {
            const form = document.querySelector('.attach-resource-form');
            if (form) {
                form.remove();
                return;
            }
            
            // Close open resource panels
            const openPanels = document.querySelectorAll('.topic-resources.open');
            openPanels.forEach(panel => {
                panel.classList.remove('open');
                const btn = panel.previousElementSibling?.querySelector('.topic-resources-toggle');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });
        }
    });
}
// Fallbacks and utilities appended below to ensure all referenced functions exist

/* ---------------------- Global Utilities ---------------------- */
function showToast(message, type = 'info', title = '') {
    try {
        const container = document.getElementById('toast-container');
        if (!container) { console.info(`[toast:${type}]`, title ? `${title}:` : '', message); return; }
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.innerHTML = `
            <div class="toast-inner">
              ${title ? `<div class="toast-title">${title}</div>` : ''}
              <div class="toast-message">${message}</div>
            </div>`;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => { toast.classList.remove('show'); toast.addEventListener('transitionend', () => toast.remove(), { once: true }); }, 2500);
    } catch (e) { console.info('[toast]', message); }
}

/* ---------------------- Sticky Nav ---------------------- */
function initStickyNav() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        menu.classList.toggle('open', !expanded);
    });
}
function initBackendToggle() {
    const btn = document.getElementById('backend-toggle');
    const label = document.getElementById('backend-toggle-label');
    if (!btn || !label) return;
    const sync = () => {
        const on = !!window.__useBackendSearch;
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        label.textContent = `Backend: ${on ? 'On' : 'Off'}`;
    };
    sync();
    btn.addEventListener('click', () => {
        window.__useBackendSearch = !window.__useBackendSearch;
        sync();
        try { showToast(`Backend search ${window.__useBackendSearch ? 'enabled' : 'disabled'}`, 'info'); } catch {}
    });
}

function initCurrentDateBadge(){
    try {
        const el = document.getElementById('current-date');
        const footerYearEl = document.getElementById('footer-year');
        const now = new Date();
        const dateStr = now.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        const yearStr = String(now.getFullYear());
        
        // Update nav brand date badge
        if (el) {
            el.textContent = dateStr;
            el.setAttribute('datetime', now.toISOString().split('T')[0]);
        }
        
        // Update footer copyright year badge
        if (footerYearEl) {
            footerYearEl.textContent = yearStr;
        }
        
        // Also mirror into print header
        document.querySelectorAll('.print-date').forEach(n => n.textContent = dateStr);
        document.querySelectorAll('.print-year').forEach(n => n.textContent = yearStr);
    } catch {}
}

function updateFooterYear(year) {
    // Legacy function - now handled by initCurrentDateBadge
    const footerYearEl = document.getElementById('footer-year');
    if (footerYearEl) {
        footerYearEl.textContent = String(year);
    }
}

function addHeaderAnimation() {
    // Respect reduced motion preference
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const header = document.querySelector('header');
    if (header) {
        if (prefersReduced) {
            header.style.opacity = '1';
            header.style.transition = 'none';
            return;
        }
        header.style.opacity = '0';
        header.style.transition = 'opacity 0.5s ease-in';
        setTimeout(() => { header.style.opacity = '1'; }, 100);
    }
}

/* ---------------------- Study Tracker ---------------------- */
const STORAGE_KEY = 'ccna:topics';
const THEME_KEY = 'ccna:theme';

const defaultTopics = [
    { id: 'ipv4', title: 'IPv4 addressing & subnetting', done: false, status: 'not-started', estimatedHours: 0, resources: [
        { title: 'Subnetting Basics (Tutorial)', href: 'https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html' },
        { title: 'IPv4 Addressing Guide', href: 'https://www.practicalnetworking.net/series/subnetting/' }
    ] },
    { id: 'ipv6', title: 'IPv6 basics', done: false, status: 'not-started', estimatedHours: 0, resources: [
        { title: 'Cisco IPv6 Overview', href: 'https://www.cisco.com/c/en/us/solutions/enterprise-networks/ipv6.html' }
    ] },
    { id: 'switching', title: 'Switching (VLANs, STP)', done: false, status: 'not-started', estimatedHours: 0, resources: [
        { title: 'VLANs and Trunking', href: 'https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9000/software/ios-xe/17-6/configuration/guide/switchport/b_vlans.html' },
        { title: 'STP (Spanning Tree Protocol) Basics', href: 'https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/lanswitch/configuration/15-sy/lsw-15-sy-book/lsw-spanning-tree.html' }
    ] },
    { id: 'routing', title: 'Routing fundamentals (OSPF, static)', done: false, status: 'not-started', estimatedHours: 0, resources: [
        { title: 'Routing Fundamentals', href: 'https://learningnetwork.cisco.com/s/ccna-routing' },
        { title: 'OSPF Overview', href: 'https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_ospf/configuration/15-sr/iro-15-sr-book/iro-overview.html' }
    ] },
    { id: 'acl', title: 'ACLs & Security', done: false, status: 'not-started', estimatedHours: 0, resources: [
        { title: 'ACL Fundamentals', href: 'https://www.cisco.com/c/en/us/support/docs/security-vpn/ip-access-lists/13600-3.html' }
    ] },
    { id: 'nat', title: 'NAT and PAT', done: false, status: 'not-started', estimatedHours: 0, resources: [
        { title: 'NAT Overview', href: 'https://www.cisco.com/c/en/us/solutions/small-business/resource-center/networking/network-address-translation.html' }
    ] },
    { id: 'wan', title: 'WAN technologies', done: false, status: 'not-started', estimatedHours: 0, resources: [
        { title: 'WAN Technologies Overview', href: 'https://www.cisco.com/c/en/us/solutions/enterprise-networks/wan.html' }
    ] },
    { id: 'services', title: 'Network services (DHCP, DNS)', done: false, status: 'not-started', estimatedHours: 0, resources: [
        { title: 'DHCP Overview', href: 'https://www.cisco.com/c/en/us/support/docs/ip/routing-information-protocol-rip/13788-3.html' },
        { title: 'DNS Fundamentals', href: 'https://www.cloudflare.com/learning/dns/what-is-dns/' }
    ] }
];

function safeParse(json) {
    try { return JSON.parse(json); } catch { return null; }
}

function loadTopicsFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = safeParse(raw);
        if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
            // seed defaults
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTopics));
            return JSON.parse(JSON.stringify(defaultTopics));
        }
        return parsed;
    } catch (e) {
        console.warn('Could not load topics from storage, using defaults', e);
        return JSON.parse(JSON.stringify(defaultTopics));
    }
}

function saveTopicsToStorage(topics) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(topics)); } catch (e) { console.warn('Could not save topics', e); }
}

// Resource modal handling
function openResourceModal(topicId) {
    const modal = document.getElementById('resource-modal');
    if (!modal) return;
    modal.hidden = false;
    document.getElementById('resource-topic-id').value = topicId;
    document.getElementById('resource-modal-title-input').value = '';
    document.getElementById('resource-modal-url-input').value = '';
    document.getElementById('resource-modal-title-input').focus();
}

function closeResourceModal() {
    const modal = document.getElementById('resource-modal');
    if (modal) modal.hidden = true;
}

// Drag and drop handlers
let draggedItem = null;
let draggedOverItem = null;

function handleDragStart(e) {
    draggedItem = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.dataset.topicId);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedItem = null;
    draggedOverItem = null;
    
    // Remove all drag feedback
    document.querySelectorAll('.topics-list li').forEach(item => {
        item.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const item = e.target.closest('li');
    if (!item || item === draggedItem) return;
    
    // Remove feedback from previous target
    if (draggedOverItem && draggedOverItem !== item) {
        draggedOverItem.classList.remove('drag-over');
    }
    
    // Add feedback to current target
    item.classList.add('drag-over');
    draggedOverItem = item;
}

    function handleDrop(e) {
        e.preventDefault();
        const dropTarget = e.target.closest('li');
        if (!dropTarget || !draggedItem || dropTarget === draggedItem) return;
    
        const draggedId = draggedItem.dataset.topicId;
        const dropId = dropTarget.dataset.topicId;
    
        // Reorder topics array (load fresh from storage to avoid scope issues)
        let topicsArr = loadTopicsFromStorage();
        const draggedIndex = topicsArr.findIndex(t => t.id === draggedId);
        const dropIndex = topicsArr.findIndex(t => t.id === dropId);
        if (draggedIndex !== -1 && dropIndex !== -1) {
            const [movedItem] = topicsArr.splice(draggedIndex, 1);
            topicsArr.splice(dropIndex, 0, movedItem);
            saveTopicsToStorage(topicsArr);
            if (typeof window.__rerenderStudyPlan === 'function') {
                window.__rerenderStudyPlan();
            }
        }
    }

    function addResourceToTopic(topicId, resource) {
        let topics = loadTopicsFromStorage();
        const topic = topics.find(t => t.id === topicId);
        if (!topic) return;

        if (!Array.isArray(topic.resources)) {
            topic.resources = [];
        }
        topic.resources.push(resource);
        saveTopicsToStorage(topics);
        if (typeof window.__rerenderStudyPlan === 'function') {
            window.__rerenderStudyPlan();
        }
    }

    // Hook up resource modal events once at startup
    document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('resource-modal');
    if (!modal) return;
    const form = document.getElementById('resource-modal-form');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');

    function close() { closeResourceModal(); }
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (cancelBtn) cancelBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) close();
    });
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const topicId = document.getElementById('resource-topic-id').value;
            const title = document.getElementById('resource-modal-title-input').value.trim();
            const url = document.getElementById('resource-modal-url-input').value.trim();
            if (!title || !url) return;
            const safe = toSafeHttpUrl(url);
            if (!safe) { alert('Please enter a valid http(s) URL.'); return; }
            addResourceToTopic(topicId, { title, href: safe });
            close();
        });
    }
});

function initStudyTracker() {
    const form = document.getElementById('add-topic-form');
    const list = document.getElementById('topics-list');
    const resetBtn = document.getElementById('reset-topics');
    const clearBtn = document.getElementById('clear-topics');
    const emptyResetBtn = document.getElementById('empty-reset-topics');

    let topics = loadTopicsFromStorage();

    function getStatus(t) {
        if (t.status) return t.status;
        return t.done ? 'mastered' : 'not-started';
    }

    function migrateTopics(arr) {
        return arr.map(t => ({
            id: t.id,
            title: t.title,
            status: t.status || (t.done ? 'mastered' : 'not-started'),
            estimatedHours: typeof t.estimatedHours === 'number' ? t.estimatedHours : 0,
            resources: Array.isArray(t.resources) ? t.resources : []
        }));
    }

    topics = migrateTopics(topics);

    function computeTotals() {
        const total = topics.length;
        const mastered = topics.filter(t => getStatus(t) === 'mastered').length;
        const percent = total === 0 ? 0 : Math.round((mastered / total) * 100);
        const remainingHours = topics
            .filter(t => getStatus(t) !== 'mastered')
            .reduce((sum, t) => sum + (Number(t.estimatedHours) || 0), 0);
        const totalStudyHours = topics.reduce((sum, t) => sum + (Number(t.estimatedHours) || 0), 0);
        return { total, mastered, percent, remainingHours, totalStudyHours };
    }

    function updateStudyStats() {
        const { total, mastered, totalStudyHours } = computeTotals();
        
        // Update streak
        const streakEl = document.getElementById('study-streak');
        if (streakEl) {
            const streak = getStudyStreak();
            streakEl.textContent = streak;
        }
        
        // Update completed count
        const completedEl = document.getElementById('topics-completed');
        if (completedEl) {
            completedEl.textContent = mastered;
        }
        
        // Update total hours
        const totalHoursEl = document.getElementById('total-study-hours');
        if (totalHoursEl) {
            totalHoursEl.textContent = totalStudyHours + 'h';
        }
        
        // Check for milestones
            function checkMilestones(masteredCount) {
            const milestones = [
                { count: 1, message: 'First topic mastered! Great start!' },
                { count: 5, message: '5 topics mastered! You\'re on fire!' },
                { count: 10, message: '10 topics mastered! Halfway there!' },
                { count: 15, message: '15 topics mastered! Almost done!' },
                { count: 20, message: 'All topics mastered! Ready for the exam!' }
            ];
        
            const lastMilestone = parseInt(localStorage.getItem('ccna:lastMilestone') || '0');
        
            milestones.forEach(milestone => {
                if (masteredCount >= milestone.count && lastMilestone < milestone.count) {
                    localStorage.setItem('ccna:lastMilestone', String(milestone.count));
                    showToast(milestone.message, 'success', '🎉 Milestone Achieved!');
                }
            });
        }

        }

        function render() {
            // Reload topics to ensure sync with external updates (DnD, Resources)
            topics = loadTopicsFromStorage();

            // Update progress bar ARIA
            const progressBar = document.querySelector('.progress-bar');
            const { total, mastered, percent, remainingHours } = computeTotals();
        
        if (progressBar) {
            progressBar.setAttribute('aria-valuenow', percent);
            progressBar.setAttribute('aria-label', `${percent}% complete`);
        }

        const progressText = document.getElementById('progress-text');
        const progressMeter = document.getElementById('progress-meter');
        if (progressText) progressText.textContent = `${mastered} / ${total}`;
        if (progressMeter) progressMeter.style.width = percent + '%';
        const totalHoursEl = document.getElementById('total-hours-remaining');
        if (totalHoursEl) totalHoursEl.textContent = `Remaining: ${remainingHours}h`;

        // Update study stats dashboard
        updateStudyStats();

        // list
        if (!list) return;
        list.innerHTML = '';
        topics.forEach(topic => {
            const li = document.createElement('li');
            li.draggable = true;
            li.dataset.topicId = topic.id;
            li.dataset.status = getStatus(topic);
            
            // Drag and drop handlers
            li.addEventListener('dragstart', handleDragStart);
            li.addEventListener('dragend', handleDragEnd);
            li.addEventListener('dragover', handleDragOver);
            li.addEventListener('drop', handleDrop);
            
            const dragHandle = document.createElement('span');
            dragHandle.className = 'drag-handle';
            dragHandle.setAttribute('aria-hidden', 'true');
            dragHandle.innerHTML = '⋮⋮';
            li.appendChild(dragHandle);

            const left = document.createElement('div');
            left.className = 'topic-left';
            const titleSpan = document.createElement('span');
            titleSpan.textContent = topic.title;
            left.appendChild(titleSpan);

            // Topic-level progress bar
            const topicProgressBar = document.createElement('div');
            topicProgressBar.className = 'topic-progress-bar';
            topicProgressBar.setAttribute('role', 'progressbar');
            topicProgressBar.setAttribute('aria-valuemin', '0');
            topicProgressBar.setAttribute('aria-valuemax', '100');
            let topicPercent = 0;
            switch (getStatus(topic)) {
                case 'not-started': topicPercent = 0; break;
                case 'in-progress': topicPercent = 50; break;
                case 'mastered': topicPercent = 100; break;
            }
            topicProgressBar.setAttribute('aria-valuenow', topicPercent);
            const topicProgressMeter = document.createElement('div');
            topicProgressMeter.className = 'topic-progress-meter';
            topicProgressMeter.style.width = topicPercent + '%';
            topicProgressBar.appendChild(topicProgressMeter);
            left.appendChild(topicProgressBar);

            const statusSelect = document.createElement('select');
            statusSelect.className = 'topic-status';
            statusSelect.innerHTML = `
              <option value="not-started">Needs Review</option>
              <option value="in-progress">In Progress</option>
              <option value="mastered">Mastered</option>
            `;
            statusSelect.value = getStatus(topic);
            statusSelect.dataset.status = statusSelect.value;
            statusSelect.setAttribute('aria-label', `Status: ${statusSelect.options[statusSelect.selectedIndex].text}`);
            statusSelect.addEventListener('change', () => {
                li.dataset.status = statusSelect.value;
                statusSelect.dataset.status = statusSelect.value;
                statusSelect.setAttribute('aria-label', `Status: ${statusSelect.options[statusSelect.selectedIndex].text}`);
                setTopicStatus(topic.id, statusSelect.value);
            });
            left.appendChild(statusSelect);

            const estimateInput = document.createElement('input');
            estimateInput.type = 'number';
            estimateInput.min = '0';
            estimateInput.step = '0.5';
            estimateInput.placeholder = 'hrs';
            estimateInput.className = 'topic-estimate';
            estimateInput.value = topic.estimatedHours || '';
            estimateInput.title = 'Estimated hours';
            estimateInput.addEventListener('change', () => {
                setTopicEstimate(topic.id, Number(estimateInput.value || 0));
            });
            left.appendChild(estimateInput);

            li.appendChild(left);

            // resources toggle and add button
            const resourcesWrapper = document.createElement('div');
            resourcesWrapper.className = 'topic-resources-wrapper';
            
            const resBtn = document.createElement('button');
            resBtn.type = 'button';
            resBtn.className = 'topic-resources-toggle';
            resBtn.textContent = topic.resources?.length ? `Resources (${topic.resources.length})` : 'Resources (0)';
            resBtn.setAttribute('aria-expanded', 'false');
            resBtn.addEventListener('click', (e) => {
                const panel = li.querySelector('.topic-resources');
                const isOpen = panel.classList.toggle('open');
                resBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });
            
            const addResBtn = document.createElement('button');
            addResBtn.type = 'button';
            addResBtn.className = 'add-resource-btn';
            addResBtn.textContent = 'Add Resource';
            addResBtn.addEventListener('click', () => openResourceModal(topic.id));
            
            resourcesWrapper.appendChild(resBtn);
            resourcesWrapper.appendChild(addResBtn);
            li.appendChild(resourcesWrapper);

            // Resources panel
            const panel = document.createElement('div');
            panel.className = 'topic-resources';
            const ul = document.createElement('ul');
            if (topic.resources?.length) {
                topic.resources.forEach(r => {
                    const rli = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = r.href;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer nofollow';
                    a.textContent = r.title;
                    rli.appendChild(a);
                    ul.appendChild(rli);
                });
            }
            panel.appendChild(ul);
            li.appendChild(panel);

            // Add to list
            list.appendChild(li);
        });
        
        // Update empty states after rendering topics
        updateEmptyStates();
    }

    function addTopic(title) {
        const trimmed = String(title || '').trim();
        if (!trimmed) return;
        const id = 't' + Date.now();
        topics.push({ id, title: trimmed, status: 'not-started', estimatedHours: 0, resources: [] });
        saveTopicsToStorage(topics);
        render();
    }

    function setTopicStatus(id, status) {
        topics = topics.map(t => t.id === id ? Object.assign({}, t, { status }) : t);
        saveTopicsToStorage(topics);
        render();
    }

    function setTopicEstimate(id, hours) {
        topics = topics.map(t => t.id === id ? Object.assign({}, t, { estimatedHours: Math.max(0, Number(hours) || 0) }) : t);
        saveTopicsToStorage(topics);
        render();
    }

    function resetTopics() {
        topics = migrateTopics(JSON.parse(JSON.stringify(defaultTopics)));
        saveTopicsToStorage(topics);
        render();
    }

    function clearTopics() {
        topics = [];
        saveTopicsToStorage(topics);
        render();
    }

    // wire form (single registration)
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('new-topic');
            if (!input) return;
            addTopic(input.value);
            input.value = '';
        });
    }

    if (resetBtn) resetBtn.addEventListener('click', resetTopics);
    if (clearBtn) clearBtn.addEventListener('click', clearTopics);
    if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetTopics);

    // Expose a safe re-render hook (for DnD handlers)
    window.__rerenderStudyPlan = render;
    // initial render
    render();
}

/* ---------------------- Theme Toggle ---------------------- */
function initTheme() {
    const saved = (localStorage.getItem(THEME_KEY) || 'cisco');
    applyTheme(saved);

    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
        const current = document.body.classList.contains('theme-teal') ? 'teal' : 'cisco';
        const next = current === 'teal' ? 'cisco' : 'teal';
        applyTheme(next);
        localStorage.setItem(THEME_KEY, next);
    });
}

function applyTheme(name) {
    // Add transition class for smooth theme change
    document.body.classList.add('theme-transitioning');
    
    if (name === 'teal') {
        document.body.classList.add('theme-teal');
        const btn = document.getElementById('theme-toggle');
        if (btn) { btn.setAttribute('aria-pressed', 'true'); btn.textContent = 'Teal theme'; }
    } else {
        document.body.classList.remove('theme-teal');
        const btn = document.getElementById('theme-toggle');
        if (btn) { btn.setAttribute('aria-pressed', 'false'); btn.textContent = 'Cisco blue'; }
    }
    
    // Remove transition class after animation completes
    setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
    }, 500);
}

/* Notes Management */

function setupNotes() {
    const addNoteBtn = document.getElementById('add-note');
    const emptyAddNoteBtn = document.getElementById('empty-add-note');
    const notesList = document.getElementById('notes-list');
    const noteTemplate = document.getElementById('note-template');

    // Load existing notes
    loadNotes();

    // Add new note handler
    const addNoteHandler = () => {
        const note = createNote();
        notes.unshift(note);
        renderNote(note);
        saveNotes();
    };

    // Add new note (guard in case element is missing)
    if (addNoteBtn) {
        addNoteBtn.addEventListener('click', addNoteHandler);
    }
    
    // Empty state button
    if (emptyAddNoteBtn) {
        emptyAddNoteBtn.addEventListener('click', addNoteHandler);
    }

    // Event delegation for note actions (guard)
    if (notesList) {
        notesList.addEventListener('click', handleNoteActions);
        notesList.addEventListener('input', handleNoteChanges);
        notesList.addEventListener('keydown', handleNoteKeyboard);
    }

    // Global preview toggle (Preview Mode button in notes header)
    const toggleAllBtn = document.getElementById('toggle-preview');
    if (toggleAllBtn) {
        toggleAllBtn.addEventListener('click', () => {
            const allCards = document.querySelectorAll('.note-card');
            const pressed = toggleAllBtn.getAttribute('aria-pressed') === 'true';
            const next = !pressed;
            toggleAllBtn.setAttribute('aria-pressed', next ? 'true' : 'false');
            allCards.forEach(card => togglePreview(card, next));
        });
    }

    // Helpers for preview toggle per note
    function togglePreview(card, toPreview) {
        const textarea = card.querySelector('.note-content');
        const preview = card.querySelector('.note-preview');
        const btn = card.querySelector('.toggle-preview');
        if (!textarea || !preview) return;
        const enable = typeof toPreview === 'boolean' ? toPreview : preview.hidden;
        if (enable) {
            const raw = textarea.value || '';
            const html = (window.DOMPurify && window.marked)
                ? window.DOMPurify.sanitize(window.marked.parse(raw))
                : raw.replace(/\n/g, '<br>');
            preview.innerHTML = html;
            preview.hidden = false;
            textarea.hidden = true;
            btn?.setAttribute('aria-pressed', 'true');
        } else {
            preview.hidden = true;
            textarea.hidden = false;
            btn?.setAttribute('aria-pressed', 'false');
        }
    }
}

// -------- Notes helpers (defensive minimal implementations) --------
function loadNotes() {
    try {
        const raw = localStorage.getItem('ccna:notes');
        notes = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(notes)) notes = [];
    } catch { notes = []; }
}

function saveNotes() {
    try { localStorage.setItem('ccna:notes', JSON.stringify(notes)); } catch {}
}

function createNote() {
    const now = Date.now();
    return { id: `n_${now}`, title: '', content: '', date: now };
}

function renderNote(note) {
    const list = document.getElementById('notes-list');
    const tpl = document.getElementById('note-template');
    if (!list || !tpl) return;
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.dataset.id = note.id;
    const title = node.querySelector('.note-title');
    const content = node.querySelector('.note-content');
    const dateEl = node.querySelector('.note-date');
    title.value = note.title || '';
    content.value = note.content || '';
    dateEl.textContent = new Date(note.date || Date.now()).toLocaleString();
    list.appendChild(node);
    updateNotesEmptyState();
}

function handleNoteActions(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    const card = e.target.closest('.note-card');
    if (!card) return;
    const id = card.dataset.id;
    if (btn.classList.contains('delete-note')) {
        notes = notes.filter(n => n.id !== id);
        card.remove();
        saveNotes();
        updateNotesEmptyState();
    } else if (btn.classList.contains('toggle-preview')) {
        togglePreview(card);
    }
}

function handleNoteChanges(e) {
    const card = e.target.closest('.note-card');
    if (!card) return;
    const id = card.dataset.id;
    const note = notes.find(n => n.id === id);
    if (!note) return;
    if (e.target.classList.contains('note-title')) note.title = e.target.value;
    if (e.target.classList.contains('note-content')) note.content = e.target.value;
    saveNotes();
}

function handleNoteKeyboard(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveNotes();
        try { showToast('Notes saved', 'success'); } catch {}
    }
}

function updateNotesEmptyState() {
    const list = document.getElementById('notes-list');
    const empty = document.getElementById('notes-empty-state');
    if (!list || !empty) return;
    const hasItems = list.children.length > 0;
    empty.hidden = hasItems;
}

/* -------------- Light stubs for other initializers -------------- */
function initPomodoro() {
    const btn = document.getElementById('pomodoro-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const pressed = btn.getAttribute('aria-pressed') === 'true';
        btn.setAttribute('aria-pressed', pressed ? 'false' : 'true');
        try { showToast('Pomodoro toggle', 'info'); } catch {}
    });
}

function initFlashcards() {
    const toggle = document.getElementById('flashcards-toggle');
    const sidebar = document.getElementById('flashcards-sidebar');
    const close = document.getElementById('flashcards-close');
    if (!toggle || !sidebar) return;
    const set = (open) => { sidebar.hidden = !open; toggle.setAttribute('aria-expanded', open ? 'true' : 'false'); };
    toggle.addEventListener('click', () => set(sidebar.hidden));
    close?.addEventListener('click', () => set(false));
}

function initWendellOdom() {
    // Placeholder: add behaviors only if page provides specific elements
    // Currently a no-op with guards
}

function populateHomeStats() {
    try {
        const topicsRaw = localStorage.getItem('ccna:topics');
        const topics = topicsRaw ? JSON.parse(topicsRaw) : [];
        const total = Array.isArray(topics) ? topics.length : 0;
        const mastered = Array.isArray(topics) ? topics.filter(t => t.status === 'mastered' || t.done === true).length : 0;
        const notesRaw = localStorage.getItem('ccna:notes');
        const notesArr = notesRaw ? JSON.parse(notesRaw) : [];
        const notesCount = Array.isArray(notesArr) ? notesArr.length : 0;
        const byId = (id) => document.getElementById(id);
        const setText = (id, v) => { const el = byId(id); if (el) el.textContent = String(v); };
        setText('home-topics-total', total);
        setText('home-topics-mastered', mastered);
        setText('home-notes-count', notesCount);
    } catch {}
}

function initDataIO() { /* Placeholder for export/import wiring if needed */ }
function initNoteSearch() { /* Placeholder: could integrate with main search */ }
function updateEmptyStates() { updateNotesEmptyState(); }

// --------- Misc helpers referenced elsewhere ---------
function toSafeHttpUrl(input) {
    try {
        const url = new URL(input, window.location.origin);
        if (url.protocol === 'http:' || url.protocol === 'https:') return url.href;
        return null;
    } catch { return null; }
}

function getStudyStreak() {
    // Minimal placeholder streak value; adjustable by other parts of the app
    const n = parseInt(localStorage.getItem('ccna:streak') || '0', 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
}
