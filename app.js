/**
 * Moody's MuniView - Municipal Market Intelligence Platform
 * Main Application JavaScript
 */

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initAIChat();
    initSearch();
    initTables();
    initFilters();
    initWidgetAnimations();
    initGaugeAnimations();
    initCounterAnimations();
    initHeatmap();
    initQRATEScorecard();
    initDashboardCustomization();
    initWidgetResize();
    initResearchTabs();
});

// =====================================================
// NAVIGATION
// =====================================================

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.dataset.page;
            if (!pageId) return;
            
            // Update active nav link
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
            
            // Show corresponding page
            pages.forEach(page => {
                page.classList.remove('active');
                page.style.display = 'none'; // Force hide with inline style
                if (page.id === `page-${pageId}`) {
                    page.classList.add('active');
                    page.style.display = 'block'; // Force show with inline style
                    // Reinitialize animations for the new page
                    setTimeout(() => initWidgetAnimations(), 100);
                }
            });
            
            // Close and hide Dashboard-specific panels when navigating away from Dashboard
            const widgetManagerPanel = document.getElementById('widgetManagerPanel');
            const savedViewsDropdown = document.getElementById('savedViewsDropdown');
            const dashboardToolbar = document.querySelector('.dashboard-toolbar');
            const watchlistWidget = document.querySelector('[data-widget-id="watchlist"]');
            const watchlistSectionHeader = document.getElementById('watchlist-section-header');
            const marketActivityWidget = document.querySelector('[data-widget-id="market-activity"]');
            const liquidityWidget = document.querySelector('[data-widget-id="liquidity"]');
            const marketLiquiditySectionHeader = document.getElementById('market-liquidity-section-header');
            
            if (pageId !== 'dashboard') {
                widgetManagerPanel?.classList.remove('open');
                widgetManagerPanel?.classList.add('dashboard-hidden');
                savedViewsDropdown?.classList.remove('open');
                dashboardToolbar?.classList.add('dashboard-hidden');
                // Explicitly hide watchlist widget
                if (watchlistWidget) watchlistWidget.style.display = 'none';
                if (watchlistSectionHeader) watchlistSectionHeader.style.display = 'none';
                // Explicitly hide Market & Liquidity widgets
                if (marketActivityWidget) marketActivityWidget.style.display = 'none';
                if (liquidityWidget) liquidityWidget.style.display = 'none';
                if (marketLiquiditySectionHeader) marketLiquiditySectionHeader.style.display = 'none';
            } else {
                widgetManagerPanel?.classList.remove('dashboard-hidden');
                dashboardToolbar?.classList.remove('dashboard-hidden');
                // Show watchlist widget on Dashboard
                if (watchlistWidget) watchlistWidget.style.display = '';
                if (watchlistSectionHeader) watchlistSectionHeader.style.display = '';
                // Show Market & Liquidity widgets on Dashboard
                if (marketActivityWidget) marketActivityWidget.style.display = '';
                if (liquidityWidget) liquidityWidget.style.display = '';
                if (marketLiquiditySectionHeader) marketLiquiditySectionHeader.style.display = '';
            }
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
    
    // Handle widget links with data-page attribute
    document.querySelectorAll('.widget-link[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.dataset.page;
            const navLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
            if (navLink) {
                navLink.click();
            }
        });
    });
}

// =====================================================
// AI CHAT
// =====================================================

function initAIChat() {
    const openBtn = document.getElementById('openAIChat');
    const closeBtn = document.getElementById('closeAIChat');
    const chatPanel = document.getElementById('aiChatPanel');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');
    const suggestions = document.querySelectorAll('.suggestion-chip');
    const overlay = document.getElementById('overlay');
    
    openBtn?.addEventListener('click', () => {
        chatPanel?.classList.add('open');
        overlay?.classList.add('active');
        chatInput?.focus();
    });
    
    closeBtn?.addEventListener('click', closeChatPanel);
    
    overlay?.addEventListener('click', () => {
        if (chatPanel?.classList.contains('open')) {
            closeChatPanel();
        }
    });
    
    function closeChatPanel() {
        chatPanel?.classList.remove('open');
        overlay?.classList.remove('active');
    }
    
    // Send message
    sendBtn?.addEventListener('click', sendMessage);
    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Suggestion chips
    suggestions.forEach(chip => {
        chip.addEventListener('click', () => {
            chatInput.value = chip.textContent;
            sendMessage();
        });
    });
    
    function sendMessage() {
        const message = chatInput?.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate AI response
        setTimeout(() => {
            hideTypingIndicator();
            const response = generateAIResponse(message);
            addMessage(response, 'assistant');
        }, 1200);
    }
    
    function addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = type === 'assistant' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = `<p>${content}</p>`;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);
        chatMessages?.appendChild(messageDiv);
        
        // Scroll to bottom with smooth animation
        chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth'
        });
    }
    
    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'message assistant typing-indicator';
        indicator.id = 'typingIndicator';
        indicator.innerHTML = `
            <div class="message-avatar"><i class="fas fa-robot"></i></div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        chatMessages?.appendChild(indicator);
        chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
    }
    
    function hideTypingIndicator() {
        document.getElementById('typingIndicator')?.remove();
    }
    
    function generateAIResponse(query) {
        const lowerQuery = query.toLowerCase();
        
        if (lowerQuery.includes('negative outlook') || lowerQuery.includes('negative outlooks')) {
            return `Based on current data, there are <strong>47 entities</strong> with negative outlooks in your coverage universe. The largest by debt outstanding include:
            <ul>
                <li><strong>State of Illinois</strong> - $22.8B debt, Baa1 rating</li>
                <li><strong>Chicago Public Schools</strong> - $8.4B debt, Ba1 rating</li>
                <li><strong>City of Detroit</strong> - $4.2B debt, Ba3 rating</li>
            </ul>
            Would you like me to create a monitoring alert for outlook changes?`;
        }
        
        if (lowerQuery.includes('ca vs tx') || (lowerQuery.includes('california') && lowerQuery.includes('texas'))) {
            return `Here's a comparison of California vs Texas GO ratings:
            <ul>
                <li><strong>California:</strong> Aa2 (Stable) - $82.4B debt outstanding</li>
                <li><strong>Texas:</strong> Aaa (Stable) - $38.7B debt outstanding</li>
            </ul>
            <strong>Key differences:</strong> Texas benefits from no state income tax and strong economic growth. California has higher debt burden but more diversified economy. Texas has maintained its Aaa rating since 2014, while California was upgraded from Aa3 in 2019.`;
        }
        
        if (lowerQuery.includes('downgrade') || lowerQuery.includes('downgrades')) {
            return `In the past 30 days, there have been <strong>23 downgrades</strong> across rated municipal entities. Notable actions include:
            <ul>
                <li><strong>Chicago Public Schools, IL</strong> - Baa3 → Ba1 (Feb 2)</li>
                <li><strong>Puerto Rico Highway Authority</strong> - Ba2 → Ba3 (Jan 28)</li>
                <li><strong>Hartford, CT</strong> - A3 → Baa1 (Jan 22)</li>
            </ul>
            The primary drivers have been pension obligations and revenue pressures. Would you like a detailed report?`;
        }
        
        if (lowerQuery.includes('liquidity') || lowerQuery.includes('liquid')) {
            return `The average liquidity score across your portfolio is <strong>82.4</strong> (Good). Here's the breakdown:
            <ul>
                <li><strong>High Liquidity (80+):</strong> 68% of holdings</li>
                <li><strong>Medium Liquidity (60-79):</strong> 24% of holdings</li>
                <li><strong>Low Liquidity (<60):</strong> 8% of holdings</li>
            </ul>
            General Obligation bonds show the highest average liquidity at 88, while Healthcare revenue bonds average 68.`;
        }
        
        if (lowerQuery.includes('export') || lowerQuery.includes('download')) {
            return `I can help you export data in several formats:
            <ul>
                <li><strong>Excel (.xlsx)</strong> - Full data with formatting</li>
                <li><strong>CSV</strong> - Raw data for analysis</li>
                <li><strong>PDF</strong> - Formatted reports</li>
            </ul>
            You can also set up scheduled exports via the Data Exports section. Would you like me to guide you through creating an export template?`;
        }
        
        if (lowerQuery.includes('risk') || lowerQuery.includes('portfolio')) {
            return `Your portfolio health score is <strong>72</strong> (Good). Key metrics:
            <ul>
                <li><strong>Investment Grade:</strong> 94.2% of holdings</li>
                <li><strong>Stable Outlook:</strong> 87.6% of rated entities</li>
                <li><strong>Negative Watch:</strong> 3.8% require monitoring</li>
            </ul>
            The upgrade/downgrade ratio is 2.04x, indicating positive credit momentum. Would you like a detailed risk breakdown by sector?`;
        }
        
        // Default response
        return `I can help you with that. Based on your query about "${query}", here are some options:
        <ul>
            <li>Search our database of 30,000+ municipal entities</li>
            <li>View recent rating actions and research</li>
            <li>Analyze financial metrics and trends</li>
            <li>Create custom screens and alerts</li>
        </ul>
        Could you provide more specific details about what you're looking for?`;
    }
}

