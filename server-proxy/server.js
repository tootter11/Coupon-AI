require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Import OpenAI (or other LLM) service here
// const OpenAI = require('openai'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Security: Use CORS to limit access only to your extension's origin 
// For Codespaces testing, we allow all origins (*), but for production, restrict it.
app.use(cors()); 
app.use(express.json());

// Load the AI Key securely from the .env file
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


// Endpoint called by the extension's Background Service Worker
app.post('/analyze-content', async (req, res) => {
    const { url, title, bodyText } = req.body;

    if (!bodyText) {
        return res.status(400).json({ error: 'Missing content for analysis.' });
    }

    // --- CRITICAL SECURITY STEP ---
    // The API key is used here on the server, hidden from the client.
    
    const prompt = `Analyze the following webpage content from the URL: ${url} and Title: ${title}. Look for promotional codes, ongoing sales, or loyalty rewards.
    
    CONTENT: "${bodyText}"
    
    Respond STRICTLY in JSON format with two fields: 'coupon_status' (e.g., 'Found', 'None'), 'coupon_code' (the code, or null), and 'related_ad' (a suggested affiliate offer or text).`;

    try {
        // --- Simulated AI Analysis ---
        // In a real application, replace this with the actual openai.chat.completions.create call
        
        console.log(`Sending prompt to AI for analysis of: ${title}`);
        
        // Mock Response for demonstration:
        const mockResponse = {
            coupon_status: title.includes("sale") ? 'Found' : 'None',
            coupon_code: title.includes("sale") ? 'SUMMER20' : null,
            related_ad: 'Get 5% cash back at a competitor store!', // Targeted Ad Content
            debug_info: `Analyzed ${bodyText.length} characters.`
        };

        // 4. Server sanitizes and sends back structured, clean data
        res.json(mockResponse);

    } catch (error) {
        console.error('AI Service Error:', error);
        res.status(500).json({ 
            coupon_status: 'Error', 
            coupon_code: null,
            related_ad: 'System error. Try again later.',
            message: 'Failed to communicate with AI service.' 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Secure Proxy Server running on port ${PORT}`);
});