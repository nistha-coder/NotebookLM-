# DocuMind — AI Document Assistant

A RAG (Retrieval-Augmented Generation) web application that lets you upload documents and chat with them using AI. Upload a PDF, DOCX, CSV, or other supported file and ask questions — answers are sourced strictly from your document.

---

## Features

- Upload documents and instantly index them into a vector database
- Ask natural language questions and get answers grounded in your document
- Strict RAG pipeline — the AI will not hallucinate or go outside the document
- Supports multiple file formats: PDF, DOCX, DOC, CSV, JSON, PPTX, TXT
- Clean chat UI with typing indicators, message history, and suggestion chips
- Drag and drop file upload with real-time status feedback
- Mobile responsive layout with collapsible sidebar

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| LangChain (`@langchain/community`, `@langchain/qdrant`) | Document loading, chunking, retrieval pipeline |
| `@xenova/transformers` | Local embeddings using `Xenova/all-MiniLM-L6-v2` |
| Qdrant | Vector database for storing and searching document embeddings |
| Groq API (`llama-3.3-70b-versatile`) | LLM for generating answers |
| Multer | File upload handling |
| CORS + dotenv | Cross-origin config and environment management |

### Frontend
| Technology | Purpose |
|---|---|
| HTML + CSS + Vanilla JS | Chat UI, upload zone, message rendering |
| Google Fonts (Syne + DM Sans) | Typography |

### Deployment
| Service | Role |
|---|---|
| Netlify | Frontend static hosting |
| Render | Backend Node.js hosting |
| Qdrant Cloud | Managed vector database |

---

## Project Structure

```
final_project/
├── frontend/
│   ├── index.html          # Landing page
│   └── chat.html           # Chat interface
└── backend/
    ├── server.js            # Express server entry point
    ├── package.json
    ├── qdrant.js            # Qdrant collection name export
    ├── routes/
    │   ├── upload.route.js  # POST /uploads — file upload & indexing
    │   └── chat.route.js    # POST /chat — query & answer
    ├── services/
    │   ├── loader.service.js   # Parse files by type
    │   ├── chunk.service.js    # Split docs into chunks
    │   ├── embed.service.js    # Generate embeddings locally
    │   ├── vector.service.js   # Store/search in Qdrant
    │   └── rag.service.js      # Call Groq LLM with context
    └── utils/
        └── supportedFiles.js   # Allowed file extensions
```

---

## Environment Variables

Create a `.env` file inside the `backend/` folder with the following keys:

```env
PORT=5000
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your-qdrant-api-key
COLLECTION_NAME=gen_ai_assign_3
GROQ_API_KEY=your-groq-api-key
HF_TOKEN=your-huggingface-token
```

| Variable | Where to get it |
|---|---|
| `QDRANT_URL` | Qdrant Cloud dashboard → your cluster URL |
| `QDRANT_API_KEY` | Qdrant Cloud → API Keys tab → Create API Key |
| `COLLECTION_NAME` | Any name you choose, e.g. `gen_ai_assign_3` |
| `GROQ_API_KEY` | console.groq.com → API Keys → Create Key |
| `HF_TOKEN` | huggingface.co → Settings → Access Tokens |

> Never commit your `.env` file. It is already included in `.gitignore`.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **Qdrant** — either a cloud instance (qdrant.io) or Docker locally
- **Groq API Key** — get one at [console.groq.com](https://console.groq.com)
- **Hugging Face Token** (optional, for private models)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/nistha-coder/NotebookLM-
cd NoteBookLLM
```

### Step 2 — Start Qdrant (if running locally)

```bash
docker run -p 6333:6333 qdrant/qdrant
```

> Skip this step if you're using Qdrant Cloud — just set `QDRANT_URL` to your cloud endpoint.

### Step 3 — Install Backend Dependencies

```bash
cd backend
npm install
```


### Step 4 — Start the Server

```bash
npm run dev
```

The server starts at `http://localhost:5000` and also serves the frontend automatically.

### Step 6 — Open in Browser

Navigate to:

```
http://localhost:5000
```

---

## 🏃 Run Commands

| Command | Description |
|---|---|
| `npm install` | Install all backend dependencies |
| `npm run dev` | Start the server in development mode (with hot reload if nodemon is configured) |
| `npm start` | Start the server in production mode |
| `docker run -p 6333:6333 qdrant/qdrant` | Start Qdrant locally via Docker |

---


## Deployment Guide

This app requires three separate services to deploy. Set them up in this order.

### 1. Qdrant Cloud (Vector Database)

1. Go to [cloud.qdrant.io](https://cloud.qdrant.io) and create a free account
2. Click **Create Cluster** → choose **Free tier** → select a region → click **Create**
3. Once ready, copy your **Cluster URL** from the dashboard
4. Go to the **API Keys** tab → click **Create API Key** → copy and save it

### 2. Render (Backend)

1. Go to [render.com](https://render.com) → **New +** → **Web Service**
2. Connect your GitHub repo
3. Configure the service:

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install --legacy-peer-deps` |
| Start Command | `npm start` |
| Instance Type | Free |

4. Under **Advanced** → **Add Environment Variable**, add all variables from the `.env` section above
5. Click **Create Web Service** and wait for the build to complete
6. Copy your Render URL (e.g. `https://your-app.onrender.com`)

### 3. Netlify (Frontend)

1. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import an existing project**
2. Connect your GitHub repo
3. Configure the build settings:

| Setting | Value |
|---|---|
| Base directory | `frontend` |
| Build command | *(leave empty)* |
| Publish directory | `frontend` |

4. Click **Deploy site**
5. Once deployed, copy your Netlify URL (e.g. `https://your-site.netlify.app`)

### 4. Final Wiring

After both Render and Netlify are deployed, update two things in your code:

**`frontend/chat.html`** — update the `API_BASE` variable:
```js
const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : 'https://your-app.onrender.com';  // ← your Render URL
```

**`backend/server.js`** — update CORS to allow your Netlify domain:
```js
app.use(cors({
  origin: ['https://your-site.netlify.app'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
```

Commit and push both changes. Render and Netlify will auto-redeploy.

---

## How It Works

1. **Upload** — user uploads a file via the frontend
2. **Load** — LangChain parses the file based on its type (PDF, DOCX, CSV, etc.)
3. **Chunk** — document is split into overlapping chunks (1000 chars, 200 overlap)
4. **Embed** — each chunk is converted to a 384-dimensional vector using `all-MiniLM-L6-v2` locally
5. **Store** — vectors are stored in a new Qdrant collection named after the file
6. **Query** — user asks a question; the question is embedded and top-3 matching chunks are retrieved
7. **Answer** — retrieved chunks are passed as context to Groq's `llama-3.3-70b-versatile` model, which generates a grounded answer

---

## Supported File Types

`.pdf` `.docx` `.doc` `.csv` `.json` `.pptx` `.txt`

---

## Notes

- The free Render tier spins down after 15 minutes of inactivity. The first request after idle may take ~30 seconds to respond.
- Each uploaded file creates a new Qdrant collection. The app always queries the most recently uploaded file.
- Embeddings are generated locally on the server using `@xenova/transformers` — no external embedding API needed.