// =====================================================
// GLOBAL SEARCH
// =====================================================

function initSearch() {
    const searchInput = document.getElementById('globalSearch');
    
    // Keyboard shortcut (Cmd/Ctrl + K)
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchInput?.focus();
        }
        
        if (e.key === 'Escape') {
            searchInput?.blur();
        }
    });
    
    // Search functionality
    searchInput?.addEventListener('input', debounce((e) => {
        const query = e.target.value.trim();
        if (query.length >= 2) {
            performSearch(query);
        }
    }, 300));
}

function performSearch(query) {
    console.log('Searching for:', query);
    // In production, this would call an API and display results
}

// =====================================================
// DATA TABLES
// =====================================================

function initTables() {
    // Sortable columns
    document.querySelectorAll('.data-table th.sortable').forEach(th => {
        th.addEventListener('click', () => {
            const table = th.closest('table');
            const columnIndex = Array.from(th.parentElement.children).indexOf(th);
            const isAscending = th.classList.contains('sort-asc');
            
            // Reset other columns
            table.querySelectorAll('th.sortable').forEach(header => {
                header.classList.remove('sort-asc', 'sort-desc');
                const icon = header.querySelector('i');
                if (icon) icon.className = 'fas fa-sort';
            });
            
            // Set current column
            th.classList.add(isAscending ? 'sort-desc' : 'sort-asc');
            const icon = th.querySelector('i');
            if (icon) icon.className = isAscending ? 'fas fa-sort-down' : 'fas fa-sort-up';
            
            sortTable(table, columnIndex, !isAscending);
        });
    });
    
    // Select all checkbox
    document.querySelectorAll('thead .checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const table = e.target.closest('table');
            table.querySelectorAll('tbody .checkbox').forEach(cb => {
                cb.checked = e.target.checked;
            });
        });
    });
}

function sortTable(table, columnIndex, ascending) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const aValue = a.children[columnIndex]?.textContent.trim() || '';
        const bValue = b.children[columnIndex]?.textContent.trim() || '';
        
        const aNum = parseFloat(aValue.replace(/[^0-9.-]/g, ''));
        const bNum = parseFloat(bValue.replace(/[^0-9.-]/g, ''));
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return ascending ? aNum - bNum : bNum - aNum;
        }
        
        return ascending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
    
    rows.forEach(row => tbody.appendChild(row));
}

// =====================================================
// FILTERS
// =====================================================

function initFilters() {
    // Toggle pills
    document.querySelectorAll('.toggle-pills').forEach(group => {
        const pills = group.querySelectorAll('.pill');
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
            });
        });
    });
    
    // Filter chips
    document.querySelectorAll('.filter-chips').forEach(group => {
        const chips = group.querySelectorAll('.chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
            });
        });
    });
    
    // Tabs
    document.querySelectorAll('.tabs-nav').forEach(tabGroup => {
        const tabs = tabGroup.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });
    });
    
    // View options
    document.querySelectorAll('.view-options').forEach(group => {
        const buttons = group.querySelectorAll('.view-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    });
    
    // Screener criteria remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const criteriaItem = btn.closest('.criteria-item');
            criteriaItem?.style.setProperty('opacity', '0');
            criteriaItem?.style.setProperty('transform', 'translateX(-20px)');
            setTimeout(() => criteriaItem?.remove(), 200);
        });
    });
    
    // Multi-select tag removal
    document.querySelectorAll('.tag i').forEach(icon => {
        icon.addEventListener('click', () => {
            const tag = icon.closest('.tag');
            tag?.remove();
        });
    });
}

// =====================================================
// WIDGET ANIMATIONS
// =====================================================

function initWidgetAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.widget, .hero-stat, .quick-stat, .summary-card, .alert-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
    
    // Animate progress bars
    setTimeout(() => {
        document.querySelectorAll('.progress-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 500);
    
    // Animate rating bars
    setTimeout(() => {
        document.querySelectorAll('.bar').forEach((bar, index) => {
            const height = bar.style.height;
            bar.style.height = '0';
            setTimeout(() => {
                bar.style.height = height;
            }, index * 100);
        });
    }, 600);
    
    // Animate ratio segments
    setTimeout(() => {
        document.querySelectorAll('.ratio-segment').forEach(segment => {
            const width = segment.style.width;
            segment.style.width = '0';
            setTimeout(() => {
                segment.style.width = width;
            }, 100);
        });
    }, 800);
}

// =====================================================
// GAUGE ANIMATIONS
// =====================================================

function initGaugeAnimations() {
    // Animate the gauge needle
    const gaugeNeedle = document.querySelector('.gauge-needle');
    if (gaugeNeedle) {
        // Portfolio Health Score of 84 = LOW RISK
        // Health score is inverse of risk: 84 health = 16 risk
        // Full range is -90deg (low risk/left) to 90deg (high risk/right)
        // 16% risk = -90 + (16/100 * 180) = -90 + 28.8 = -61.2deg
        setTimeout(() => {
            gaugeNeedle.style.transform = 'rotate(-61deg)';
        }, 500);
    }
    
    // Animate liquidity ring
    const liquidityRing = document.querySelector('.liquidity-score-ring circle:nth-child(2)');
    if (liquidityRing) {
        // 82% liquidity score
        // circumference = 2 * π * 42 ≈ 264
        // offset = 264 - (264 * 0.82) = 264 - 216.5 = 47.5
        setTimeout(() => {
            liquidityRing.style.transition = 'stroke-dashoffset 1.5s ease';
            liquidityRing.style.strokeDashoffset = '46';
        }, 700);
    }
}

// =====================================================
// COUNTER ANIMATIONS
// =====================================================

function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = formatNumber(Math.floor(current));
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = formatNumber(target);
            }
        };
        
        // Start animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.disconnect();
            }
        });
        
        observer.observe(counter);
    });
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
}

function formatCurrency(value) {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(2)}`;
}

// =====================================================
// EXPORT FUNCTIONALITY
// =====================================================

function exportToCSV(data, filename) {
    const csv = convertToCSV(data);
    downloadFile(csv, filename, 'text/csv');
}

function convertToCSV(data) {
    if (!data || !data.length) return '';
    
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(header => {
        let value = row[header];
        if (typeof value === 'string' && value.includes(',')) {
            value = `"${value}"`;
        }
        return value;
    }).join(','));
    
    return [headers.join(','), ...rows].join('\n');
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// =====================================================
// KEYBOARD SHORTCUTS
// =====================================================

document.addEventListener('keydown', (e) => {
    // Only handle shortcuts when not typing
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
    }
    
    // Navigation shortcuts
    if (e.key === '1') navigateToPage('dashboard');
    if (e.key === '2') navigateToPage('entities');
    if (e.key === '3') navigateToPage('securities');
    if (e.key === '4') navigateToPage('research');
    if (e.key === '5') navigateToPage('screener');
    if (e.key === '6') navigateToPage('monitoring');
    
    // Toggle AI Chat with 'a'
    if (e.key === 'a' && !e.metaKey && !e.ctrlKey) {
        document.getElementById('openAIChat')?.click();
    }
});

function navigateToPage(pageId) {
    const navLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
    navLink?.click();
}

// =====================================================
// TOOLTIPS (Simple Implementation)
// =====================================================

document.querySelectorAll('[title]').forEach(el => {
    el.addEventListener('mouseenter', (e) => {
        const title = e.target.getAttribute('title');
        if (!title) return;
        
        // Store and remove title to prevent default tooltip
        e.target.dataset.tooltip = title;
        e.target.removeAttribute('title');
        
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = title;
        tooltip.style.cssText = `
            position: fixed;
            background: #1e293b;
            color: white;
            padding: 6px 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 9999;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
        `;
        document.body.appendChild(tooltip);
        
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
        
        setTimeout(() => tooltip.style.opacity = '1', 10);
        
        e.target._tooltip = tooltip;
    });
    
    el.addEventListener('mouseleave', (e) => {
        if (e.target._tooltip) {
            e.target._tooltip.remove();
            e.target.setAttribute('title', e.target.dataset.tooltip);
        }
    });
});

// =====================================================
// ADD TYPING INDICATOR STYLES
// =====================================================

const style = document.createElement('style');
style.textContent = `
    .typing-dots {
        display: flex;
        gap: 4px;
        padding: 8px 0;
    }
    .typing-dots span {
        width: 8px;
        height: 8px;
        background: #94a3b8;
        border-radius: 50%;
        animation: typing 1.4s infinite ease-in-out;
    }
    .typing-dots span:nth-child(1) { animation-delay: 0s; }
    .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typing {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-4px); opacity: 1; }
    }
