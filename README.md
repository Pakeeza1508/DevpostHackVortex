# Dental Quest: AI-Powered Dental Education Platform

Dental Quest is an interactive, full-stack web application designed to make learning about dental health fun and engaging. It features AI-powered tutoring, interactive lessons, quizzes, and challenges.

## ✨ Tech Stack

-   **Backend:** Python, FastAPI, MongoDB, Groq AI
-   **Frontend:** React, Framer Motion, Tailwind CSS
-   **Package Managers:** Pip (Python), Yarn (JavaScript)
-   **Deployment:** Vercel

## 🚀 Prerequisites

Before you begin, ensure you have the following installed on your system:

1.  **Python** (version 3.7+ recommended)
2.  **Node.js** (version 18+ recommended)
3.  **Yarn** (If you don't have it, install it globally by running: `npm install -g yarn`)
4.  **MongoDB Atlas Account:** A free account for the cloud database.
5.  **Groq AI Account:** A free account to get an API key for the AI tutor.
---

## ⚙️ Setup and Installation Guide

Follow these steps to set up your local development environment.

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd <your-project-directory>
```

### Step 2: Backend Setup (Python & FastAPI)

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
