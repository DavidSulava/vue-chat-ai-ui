# Chat AI UI

This is the frontend for the Chat AI application. It is a **Vue.js 3** application that uses a custom API to interact with [Stream Chat](https://getstream.io), your own [Neon](https://neon.tech) PostgreSQL database and [Gemini](https://aistudio.google.com/).

<img src="./src/assets/screen.png" />

Working demo is 👉[here](https://vue-chat-ai-ui.vercel.app/).
<br/>
The Express backend API for this application can be found 👉[here](https://github.com/DavidSulava/node-chat-ai-api).

## Installation

1. Clone the repository
2. Run `npm install`
3. Create a `.env` file in the root directory and add the following environment variables:

```
# For development (uses Vite proxy)
VITE_API_URL=http://localhost:3000

# For production (full URL required)
VITE_API_URL=https://your-api-domain.com
```

4. Run the server with `npm run dev` and open on `http://localhost:3000`

## Security Features

- ✅ **XSS Protection**: All user-generated content is sanitized using DOMPurify before rendering
- ✅ **API Error Handling**: Network errors are caught and displayed with user-friendly messages
- ✅ **Environment-based API URL**: Automatic switching between dev/prod API endpoints

## Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.