`;
document.head.appendChild(style);

// =====================================================
// INITIALIZATION COMPLETE
// =====================================================

// =====================================================
// US HEATMAP FUNCTIONALITY
// =====================================================

function initHeatmap() {
    // Initialize heatmap on Dashboard (if exists)
    const dashboardGridMap = document.getElementById('usMapGrid');
    const dashboardTooltip = document.getElementById('heatmapTooltip');
    const svgMap = document.querySelector('.tableau-map-svg');
    
    if (dashboardGridMap) {
        createTileMap(dashboardGridMap, dashboardTooltip);
        if (svgMap) svgMap.style.display = 'none';
        dashboardGridMap.style.display = 'grid';
    }
    
    // Initialize heatmap on Monitoring page (if exists)
    const monitoringMapContainer = document.getElementById('monitoring-risk-heatmap');
    const monitoringTooltip = document.getElementById('monitoring-heatmap-tooltip');
    
    if (monitoringMapContainer) {
        createTileMap(monitoringMapContainer, monitoringTooltip);
    }
    
    return;
    
    // Original SVG code (disabled due to corrupted paths)
    const svgStates = document.querySelectorAll('.tableau-map-svg .tableau-states path');
    const states = svgStates;
    
    // High-contrast diverging color scale (Green -> Yellow -> Orange -> Red)
    function getRiskColor(score) {
        if (score <= 15) return '#10b981'; // Green - Very Low Risk
        if (score <= 25) return '#34d399'; // Light Green - Low Risk
        if (score <= 35) return '#a3e635'; // Lime - Low-Moderate Risk
        if (score <= 45) return '#facc15'; // Yellow - Moderate Risk
        if (score <= 55) return '#fbbf24'; // Amber - Elevated Risk
        if (score <= 65) return '#f97316'; // Orange - High Risk
        if (score <= 75) return '#ef4444'; // Red - Very High Risk
        return '#dc2626'; // Dark Red - Critical Risk
    }
    
    // Get risk level label
    function getRiskLevel(score) {
        if (score <= 20) return 'Low';
        if (score <= 35) return 'Moderate';
        if (score <= 50) return 'Elevated';
        if (score <= 65) return 'High';
        return 'Very High';
    }
    
    // Get risk level color for badge
    function getRiskBadgeColor(score) {
        if (score <= 20) return '#10b981';
        if (score <= 35) return '#3b82f6';
        if (score <= 50) return '#f59e0b';
        if (score <= 65) return '#f97316';
        return '#ef4444';
    }
    
    // Initialize state colors
    states.forEach(state => {
        const risk = parseInt(state.dataset.risk) || 0;
        state.style.fill = getRiskColor(risk);
    });
    
    // Tooltip functionality
    states.forEach(state => {
        state.addEventListener('mouseenter', (e) => {
            const stateName = state.id;
            const risk = parseInt(state.dataset.risk);
            const exposure = state.dataset.exposure;
            const entities = state.dataset.entities;
            const riskLevel = getRiskLevel(risk);
            const badgeColor = getRiskBadgeColor(risk);
            
            tooltip.innerHTML = `
                <div class="tooltip-state">${getStateName(stateName)}</div>
                <div class="tooltip-row">
                    <span class="tooltip-label">Risk Level</span>
                    <span class="tooltip-value" style="color: ${badgeColor}">${riskLevel}</span>
                </div>
                <div class="tooltip-row">
                    <span class="tooltip-label">Risk Score</span>
                    <span class="tooltip-value">${risk}/100</span>
                </div>
                <div class="tooltip-row">
                    <span class="tooltip-label">Exposure</span>
                    <span class="tooltip-value">$${exposure}B</span>
                </div>
                <div class="tooltip-row">
                    <span class="tooltip-label">Entities</span>
                    <span class="tooltip-value">${parseInt(entities).toLocaleString()}</span>
                </div>
            `;
            tooltip.classList.add('visible');
            
            // Position tooltip
            const rect = state.getBoundingClientRect();
            const containerRect = document.querySelector('.tableau-map-container').getBoundingClientRect();
            tooltip.style.left = `${rect.left - containerRect.left + rect.width/2 - 90}px`;
            tooltip.style.top = `${rect.top - containerRect.top - 120}px`;
        });
        
        state.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
        
        state.addEventListener('click', () => {
            // Navigate to entities page filtered by state
            const stateName = state.id;
            console.log(`Filtering entities by state: ${stateName}`);
            // In production, this would filter the entities view
        });
    });
    
    // Metric selector change
    metricSelect?.addEventListener('change', (e) => {
        const metric = e.target.value;
        states.forEach(state => {
            let value;
            switch(metric) {
                case 'exposure':
                    value = parseFloat(state.dataset.exposure) * 5; // Scale for visualization
                    break;
                case 'count':
                    value = parseInt(state.dataset.entities) / 30; // Scale for visualization
                    break;
                case 'negative':
                    value = Math.random() * 60 + 10; // Demo data
                    break;
                default:
                    value = parseInt(state.dataset.risk);
            }
            state.style.fill = getRiskColor(Math.min(value, 100));
        });
    });
}

function getStateName(abbrev) {
    const stateNames = {
        'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
        'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
        'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
        'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
        'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
        'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
        'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
        'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
        'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
        'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
        'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
        'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
        'WI': 'Wisconsin', 'WY': 'Wyoming'
    };
    return stateNames[abbrev] || abbrev;
}

// Validate SVG map paths are rendering correctly
function validateSvgMap(states) {
    if (states.length < 48) return false;
    // Check if any states have valid bounding boxes
    let validCount = 0;
    states.forEach(state => {
        try {
            const bbox = state.getBBox();
            if (bbox.width > 0 && bbox.height > 0) validCount++;
        } catch(e) {}
    });
    return validCount > 40;
}

// Create a tile-based US map (hexagonal grid style)
function createTileMap(container, tooltip) {
    if (!container) return;
    
    // State data with risk scores
    const stateData = {
        'AK': { risk: 22, exposure: 0.5, entities: 78 },
        'ME': { risk: 18, exposure: 0.5, entities: 78 },
        'VT': { risk: 20, exposure: 0.4, entities: 67 },
        'NH': { risk: 22, exposure: 0.6, entities: 89 },
        'WA': { risk: 32, exposure: 2.4, entities: 412 },
        'MT': { risk: 18, exposure: 0.6, entities: 124 },
        'ND': { risk: 12, exposure: 0.3, entities: 67 },
        'MN': { risk: 26, exposure: 2.4, entities: 387 },
        'WI': { risk: 28, exposure: 2.1, entities: 334 },
        'MI': { risk: 40, exposure: 3.8, entities: 612 },
        'NY': { risk: 55, exposure: 9.4, entities: 1678 },
        'MA': { risk: 34, exposure: 3.4, entities: 498 },
        'RI': { risk: 35, exposure: 0.8, entities: 112 },
        'ID': { risk: 22, exposure: 0.8, entities: 156 },
        'WY': { risk: 15, exposure: 0.4, entities: 89 },
        'SD': { risk: 14, exposure: 0.4, entities: 78 },
        'IA': { risk: 22, exposure: 1.6, entities: 256 },
        'IL': { risk: 58, exposure: 6.4, entities: 1245 },
        'IN': { risk: 30, exposure: 2.2, entities: 398 },
        'OH': { risk: 38, exposure: 4.1, entities: 687 },
        'PA': { risk: 42, exposure: 5.8, entities: 876 },
        'NJ': { risk: 46, exposure: 4.2, entities: 623 },
        'CT': { risk: 38, exposure: 2.1, entities: 312 },
        'OR': { risk: 28, exposure: 1.8, entities: 287 },
        'NV': { risk: 38, exposure: 1.2, entities: 198 },
        'UT': { risk: 25, exposure: 1.1, entities: 203 },
        'CO': { risk: 35, exposure: 3.2, entities: 478 },
        'NE': { risk: 20, exposure: 0.9, entities: 145 },
        'KS': { risk: 24, exposure: 1.3, entities: 198 },
        'MO': { risk: 34, exposure: 2.8, entities: 423 },
        'KY': { risk: 35, exposure: 2.0, entities: 312 },
        'WV': { risk: 40, exposure: 0.9, entities: 145 },
        'VA': { risk: 30, exposure: 3.6, entities: 534 },
        'MD': { risk: 28, exposure: 2.8, entities: 412 },
        'DE': { risk: 24, exposure: 0.6, entities: 89 },
        'CA': { risk: 45, exposure: 12.8, entities: 2847 },
        'AZ': { risk: 42, exposure: 2.9, entities: 398 },
        'NM': { risk: 30, exposure: 1.4, entities: 187 },
        'OK': { risk: 36, exposure: 2.1, entities: 312 },
        'AR': { risk: 32, exposure: 1.5, entities: 234 },
        'TN': { risk: 33, exposure: 2.4, entities: 378 },
        'NC': { risk: 32, exposure: 3.4, entities: 512 },
        'SC': { risk: 34, exposure: 2.0, entities: 298 },
        'HI': { risk: 28, exposure: 1.2, entities: 156 },
        'TX': { risk: 52, exposure: 8.7, entities: 1987 },
        'LA': { risk: 48, exposure: 2.3, entities: 345 },
        'MS': { risk: 42, exposure: 1.4, entities: 212 },
        'AL': { risk: 38, exposure: 2.1, entities: 324 },
        'GA': { risk: 36, exposure: 3.8, entities: 567 },
        'FL': { risk: 44, exposure: 7.2, entities: 1456 }
    };
    
    // Tile grid layout (row, col positions for each state)
    // This creates a recognizable US shape using a grid
    const tileLayout = [
        // Row 0 (top)
        { state: 'AK', row: 0, col: 0 },
        { state: 'ME', row: 0, col: 10 },
        // Row 1
        { state: 'WA', row: 1, col: 1 },
        { state: 'MT', row: 1, col: 2 },
        { state: 'ND', row: 1, col: 3 },
        { state: 'MN', row: 1, col: 4 },
        { state: 'WI', row: 1, col: 5 },
        { state: 'MI', row: 1, col: 7 },
        { state: 'VT', row: 1, col: 9 },
        { state: 'NH', row: 1, col: 10 },
        // Row 2
        { state: 'OR', row: 2, col: 1 },
        { state: 'ID', row: 2, col: 2 },
        { state: 'WY', row: 2, col: 3 },
        { state: 'SD', row: 2, col: 4 },
        { state: 'IA', row: 2, col: 5 },
        { state: 'IL', row: 2, col: 6 },
        { state: 'IN', row: 2, col: 7 },
        { state: 'OH', row: 2, col: 8 },
        { state: 'NY', row: 2, col: 9 },
        { state: 'MA', row: 2, col: 10 },
        { state: 'RI', row: 2, col: 11 },
        // Row 3
        { state: 'NV', row: 3, col: 1 },
        { state: 'UT', row: 3, col: 2 },
        { state: 'CO', row: 3, col: 3 },
        { state: 'NE', row: 3, col: 4 },
        { state: 'KS', row: 3, col: 5 },
        { state: 'MO', row: 3, col: 6 },
        { state: 'KY', row: 3, col: 7 },
        { state: 'WV', row: 3, col: 8 },
        { state: 'PA', row: 3, col: 9 },
        { state: 'NJ', row: 3, col: 10 },
        { state: 'CT', row: 3, col: 11 },
        // Row 4
        { state: 'CA', row: 4, col: 1 },
        { state: 'AZ', row: 4, col: 2 },
        { state: 'NM', row: 4, col: 3 },
        { state: 'OK', row: 4, col: 5 },
        { state: 'AR', row: 4, col: 6 },
        { state: 'TN', row: 4, col: 7 },
        { state: 'VA', row: 4, col: 8 },
        { state: 'NC', row: 4, col: 9 },
        { state: 'MD', row: 4, col: 10 },
        { state: 'DE', row: 4, col: 11 },
        // Row 5
        { state: 'HI', row: 5, col: 0 },
        { state: 'TX', row: 5, col: 4 },
        { state: 'LA', row: 5, col: 6 },
        { state: 'MS', row: 5, col: 7 },
        { state: 'AL', row: 5, col: 8 },
        { state: 'GA', row: 5, col: 9 },
        { state: 'SC', row: 5, col: 10 },
        // Row 6
        { state: 'FL', row: 6, col: 9 }
    ];
    
    function getRiskColor(score) {
        if (score <= 15) return '#10b981';
        if (score <= 25) return '#34d399';
        if (score <= 35) return '#a3e635';
        if (score <= 45) return '#facc15';
        if (score <= 55) return '#fbbf24';
        if (score <= 65) return '#f97316';
        if (score <= 75) return '#ef4444';
        return '#dc2626';
    }
    
    function getRiskLevel(score) {
        if (score <= 20) return 'Low';
        if (score <= 35) return 'Moderate';
        if (score <= 50) return 'Elevated';
        if (score <= 65) return 'High';
        return 'Very High';
    }
    
    // Create grid container
    container.innerHTML = '';
    container.style.cssText = `
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        grid-template-rows: repeat(7, 1fr);
        gap: 3px;
        padding: 16px;
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        border-radius: 8px;
        min-height: 280px;
    `;
    
    // Create state tiles
    tileLayout.forEach(tile => {
        const data = stateData[tile.state] || { risk: 30, exposure: 1.0, entities: 100 };
        const div = document.createElement('div');
        div.className = 'state-tile';
        div.dataset.state = tile.state;
        div.dataset.risk = data.risk;
        div.dataset.exposure = data.exposure;
        div.dataset.entities = data.entities;
        div.style.cssText = `
            grid-row: ${tile.row + 1};
            grid-column: ${tile.col + 1};
            background: ${getRiskColor(data.risk)};
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 600;
            color: ${data.risk > 45 ? '#fff' : '#1e293b'};
            cursor: pointer;
            transition: all 0.2s ease;
            min-height: 32px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border: 1px solid rgba(255,255,255,0.3);
        `;
        div.textContent = tile.state;
        
        // Hover effects
        div.addEventListener('mouseenter', (e) => {
            div.style.transform = 'scale(1.1)';
            div.style.zIndex = '10';
            div.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            
            // Show tooltip
            if (tooltip) {
                const risk = data.risk;
                const riskLevel = getRiskLevel(risk);
                tooltip.innerHTML = `
                    <div class="tooltip-state">${getStateName(tile.state)}</div>
                    <div class="tooltip-row">
                        <span class="tooltip-label">Risk Level</span>
                        <span class="tooltip-value" style="color: ${getRiskColor(risk)}">${riskLevel}</span>
                    </div>
                    <div class="tooltip-row">
                        <span class="tooltip-label">Risk Score</span>
                        <span class="tooltip-value">${risk}/100</span>
                    </div>
                    <div class="tooltip-row">
                        <span class="tooltip-label">Exposure</span>
                        <span class="tooltip-value">$${data.exposure}B</span>
                    </div>
                    <div class="tooltip-row">
                        <span class="tooltip-label">Entities</span>
                        <span class="tooltip-value">${data.entities.toLocaleString()}</span>
                    </div>
                `;
                tooltip.classList.add('visible');
                
                const rect = div.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                tooltip.style.left = `${rect.left - containerRect.left + rect.width/2 - 90}px`;
                tooltip.style.top = `${rect.top - containerRect.top - 120}px`;
            }
        });
        
        div.addEventListener('mouseleave', () => {
            div.style.transform = 'scale(1)';
            div.style.zIndex = '1';
            div.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            if (tooltip) tooltip.classList.remove('visible');
        });
        
        container.appendChild(div);
    });
}

// =====================================================
// QRATE SCORECARD FUNCTIONALITY
// =====================================================

function initQRATEScorecard() {
    const sliders = document.querySelectorAll('.score-slider');
    const ratingScale = ['Caa3', 'Caa2', 'Caa1', 'B3', 'B2', 'B1', 'Ba3', 'Ba2', 'Ba1', 'Baa3', 'Baa2', 'Baa1', 'A3', 'A2', 'A1', 'Aa3', 'Aa2', 'Aa1', 'Aaa'];
    
    function getImpliedRating(sliderValue) {
        // Map slider value (1-21) to rating scale
        const index = Math.min(Math.max(Math.floor(sliderValue) - 1, 0), ratingScale.length - 1);
        return ratingScale[index];
    }
    
    function updateFactorScore(slider) {
        const factorRow = slider.closest('.factor-row');
        const scoreDisplay = factorRow?.querySelector('.factor-score');
        if (scoreDisplay) {
            scoreDisplay.textContent = getImpliedRating(slider.value);
        }
    }
    
    function updateCategoryScore(slider) {
        const category = slider.closest('.factor-category');
        const allSliders = category?.querySelectorAll('.score-slider');
        const categoryScore = category?.querySelector('.category-score');
        
        if (allSliders && categoryScore) {
            let total = 0;
            allSliders.forEach(s => total += parseInt(s.value));
            const avg = total / allSliders.length;
            categoryScore.textContent = getImpliedRating(avg);
        }
    }
    
    function updateOverallScore() {
        const allSliders = document.querySelectorAll('.score-slider');
        const impliedRatingBadge = document.querySelector('.rating-display.implied .rating-badge-large');
        const vsIndicator = document.querySelector('.vs-indicator span');
        const ratingInsight = document.querySelector('.rating-insight p');
        
        // Calculate weighted average
        const weights = {
            'tax-growth': 0.0833, 'income': 0.0833, 'employment': 0.0833,
            'fund-balance': 0.1, 'liquidity': 0.1, 'operating': 0.1,
            'debt-burden': 0.1, 'pension': 0.1,
            'management': 0.125, 'framework': 0.125
        };
        
        let weightedSum = 0;
        let totalWeight = 0;
        
        allSliders.forEach(slider => {
            const factor = slider.dataset.factor;
            const weight = weights[factor] || 0.1;
            weightedSum += parseInt(slider.value) * weight;
            totalWeight += weight;
        });
        
        const avgScore = weightedSum / totalWeight;
        const impliedRating = getImpliedRating(avgScore);
        
        // Update implied rating display
        if (impliedRatingBadge) {
            impliedRatingBadge.textContent = impliedRating;
            
            // Update badge color class
            impliedRatingBadge.className = 'rating-badge-large';
            if (impliedRating.startsWith('Aaa')) impliedRatingBadge.classList.add('aaa');
            else if (impliedRating.startsWith('Aa')) impliedRatingBadge.classList.add('aa');
            else if (impliedRating.startsWith('A')) impliedRatingBadge.classList.add('a');
            else if (impliedRating.startsWith('Baa')) impliedRatingBadge.classList.add('baa');
            else if (impliedRating.startsWith('Ba')) impliedRatingBadge.classList.add('ba');
            else impliedRatingBadge.classList.add('b');
        }
        
        // Calculate notch difference from actual rating (A2 = index 13)
        const actualRatingIndex = 13; // A2
        const impliedIndex = ratingScale.indexOf(impliedRating);
        const notchDiff = actualRatingIndex - impliedIndex;
        
        if (vsIndicator) {
            if (notchDiff > 0) {
                vsIndicator.textContent = `${notchDiff} Notch${notchDiff > 1 ? 'es' : ''}`;
                vsIndicator.parentElement.innerHTML = `<i class="fas fa-arrow-down"></i><span>${notchDiff} Notch${notchDiff > 1 ? 'es' : ''}</span>`;
                vsIndicator.parentElement.className = 'vs-indicator notch-diff';
            } else if (notchDiff < 0) {
                vsIndicator.textContent = `${Math.abs(notchDiff)} Notch${Math.abs(notchDiff) > 1 ? 'es' : ''}`;
                vsIndicator.parentElement.innerHTML = `<i class="fas fa-arrow-up"></i><span>${Math.abs(notchDiff)} Notch${Math.abs(notchDiff) > 1 ? 'es' : ''}</span>`;
                vsIndicator.parentElement.className = 'vs-indicator notch-diff positive';
            } else {
                vsIndicator.parentElement.innerHTML = `<i class="fas fa-equals"></i><span>Aligned</span>`;
                vsIndicator.parentElement.className = 'vs-indicator aligned';
            }
        }
        
        // Update insight text
        if (ratingInsight) {
            if (notchDiff > 0) {
                ratingInsight.innerHTML = `The implied rating is <strong>${notchDiff} notch${notchDiff > 1 ? 'es' : ''} below</strong> the current Moody's rating, primarily driven by weaker financial position metrics and elevated pension liabilities. Consider reviewing the pension funded ratio and fund balance trends.`;
            } else if (notchDiff < 0) {
                ratingInsight.innerHTML = `The implied rating is <strong>${Math.abs(notchDiff)} notch${Math.abs(notchDiff) > 1 ? 'es' : ''} above</strong> the current Moody's rating, suggesting potential for an upgrade. Strong economic fundamentals and governance factors are driving the positive assessment.`;
            } else {
                ratingInsight.innerHTML = `The implied rating is <strong>aligned</strong> with the current Moody's rating, indicating that the scorecard factors accurately reflect the entity's credit profile.`;
            }
        }
    }
    
    // Initialize slider event listeners
    sliders.forEach(slider => {
        slider.addEventListener('input', () => {
            updateFactorScore(slider);
            updateCategoryScore(slider);
            updateOverallScore();
        });
    });
    
    // Scenario buttons
    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const scenario = btn.textContent.trim();
            
            if (scenario === 'Stress Test') {
                // Reduce all scores by ~20%
                sliders.forEach(slider => {
                    const newVal = Math.max(1, parseInt(slider.value) - 4);
                    slider.value = newVal;
                    updateFactorScore(slider);
                    updateCategoryScore(slider);
                });
            } else if (scenario === 'Upside') {
                // Increase all scores by ~15%
                sliders.forEach(slider => {
                    const newVal = Math.min(21, parseInt(slider.value) + 3);
                    slider.value = newVal;
                    updateFactorScore(slider);
                    updateCategoryScore(slider);
                });
            } else {
                // Base case - reset to original values
                const baseValues = {
                    'tax-growth': 14, 'income': 12, 'employment': 11,
                    'fund-balance': 10, 'liquidity': 9, 'operating': 11,
                    'debt-burden': 8, 'pension': 6,
                    'management': 12, 'framework': 11
                };
                sliders.forEach(slider => {
                    const factor = slider.dataset.factor;
                    slider.value = baseValues[factor] || 10;
                    updateFactorScore(slider);
                    updateCategoryScore(slider);
                });
            }
            
            updateOverallScore();
        });
    });
}

