# 🤖 Chat AI UI

[English](README.md) | [Русский](README.ru.md) 

🚀 [Live Demo](https://vue-chat-ai-ui.vercel.app/)

A modern, responsive frontend for the Chat AI application. Built with **Vue.js 3**, it provides a seamless interface for interacting with Gemini AI, powered by Stream Chat for real-time messaging and Neon PostgreSQL for data persistence.

![Application Screenshot](./src/assets/screen.png)

## ✨ Features

- 💬 **Real-time Messaging**: Powered by Stream Chat API.
- 🧠 **AI Integration**: Deep integration with Google Gemini for intelligent responses.
- ⚡ **Performance**: Built with Vue 3 and Vite for lightning-fast load times.
- 🛡️ **Security First**:
    - XSS Protection using DOMPurify.
    - Secure environment-based API routing.
    - Robust error handling for network requests.

## 🛠 Tech Stack

*   🟢 **Vue.js 3** — Core Framework
*   ⚡ **Vite** — Build Tool
*   🐘 **PostgreSQL (Neon)** — Database
*   ✨ **Google Gemini** — AI Engine
*   💬 **Stream Chat** — Messaging API


## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com
cd vue-chat-ai-ui
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
# Development
VITE_API_URL=http://localhost:3000

# Production
VITE_API_URL=https://your-api-domain.com
```

### 4. Run Development Server
```bash
npm run dev
```

## 🏗 Build for Production

```bash
npm run build
```
The optimized output will be available in the `dist/` directory.

## 🔗 Related Projects
This frontend requires the **Node.js Express Backend** to function.
👉 [Find the Backend API here](https://github.com/DavidSulava/node-chat-ai-api)

