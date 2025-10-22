// WARNING: Replace this with the public URL from your Codespaces server proxy!
const SECURE_PROXY_URL = 'YOUR_SECURE_PROXY_URL/analyze-content';

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'scrape_data_ready') {
        
        // 1. Local Processing Preference: Ensure data is minimal
        console.log('Received data from page:', request.payload);

        // 2. AI Call via Secure Proxy
        fetch(SECURE_PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Minimize data sent for privacy
            body: JSON.stringify({
                url: request.payload.url,
                title: request.payload.title,
                text_content: request.payload.bodyText // Send relevant text
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // 3. AI Response: Data is sanitized and structured by the server proxy
            sendResponse({ status: 'success', result: data });
        })
        .catch(error => {
            console.error('Error fetching AI result:', error);
            sendResponse({ status: 'error', message: 'Failed to get AI analysis.' });
        });

        // Must return true to indicate you wish to send a response asynchronously
        return true; 
    }
});