// =====================================================
// DROPDOWN NAVIGATION
// =====================================================

document.querySelectorAll('.dropdown-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.dataset.page;
        if (pageId) {
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
                page.style.display = 'none'; // Force hide with inline style
            });
            // Show target page
            const targetPage = document.getElementById(`page-${pageId}`);
            if (targetPage) {
                targetPage.classList.add('active');
                targetPage.style.display = 'block'; // Force show with inline style
                // Update nav active state
                document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
                
                // Close and hide Dashboard-specific panels when navigating away from Dashboard
                const widgetManagerPanel = document.getElementById('widgetManagerPanel');
                const savedViewsDropdown = document.getElementById('savedViewsDropdown');
                const dashboardToolbar = document.querySelector('.dashboard-toolbar');
                const watchlistWidget = document.querySelector('[data-widget-id="watchlist"]');
                const watchlistSectionHeader = document.getElementById('watchlist-section-header');
                const marketActivityWidget = document.querySelector('[data-widget-id="market-activity"]');
                const liquidityWidget = document.querySelector('[data-widget-id="liquidity"]');
                const marketLiquiditySectionHeader = document.getElementById('market-liquidity-section-header');
                
                if (pageId !== 'dashboard') {
                    widgetManagerPanel?.classList.remove('open');
                    widgetManagerPanel?.classList.add('dashboard-hidden');
                    savedViewsDropdown?.classList.remove('open');
                    dashboardToolbar?.classList.add('dashboard-hidden');
                    // Explicitly hide watchlist widget
                    if (watchlistWidget) watchlistWidget.style.display = 'none';
                    if (watchlistSectionHeader) watchlistSectionHeader.style.display = 'none';
                    // Explicitly hide Market & Liquidity widgets
                    if (marketActivityWidget) marketActivityWidget.style.display = 'none';
                    if (liquidityWidget) liquidityWidget.style.display = 'none';
                    if (marketLiquiditySectionHeader) marketLiquiditySectionHeader.style.display = 'none';
                } else {
                    widgetManagerPanel?.classList.remove('dashboard-hidden');
                    dashboardToolbar?.classList.remove('dashboard-hidden');
                    // Show watchlist widget on Dashboard
                    if (watchlistWidget) watchlistWidget.style.display = '';
                    if (watchlistSectionHeader) watchlistSectionHeader.style.display = '';
                    // Show Market & Liquidity widgets on Dashboard
                    if (marketActivityWidget) marketActivityWidget.style.display = '';
                    if (liquidityWidget) liquidityWidget.style.display = '';
                    if (marketLiquiditySectionHeader) marketLiquiditySectionHeader.style.display = '';
                }
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Reinitialize animations
                setTimeout(() => initWidgetAnimations(), 100);
            }
        }
    });
});

