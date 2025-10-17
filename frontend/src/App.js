import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "./App.css";

// Import components
import LoadingScreen from "./components/LoadingScreen";
import HomePage from "./components/HomePage";
import LessonPage from "./components/LessonPage";
import QuizPage from "./components/QuizPage";
import ProfilePage from "./components/ProfilePage";
import ChallengePage from "./components/ChallengePage";
import { Toaster } from "./components/ui/sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// const BACKEND_URL = process.env.NODE_ENV === 'production' ? '' : process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Main App Component
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  // const initializeApp = async () => {
  //   try {
  //     // Initialize sample data
  //     await axios.post(`${API}/initialize-data`);

  //     // Create or get demo user
  //     const demoUser = {
  //       username: "Advanced Explorer",
  //       email: "explorer@dentalquest.academy"
  //     };

  //     try {
  //       const userResponse = await axios.post(`${API}/users`, demoUser);
  //       setUser(userResponse.data);
  //     } catch (e) {
  //       // User might already exist, create a new one with timestamp
  //       const newUser = {
  //         ...demoUser,
  //         username: `Advanced Explorer ${Date.now()}`
  //       };
  //       const userResponse = await axios.post(`${API}/users`, newUser);
  //       setUser(userResponse.data);
  //     }

  //     // Get lessons
  //     const lessonsResponse = await axios.get(`${API}/lessons`);
  //     setLessons(lessonsResponse.data);

  //     // Simulate loading for better UX
  //     setTimeout(() => setIsLoading(false), 3000);
  //   } catch (error) {
  //     console.error("App initialization error:", error);
  //     setIsLoading(false);
  //   }
  // };
  // REPLACE your old initializeApp function with this one
  // const initializeApp = async () => {
  //   try {
  //     // Initialize sample data first
  //     await axios.post(`${API}/initialize-data`);

  //     // Now, try to find or create the demo user.
  //     // The updated backend handles this logic automatically.
  //     const demoUser = {
  //       username: "Advanced Explorer",
  //       email: "explorer@dentalquest.academy"
  //     };

  //     const userResponse = await axios.post(`${API}/users`, demoUser);
  //     setUser(userResponse.data);

  //     // Get lessons
  //     const lessonsResponse = await axios.get(`${API}/lessons`);
  //     setLessons(lessonsResponse.data);

  //     // Simulate loading for better UX
  //     setTimeout(() => setIsLoading(false), 2000); // Reduced timeout
  //   } catch (error) {
  //     console.error("App initialization error:", error);
  //     // You can add more specific error handling here if needed
  //     setIsLoading(false); // Stop loading even if there's an error
  //   }
  // };
  // In frontend/src/App.js
  // In frontend/src/App.js

  // REPLACE your old initializeApp function with this one
  const initializeApp = async () => {
    console.log("--- RUNNING IN OFFLINE MODE WITH FAKE DATA ---");
    console.log("Bypassing all API calls.");

    // 1. Create a fake user object. This is what the backend would normally send.
    const fakeUser = {
      id: "fake-user-12345",
      username: "Hackathon Explorer",
      email: "explorer@dentalquest.academy",
      level: 2,
      total_score: 150,
      achievements: ["explorer", "expert"],
    };

    // 2. Create some fake lesson data.
    const fakeLessons = [
      {
        id: "lesson-1-fake",
        title: "Tooth Brushing Basics (Demo)",
        description: "Learn the proper way to brush your teeth for optimal oral hygiene.",
        level: 1,
        content: { key_points: ["Brush for at least 2 minutes", "Use fluoride toothpaste"] },
        quiz_questions: [{ question: "How long should you brush your teeth?", options: ["30 seconds", "1 minute", "2 minutes"], correct_answer: "2 minutes" }],
      },
      {
        id: "lesson-2-fake",
        title: "Healthy Foods for Strong Teeth (Demo)",
        description: "Discover which foods help keep your teeth strong and healthy.",
        level: 1,
        content: { key_points: ["Calcium-rich foods are great", "Avoid sugary snacks"] },
        quiz_questions: [{ question: "Which is best for teeth?", options: ["Candy", "Cheese", "Soda"], correct_answer: "Cheese" }],
      },
    ];

    // 3. Immediately set the state with this fake data.
    setUser(fakeUser);
    setLessons(fakeLessons);

    // 4. Stop the main loading screen.
    setTimeout(() => setIsLoading(false), 1000); // 1-second delay for effect
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="App min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  user={user}
                  lessons={lessons}
                  onSelectLesson={setCurrentLesson}
                />
              }
            />
            <Route
              path="/lesson/:id"
              element={
                <LessonPage
                  lesson={currentLesson}
                  user={user}
                />
              }
            />
            <Route
              path="/quiz/:id"
              element={
                <QuizPage
                  lesson={currentLesson}
                  user={user}
                />
              }
            />
            <Route
              path="/challenge/:challengeType"
              element={
                <ChallengePage
                  user={user}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <ProfilePage
                  user={user}
                  setUser={setUser}
                />
              }
            />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;