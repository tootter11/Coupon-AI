// --- 1. Data Scraping & Transmission (Privacy by Design) ---
function scrapePageData() {
    // Only scrape minimal, necessary data
    const title = document.title || 'No Title Found';
    const url = window.location.href;
    
    // A simplified way to get potential promotional text
    // (In a real scenario, this would be more targeted)
    const bodyText = document.body.innerText.substring(0, 2000); 

    // Send the minimal data to the secure Background Service Worker
    chrome.runtime.sendMessage({
        action: 'scrape_data_ready',
        payload: { title, url, bodyText }
    }, (response) => {
        if (response.status === 'success') {
            displayResults(response.result);
        } else {
            displayError(response.message);
        }
    });
}

// --- 2. Sidebar Injection and UI Management ---

function injectSidebar() {
    // Check if the sidebar is already present
    if (document.getElementById('ai-coupon-sidebar')) {
        return;
    }

    const sidebar = document.createElement('div');
    sidebar.id = 'ai-coupon-sidebar';
    sidebar.innerHTML = `
        <div id="ai-sidebar-header">
            <h3>AI Coupon Watch</h3>
            <button id="ai-sidebar-close">X</button>
        </div>
        <div id="ai-sidebar-results">
            <p>Scanning page content...</p>
        </div>
        <div id="ai-sidebar-ads" class="ad-unit">
            <!-- Ad space will be populated here -->
            <p>Targeted Ad Loading...</p>
        </div>
    `;
    document.body.appendChild(sidebar);

    // User Control: Implement the close mechanism
    document.getElementById('ai-sidebar-close').addEventListener('click', () => {
        sidebar.remove();
    });

    // Start the analysis immediately after injection
    scrapePageData();
}

// --- 3. Input Sanitization and Display ---

function displayResults(data) {
    const resultsDiv = document.getElementById('ai-sidebar-results');
    const adsDiv = document.getElementById('ai-sidebar-ads');

    if (!resultsDiv || !adsDiv) return;

    // Display AI Coupon Result (Sanitization is key here!)
    // ALWAYS use textContent when inserting data from external sources (AI/Server) 
    // to prevent XSS attacks (Input Sanitization rule).
    const resultElement = document.createElement('p');
    resultElement.textContent = `Coupon Status: ${data.coupon_status}`;
    resultsDiv.innerHTML = ''; // Clear loading text
    resultsDiv.appendChild(resultElement);
    
    if (data.coupon_code) {
        const codeElement = document.createElement('p');
        codeElement.textContent = `Code: ${data.coupon_code}`;
        resultsDiv.appendChild(codeElement);
    }
    
    // Display Ads/Monetization Content (Pop-up Ads with Side Space)
    if (data.related_ad) {
        // Ensure ad data is also sanitized if it contains external text
        adsDiv.textContent = `Sponsored: ${data.related_ad}`; 
    } else {
        adsDiv.textContent = 'No related offers available.';
    }
}

function displayError(message) {
    const resultsDiv = document.getElementById('ai-sidebar-results');
    if (resultsDiv) {
        resultsDiv.textContent = `Error: ${message}`;
    }
}

// Trigger injection when the page is fully loaded
window.addEventListener('load', injectSidebar);