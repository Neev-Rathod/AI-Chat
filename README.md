# AI Chat 🤖💬

An intelligent chat application with an AI-powered copilot that enhances your messaging experience through context-aware suggestions, tone adjustment, and grammar correction.

## 🌐 Live Demo

Check out the live application: [AI Chat on Vercel](https://ai-chat-eta-seven.vercel.app/)

## ✨ Features

- **Smart AI Copilot**: Context-aware message suggestions powered by Google's Gemini 2.0 Flash model
- **Tone Adjustment**: Modify your message tone (professional, casual, friendly, formal, etc.)
- **Grammar & Spelling Correction**: Real-time grammar and spelling fixes
- **Enhanced Chat Experience**: Intuitive interface with smooth animations and responsive design
- **Context Understanding**: AI analyzes chat history to provide relevant suggestions

## 🚀 Technology Stack

### Frontend
- **React** - Modern React with latest features
- **React Router DOM** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Motion1** - Smooth animations and transitions
- **Lucide React** - Beautiful icons

### AI Integration
- **Google Generative AI (@google/genai)** - Gemini 2.0 Flash model integration
- **Axios** - HTTP client for API requests

### Build Tools
- **Vite** - Fast build tool and development server
- **@tailwindcss/vite** - TailwindCSS Vite integration


## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-chat.git
   cd ai-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Getting a Gemini API Key

1. Visit the [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `VITE_GEMINI_API_KEY`

## 🎯 Usage

### Basic Chat
- Type your message in the input field
- Send messages normally as you would in any chat application

### AI Copilot Features

#### **Context-Aware Suggestions**
- The AI analyzes your conversation history
- Provides relevant message suggestions based on context
- Adapts to your communication style over time

#### **Tone Adjustment**
- Select from various tone options:
  - Professional
  - Casual
  - Friendly
  - Formal
  - Humorous
  - Empathetic
- AI rewrites your message to match the selected tone

#### **Grammar & Spelling Correction**
- Real-time grammar checking
- Automatic spelling corrections
- Suggestions for better word choices
- Maintains your original meaning while improving clarity

## 📱 Responsive Design

- **Desktop**: Full-featured interface with sidebar panels
- **Tablet**: Adaptive layout with collapsible panels
- **Mobile**: Optimized mobile experience 

