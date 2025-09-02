// server.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Function to call OpenAI API
async function summarizeWithOpenAI(text) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates concise summaries of text. Provide a clear, informative summary that captures the main points.'
        },
        {
          role: 'user',
          content: `Please summarize the following text: ${text}`
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.choices[0].message.content.trim();
}

// Function to call Gemini API
async function summarizeWithGemini(text) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [
            {
              text: `You are a helpful assistant that creates concise summaries of text. Provide a clear, informative summary that captures the main points. Please summarize the following text: ${text}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 150,
        stopSequences: []
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.data.candidates || response.data.candidates.length === 0) {
    throw new Error('No response generated from Gemini');
  }

  return response.data.candidates[0].content.parts[0].text.trim();
}

// POST /summarize endpoint
app.post('/summarize', async (req, res) => {
  try {
    const { text, provider = 'openai' } = req.body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        error: 'Invalid input. Please provide a "text" field with string content.'
      });
    }

    // Validate provider
    if (!['openai', 'gemini'].includes(provider.toLowerCase())) {
      return res.status(400).json({
        error: 'Invalid provider. Supported providers are "openai" and "gemini".'
      });
    }

    let summary;

    // Call the appropriate AI service
    if (provider.toLowerCase() === 'openai') {
      summary = await summarizeWithOpenAI(text);
    } else {
      summary = await summarizeWithGemini(text);
    }

    // Return response in required format
    res.json({ 
      summary,
      provider: provider.toLowerCase()
    });

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    
    // Handle OpenAI specific errors
    if (error.response?.status === 401 && error.config?.url?.includes('openai')) {
      return res.status(401).json({
        error: 'Invalid OpenAI API key'
      });
    }
    
    // Handle Gemini specific errors
    if (error.response?.status === 400 && error.config?.url?.includes('googleapis')) {
      return res.status(400).json({
        error: 'Invalid Gemini API key or request format'
      });
    }

    if (error.response?.status === 429) {
      return res.status(429).json({
        error: 'API rate limit exceeded'
      });
    }

    // Handle missing API key errors
    if (error.message?.includes('API key not configured')) {
      return res.status(500).json({
        error: error.message
      });
    }

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Available providers: OpenAI${process.env.OPENAI_API_KEY ? ' ✓' : ' ✗'}, Gemini${process.env.GEMINI_API_KEY ? ' ✓' : ' ✗'}`);
});

module.exports = app;