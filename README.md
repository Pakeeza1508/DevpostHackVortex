# 🦷 Dental Quest: AI-Powered Dental Education Platform

**Dental Quest** is an interactive, full-stack web application designed to make learning about dental health *fun and engaging*.  
It features **AI-powered tutoring**, **interactive lessons**, **quizzes**, and **challenges** to help users explore dental education through gamified learning experiences.

Built as part of the **Devpost Hack Vortex Hackathon**, this project showcases how AI and modern full-stack tools can make education both smart and accessible.

---

## ✨ Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React · Tailwind CSS · Framer Motion |
| **Backend** | Python · FastAPI · MongoDB · Groq AI |
| **Package Managers** | Pip (Python) · Yarn (JavaScript) |
| **Deployment** | Vercel |

---

## 🚀 Prerequisites

Before setting up the project locally, make sure you have the following installed:

1. **Python** (version 3.7 or higher)  
2. **Node.js** (version 18 or higher)  
3. **Yarn** (install globally if missing):
   ```bash
   npm install -g yarn
4. **MongoDB Atlas Account** — for cloud-based database
5. **Groq AI Account** — to obtain your API key for the AI tutor
---

## ⚙️ Setup and Installation Guide

Follow these steps to set up your local development environment.

### Clone the Repository

```bash
git clone <your-repository-url>
cd <your-project-directory>
```

### Backend Setup (Python & FastAPI)

```
# On Windows
py -m venv venv

Activate the environment:

# On Windows
.\venv\Scripts\activate
```
Your terminal prompt should now be prefixed with (venv).

### Install Backend Dependencies
```
pip install -r backend/requirements.txt
```
Configure Environment Variables
```
Navigate to the backend directory.
Create a new file named .env.

# Get this from MongoDB Atlas (see documentation)
MONGO_URL="mongodb+srv://your_user:your_password@your_cluster.mongodb.net/"

# This will be the name of the database created in your cluster
DB_NAME="dental_quest_db"

# Get this from your Groq AI dashboard
GROQ_API_KEY="your_groq_api_key_here"

CORS_ORIGINS="http://localhost:3000"
```
### Step 3: Frontend Setup (React & Yarn)

Navigate to the Frontend Directory
```
cd frontend
yarn install
```
Configure Environment Variables
```
# frontend/.env.local

REACT_APP_BACKEND_URL=http://localhost:8000
WDS_SOCKET_PORT=0
GENERATE_SOURCEMAP=false
```
### ▶️ Running the Application
Terminal 1: Start the Backend Server

Navigate to the project's root directory.
```
Activate the virtual environment: 
.\venv\Scripts\activate
```
Start the FastAPI server using Uvicorn:
```
uvicorn backend.server:app --reload
```
Your backend API is now running at http://localhost:8000. Leave this terminal open.

### Terminal 2: Start the Frontend Application

Open a new terminal window.
```
Navigate to the frontend directory: 
cd frontend
```
Start the React development server:
```
yarn start
```
Your default web browser should automatically open to http://localhost:3000. The application is now running!

# Commands for your teammates:
```
git checkout main
git fetch origin
git reset --hard origin/main
```

## 🧩 Hackathon Context

Built for **Devpost HackVortex**, Dental Quest leverages AI and modern full-stack tools to reimagine how dental education can be delivered interactively.  
From smart AI tutors to playful quizzes, the platform blends *learning* with *engagement*.
---
## 🏁 Deployment

Hosted on **Vercel** for seamless CI/CD integration and instant frontend updates.

🔗 **Live Demo:** [https://hack-vortex-frontend.vercel.app/]

---

## 📬 Contributors

- **Pakeeza** 
- **Mehboob** 
- **Talha** 
- **Abdul Rehman** 

## 🧠 Keywords

`AI Tutor` · `Dental Education` · `FastAPI` · `Groq AI` · `React` · `Tailwind` · `Framer Motion` · `Hackathon Project`