// =====================================================
// DASHBOARD CUSTOMIZATION
// =====================================================

function initDashboardCustomization() {
    const widgetGrid = document.getElementById('widgetGrid');
    const editModeBtn = document.getElementById('toggleEditMode');
    const manageWidgetsBtn = document.getElementById('manageWidgets');
    const widgetManagerPanel = document.getElementById('widgetManagerPanel');
    const closeWidgetManager = document.getElementById('closeWidgetManager');
    const resetLayoutBtn = document.getElementById('resetLayout');
    const saveLayoutBtn = document.getElementById('saveLayout');
    const savedViewsDropdown = document.getElementById('savedViewsDropdown');
    const savedViewsList = document.getElementById('savedViewsList');
    const newViewNameInput = document.getElementById('newViewName');
    const saveNewViewBtn = document.getElementById('saveNewView');
    const layoutPresets = document.querySelectorAll('.preset-btn');
    const widgetToggles = document.querySelectorAll('.widget-toggle input');
    
    let isEditMode = false;
    let draggedWidget = null;
    
    // Load saved layout on init
    loadSavedLayout();
    loadSavedViews();
    
    // Toggle Edit Mode
    editModeBtn?.addEventListener('click', () => {
        isEditMode = !isEditMode;
        widgetGrid?.classList.toggle('edit-mode', isEditMode);
        editModeBtn.classList.toggle('active', isEditMode);
        editModeBtn.innerHTML = isEditMode 
            ? '<i class="fas fa-check"></i><span>Done</span>'
            : '<i class="fas fa-edit"></i><span>Customize</span>';
        
        if (isEditMode) {
            showToast('Drag widgets to rearrange your dashboard', 'info');
        }
    });
    
    // Widget Manager Panel
    manageWidgetsBtn?.addEventListener('click', () => {
        widgetManagerPanel?.classList.toggle('open');
    });
    
    closeWidgetManager?.addEventListener('click', () => {
        widgetManagerPanel?.classList.remove('open');
    });
    
    // Widget Toggles
    widgetToggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            const widgetId = toggle.dataset.widget;
            const widget = document.querySelector(`[data-widget-id="${widgetId}"]`);
            if (widget) {
                widget.classList.toggle('hidden-widget', !toggle.checked);
            }
        });
    });
    
    // Layout Presets
    layoutPresets.forEach(btn => {
        btn.addEventListener('click', () => {
            layoutPresets.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const layout = btn.dataset.layout;
            widgetGrid?.classList.remove('compact-layout', 'list-layout');
            
            if (layout === 'compact') {
                widgetGrid?.classList.add('compact-layout');
            } else if (layout === 'list') {
                widgetGrid?.classList.add('list-layout');
            }
        });
    });
    
    // Reset Layout
    resetLayoutBtn?.addEventListener('click', () => {
        if (confirm('Reset dashboard to default layout? This will remove all customizations.')) {
            localStorage.removeItem('muniview_dashboard_layout');
            localStorage.removeItem('muniview_widget_visibility');
            localStorage.removeItem('muniview_layout_preset');
            
            // Reset widget order
            const widgets = Array.from(widgetGrid?.querySelectorAll('.draggable-widget') || []);
            widgets.sort((a, b) => {
                const orderA = parseInt(a.dataset.order) || 0;
                const orderB = parseInt(b.dataset.order) || 0;
                return orderA - orderB;
            });
            widgets.forEach(widget => widgetGrid?.appendChild(widget));
            
            // Reset visibility
            widgetToggles.forEach(toggle => {
                toggle.checked = true;
                const widgetId = toggle.dataset.widget;
                const widget = document.querySelector(`[data-widget-id="${widgetId}"]`);
                widget?.classList.remove('hidden-widget');
            });
            
            // Reset layout preset
            layoutPresets.forEach(b => b.classList.remove('active'));
            document.querySelector('[data-layout="default"]')?.classList.add('active');
            widgetGrid?.classList.remove('compact-layout', 'list-layout');
            
            showToast('Dashboard reset to default layout', 'success');
        }
    });
    
    // Save Layout Button - Toggle dropdown
    saveLayoutBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        savedViewsDropdown?.classList.toggle('open');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!savedViewsDropdown?.contains(e.target) && e.target !== saveLayoutBtn) {
            savedViewsDropdown?.classList.remove('open');
        }
    });
    
    // Save New View
    saveNewViewBtn?.addEventListener('click', () => {
        const viewName = newViewNameInput?.value.trim();
        if (!viewName) {
            showToast('Please enter a view name', 'error');
            return;
        }
        
        saveCurrentLayout(viewName);
        newViewNameInput.value = '';
        loadSavedViews();
        showToast(`View "${viewName}" saved successfully`, 'success');
    });
    
    // Drag and Drop Functionality
    const widgets = widgetGrid?.querySelectorAll('.draggable-widget');
    
    widgets?.forEach(widget => {
        widget.setAttribute('draggable', 'true');
        
        widget.addEventListener('dragstart', (e) => {
            if (!isEditMode) {
                e.preventDefault();
                return;
            }
            draggedWidget = widget;
            widget.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });
        
        widget.addEventListener('dragend', () => {
            widget.classList.remove('dragging');
            draggedWidget = null;
            
            // Remove drag-over class from all widgets
            widgets.forEach(w => w.classList.remove('drag-over'));
        });
        
        widget.addEventListener('dragover', (e) => {
            if (!isEditMode || !draggedWidget || draggedWidget === widget) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            widget.classList.add('drag-over');
        });
        
        widget.addEventListener('dragleave', () => {
            widget.classList.remove('drag-over');
        });
        
        widget.addEventListener('drop', (e) => {
            if (!isEditMode || !draggedWidget || draggedWidget === widget) return;
            e.preventDefault();
            widget.classList.remove('drag-over');
            
            // Get all widgets and their positions
            const allWidgets = Array.from(widgetGrid.querySelectorAll('.draggable-widget'));
            const draggedIndex = allWidgets.indexOf(draggedWidget);
            const targetIndex = allWidgets.indexOf(widget);
            
            // Reorder
            if (draggedIndex < targetIndex) {
                widget.after(draggedWidget);
            } else {
                widget.before(draggedWidget);
            }
            
            showToast('Widget moved', 'success');
        });
    });
    
    // Save current layout to localStorage
    function saveCurrentLayout(viewName) {
        const widgets = Array.from(widgetGrid?.querySelectorAll('.draggable-widget') || []);
        const layout = widgets.map(w => ({
            id: w.dataset.widgetId,
            visible: !w.classList.contains('hidden-widget')
        }));
        
        const activePreset = document.querySelector('.preset-btn.active')?.dataset.layout || 'default';
        
        const savedViews = JSON.parse(localStorage.getItem('muniview_saved_views') || '{}');
        savedViews[viewName] = {
            layout,
            preset: activePreset,
            timestamp: Date.now()
        };
        
        localStorage.setItem('muniview_saved_views', JSON.stringify(savedViews));
        localStorage.setItem('muniview_current_view', viewName);
    }
    
    // Load saved layout from localStorage
    function loadSavedLayout() {
        const currentView = localStorage.getItem('muniview_current_view');
        if (!currentView || currentView === 'default') return;
        
        const savedViews = JSON.parse(localStorage.getItem('muniview_saved_views') || '{}');
        const view = savedViews[currentView];
        
        if (!view) return;
        
        // Apply layout order
        view.layout.forEach(item => {
            const widget = document.querySelector(`[data-widget-id="${item.id}"]`);
            if (widget) {
                widgetGrid?.appendChild(widget);
                widget.classList.toggle('hidden-widget', !item.visible);
                
                // Update toggle
                const toggle = document.querySelector(`input[data-widget="${item.id}"]`);
                if (toggle) toggle.checked = item.visible;
            }
        });
        
        // Apply preset
        if (view.preset) {
            layoutPresets.forEach(b => b.classList.remove('active'));
            document.querySelector(`[data-layout="${view.preset}"]`)?.classList.add('active');
            
            widgetGrid?.classList.remove('compact-layout', 'list-layout');
            if (view.preset === 'compact') {
                widgetGrid?.classList.add('compact-layout');
            } else if (view.preset === 'list') {
                widgetGrid?.classList.add('list-layout');
            }
        }
    }
    
    // Load saved views list
    function loadSavedViews() {
        const savedViews = JSON.parse(localStorage.getItem('muniview_saved_views') || '{}');
        const currentView = localStorage.getItem('muniview_current_view') || 'default';
        
        // Build list HTML
        let html = `
            <div class="saved-view-item ${currentView === 'default' ? 'default' : ''}" data-view="default">
                <i class="fas fa-home"></i>
                <span>Default View</span>
                <button class="load-view-btn" data-view="default">Load</button>
            </div>
        `;
        
        Object.keys(savedViews).forEach(name => {
            html += `
                <div class="saved-view-item ${currentView === name ? 'default' : ''}" data-view="${name}">
                    <i class="fas fa-bookmark"></i>
                    <span>${name}</span>
                    <button class="load-view-btn" data-view="${name}">Load</button>
                    <button class="delete-view-btn" data-view="${name}"><i class="fas fa-trash"></i></button>
                </div>
            `;
        });
        
        if (savedViewsList) {
            savedViewsList.innerHTML = html;
            
            // Add event listeners to load buttons
            savedViewsList.querySelectorAll('.load-view-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const viewName = btn.dataset.view;
                    localStorage.setItem('muniview_current_view', viewName);
                    location.reload();
                });
            });
            
            // Add event listeners to delete buttons
            savedViewsList.querySelectorAll('.delete-view-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const viewName = btn.dataset.view;
                    if (confirm(`Delete view "${viewName}"?`)) {
                        const views = JSON.parse(localStorage.getItem('muniview_saved_views') || '{}');
                        delete views[viewName];
                        localStorage.setItem('muniview_saved_views', JSON.stringify(views));
                        
                        if (localStorage.getItem('muniview_current_view') === viewName) {
                            localStorage.setItem('muniview_current_view', 'default');
                        }
                        
                        loadSavedViews();
                        showToast(`View "${viewName}" deleted`, 'success');
                    }
                });
            });
        }
    }
}

