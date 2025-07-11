# 🎓 Ask Hull – University Regulations Chatbot
Ask Hull is an AI chatbot that helps students understand key academic policies at the University of Hull, including extensions, appeals, assessments, and support procedures. It uses modern full-stack tools and Google AI to provide conversational, helpful answers.

## 📘 What It Can Help You With
📅 Requesting assessment extensions

⚖️ Navigating academic appeals

❤️ Understanding support for study policies

🧾 Knowing penalties for late submission

🧠 Difference between formative and summative assessments

🎓 Meeting MSc credit requirements

## ⚙️ Tech Stack
| Layer            | Technology                         |
| ---------------- | ---------------------------------- |
| Frontend         | Next.js (App Router)               |
| LLM API          | Google Gemini via `@ai-sdk/google` |
| Embeddings       | GoogleGenAI (text-embedding-004)   |
| Vector DB        | Astra DB (`@datastax/astra-db-ts`) |
| Styling          | TailwindCSS                        |
| Build Tools      | TypeScript, ESLint                 |


## 🧠 Features
- AI chatbot trained on real Hull university policies

- Uses LangChain to split and embed document chunks

- Supports streamed answers using Vercel AI SDK

- Powered by Google Gemini via Google AI Studio

- Fast local dev with Turbopack

## 🚀 Getting Started
### 1. Prerequisites
- Node.js v18+

- Astra DB account (vector-enabled keyspace)

- Google Generative AI API Key

- Vercel (optional, for deployment)

### 2. Install

```
git clone https://github.com/your-username/ask-hull-chatbot.git
cd ask-hull-chatbot
npm install
```

### 3. Setup Environment Variables
Copy .env.example to .env.local and fill in your keys:

```
cp .env.example .env.local

```

```
ASTRA_DB_NAMESPACE="YOUR_KEYSPACE"
ASTRA_DB_COLLECTION="YOUR_COLLECTION_NAME"
ASTRA_DB_API_ENDPOINT="YOUR_ASTRA_DB_ENDPOINT"
ASTRA_DB_APPLICATION_TOKEN="YOUR_ASTRADB_APP_TOKEN"
GOOGLE_GENERATIVE_AI_API_KEY="YOUR_GOOGLE_AI_API_KEY"
```
### 4. Seed the Vector Database
Run the following command to process and store the initial University of Hull policy PDFs:

```
npm run seed
```

Currently, the bot includes:

- Academic Appeals

- Extensions and Additional Consideration

- Support for Study Policy

- Smoking Policy

🧩 **To expand**, just add more PDF URLs to ```scripts/seedDb.ts``` → hullRegulationsAndPolicies[], and re-run ```npm run seed```.

### 5. Start the Development Server
```
npm run dev
```
Then open: http://localhost:3000