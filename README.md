# Chat AI UI

This is the frontend for the Chat AI application. It is a **Vue.js 3** application that uses a custom API to interact with [Stream Chat](https://getstream.io), your own [Neon](https://neon.tech) PostgreSQL database and [Gemini](https://aistudio.google.com/).

<img src="./src/assets/screen.png" />

The Express backend API for this application can be found [here]().

## Installation

1. Clone the repository
2. Run `npm install`
3. Create a `.env` file in the root directory and add the following environment variables:

```
VITE_API_URL=http://localhost:5000
```

4. Run the server with `npm run dev` and open on `http://localhost:3000`
