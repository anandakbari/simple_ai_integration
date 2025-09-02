# AI Text Summarization API

A Node.js Express server that provides text summarization using OpenAI GPT-3.5 and Google Gemini APIs.

## Screenshot
<img width="1053" height="780" alt="image" src="https://github.com/user-attachments/assets/fa6274b6-7b6f-4899-bac1-049277056927" />


## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- np
- OpenAI API key and/or Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-summarization-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   OPENAI_API_KEY=your_openai_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   The server will start at `http://localhost:3000`

## Getting API Keys

### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Generate a new API key
4. Add it to your `.env` file

### Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Add it to your `.env` file

## API Endpoints

### POST `/summarize`

Summarize text using your choice of AI provider.

**Request Body:**
```json
{
  "text": "Your text to summarize here...",
  "provider": "openai"  // Optional: "openai" or "gemini" (defaults to "openai")
}
```

**Response:**
```json
{
  "summary": "Generated summary of the text...",
  "provider": "openai"
}
```

**Example Usage:**

```bash
# Using OpenAI (default)
curl -X POST http://localhost:3000/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Long article or document text here..."
  }'

# Using Gemini
curl -X POST http://localhost:3000/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Long article or document text here...",
    "provider": "gemini"
  }'
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- **400 Bad Request**: Invalid input or unsupported provider
- **401 Unauthorized**: Invalid API key
- **429 Too Many Requests**: API rate limit exceeded
- **500 Internal Server Error**: Server or API provider errors

**Error Response Format:**
```json
{
  "error": "Error description here"
}
```

## Dependencies

- **express**: Web framework
- **axios**: HTTP client for API requests
- **dotenv**: Environment variable management

## Development

### Project Structure
```
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── .env              # Environment variables (not tracked)
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

### Scripts

```bash
# Start the server
npm start

# Development with auto-reload (if nodemon is installed)
npm run dev
```

### Adding Nodemon for Development

```bash
npm install --save-dev nodemon
```

Add to `package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

## Configuration

You can configure the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `OPENAI_API_KEY` | OpenAI API key | Required for OpenAI |
| `GEMINI_API_KEY` | Google Gemini API key | Required for Gemini |

## License

MIT License - feel free to use this project for your own purposes.