// Toast Notification
function showToast(message, type = 'info') {
    // Remove existing toast
    document.querySelector('.toast-notification')?.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Hide and remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// =====================================================
// WIDGET RESIZE FUNCTIONALITY
// =====================================================

function initWidgetResize() {
    const resizeButtons = document.querySelectorAll('.widget-resize-btn');
    
    resizeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const widget = btn.closest('.resizable-widget');
            if (!widget) return;
            
            const currentSize = widget.dataset.size || 'half';
            const newSize = currentSize === 'half' ? 'full' : 'half';
            
            // Update the data attribute
            widget.dataset.size = newSize;
            
            // Update the icon
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = newSize === 'full' ? 'fas fa-compress' : 'fas fa-expand';
            }
            
            // Update CSS classes
            widget.classList.remove('widget-half', 'widget-full');
            widget.classList.add(`widget-${newSize}`);
            
            // Show toast notification
            showToast(`Widget ${newSize === 'full' ? 'expanded' : 'collapsed'}`, 'info');
            
            // Trigger animation refresh
            setTimeout(() => initWidgetAnimations(), 100);
        });
    });
}

// =====================================================
// RESEARCH TABS
// =====================================================

function initResearchTabs() {
    const researchTabs = document.querySelectorAll('.research-tab');
    const researchContents = document.querySelectorAll('.research-tab-content');
    
    researchTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Remove active from all tabs
            researchTabs.forEach(t => t.classList.remove('active'));
            
            // Add active to clicked tab
            tab.classList.add('active');
            
            // Hide all content
            researchContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Show target content
            const targetContent = document.querySelector(`.research-tab-content[data-content="${targetTab}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// =====================================================
// INITIALIZATION COMPLETE
// =====================================================

console.log('%c Moody\'s MuniView ', 'background: linear-gradient(135deg, #1e3a5f, #0077b6); color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold;');
console.log('Keyboard shortcuts: 1-6 for navigation, Cmd/Ctrl+K for search, A for AI chat');
