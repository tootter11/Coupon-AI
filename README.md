# Coupon-AI
AI Coupon Finder Extension
This project demonstrates a secure, MV3-compliant browser extension that uses a Language Model (AI) to analyze website content for coupons and rewards. It employs a server proxy to protect sensitive API keys and injects a persistent, non-intrusive sidebar UI.
Architecture Overview
Component	Role	Security Contribution
content.js (Content Script)	Scrapes minimal product data (URL, title) and injects the sidebar UI.	Uses strict DOM manipulation methods (textContent) for sanitization. Runs in an isolated world.
background.js (Service Worker)	Receives scraped data, coordinates the workflow, and makes secure calls to the Server Proxy.	Crucial: Prevents API keys from ever touching the client's browser.
server-proxy/server.js	Holds the secret AI API key (.env). Proxies the request from the extension to the AI service (e.g., OpenAI) and sanitizes the response.	Hides all secrets. Implements the true "security layer."
manifest.json	Defines permissions and enforces the Content Security Policy (CSP).	Restricts executable scripts and allowed network origins.
Setup Guide (Using GitHub Codespaces)
Step 1: Set up the Server Proxy (Security Layer)
The server proxy must be running and accessible over the internet for the extension to work securely.
Start a Codespace: Open this repository in a GitHub Codespace.
Navigate to Server: Open the Codespaces terminal and navigate to the server directory:
code
Bash
cd server-proxy
Install Dependencies:
code
Bash
npm install
Configure Environment: Create a file named .env based on .env.example.
code
Code
# .env
PORT=3000
OPENAI_API_KEY=sk-YOUR-SECRET-KEY-HERE
Run the Server:
code
Bash
node server.js
Note: Codespaces will automatically detect the running port (3000) and provide a temporary public URL (e.g., https://example-1234.codespaces.dev). Copy this URL—this is your SECURE_PROXY_URL.
Step 2: Configure the Extension
Update Background Script: Edit extension/background.js and replace the placeholder YOUR_SECURE_PROXY_URL with the URL copied in Step 1.
Step 3: Local Testing (Loading the Extension)
Since extensions cannot run inside Codespaces, you must download the built files:
Zip the Extension: In the Codespaces terminal, zip the necessary files:
code
Bash
zip -r coupon-extension.zip extension/
Download: Download the coupon-extension.zip file from the Codespaces file explorer. Unzip it locally.
Load Unpacked Extension (Chrome/Edge):
Open your browser and navigate to chrome://extensions.
Enable Developer Mode (usually top right).
Click Load unpacked.
Select the unzipped extension/ folder.
The extension is now running! Visit any e-commerce site to see the injected sidebar and trigger the AI analysis.