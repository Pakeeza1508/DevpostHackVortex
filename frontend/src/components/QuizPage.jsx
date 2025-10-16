import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Star,
  Zap,
  Target,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const BACKEND_URL = process.env.NODE_ENV === 'production' ? '' : process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const QuizPage = ({ lesson, user }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!showResults && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleSubmitQuiz();
    }
  }, [timeLeft, showResults]);

  if (!lesson || !lesson.quiz_questions || lesson.quiz_questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <Target className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
          <h2 className="text-2xl font-orbitron text-white mb-4">
            Mission Assessment Not Available
          </h2>
          <Button onClick={() => navigate("/")} className="neon-button">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Base
          </Button>
        </div>
      </div>
    );
  }

  const questions = lesson.quiz_questions;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answer,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const answers = Object.keys(selectedAnswers).map((questionIndex) => ({
        question_index: parseInt(questionIndex),
        selected_option: selectedAnswers[questionIndex],
      }));

      const response = await axios.post(`${API}/quiz/submit`, {
        user_id: user.id,
        lesson_id: lesson.id,
        answers: answers,
      });

      setQuizResults(response.data);
      setShowResults(true);

      if (response.data.passed) {
        toast.success("Mission Complete! You've passed the assessment!");
      } else {
        toast.error(
          "Mission needs retry. Don't worry, Dr. Rabbit believes in you!"
        );
      }
    } catch (error) {
      console.error("Quiz submission error:", error);
      toast.error(
        "Something went wrong with the assessment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBadge = (score) => {
    if (score >= 90)
      return {
        text: "Excellent!",
        color: "bg-green-500/20 text-green-400 border-green-400/50",
      };
    if (score >= 70)
      return {
        text: "Good Job!",
        color: "bg-yellow-500/20 text-yellow-400 border-yellow-400/50",
      };
    return {
      text: "Keep Trying!",
      color: "bg-red-500/20 text-red-400 border-red-400/50",
    };
  };

  if (showResults) {
    const scoreBadge = getScoreBadge(quizResults.score);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="space-bg"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass-card border-0">
              <CardContent className="p-8 text-center">
                {/* Success Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
                  className="mb-6"
                >
                  {quizResults.passed ? (
                    <Trophy className="w-20 h-20 mx-auto text-yellow-400" />
                  ) : (
                    <Target className="w-20 h-20 mx-auto text-orange-400" />
                  )}
                </motion.div>

                <motion.h2
                  className="text-4xl font-orbitron text-white neon-glow mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Mission{" "}
                  {quizResults.passed ? "Complete!" : "Assessment Complete"}
                </motion.h2>

                <motion.div
                  className="space-y-6 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Badge variant="secondary" className={scoreBadge.color}>
                    {scoreBadge.text}
                  </Badge>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card-dark p-4 rounded-lg">
                      <div
                        className={`text-3xl font-bold font-mono ${getScoreColor(
                          quizResults.score
                        )}`}
                      >
                        {quizResults.score}%
                      </div>
                      <div className="text-gray-400 font-space text-sm">
                        Final Score
                      </div>
                    </div>
                    <div className="glass-card-dark p-4 rounded-lg">
                      <div className="text-3xl font-bold font-mono text-cyan-400">
                        {quizResults.correct_answers}/
                        {quizResults.total_questions}
                      </div>
                      <div className="text-gray-400 font-space text-sm">
                        Correct Answers
                      </div>
                    </div>
                  </div>

                  {/* Dr. Rabbit Feedback */}
                  <div className="glass-card-dark p-6 rounded-lg">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <img
                          src="https://img.freepik.com/free-vector/cute-rabbit-waving-hand-cartoon-vector-icon-illustration-animal-nature-icon-isolated-flat-vector_138676-13891.jpg"
                          alt="Dr. Rabbit"
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            e.target.innerHTML = "🐰";
                            e.target.className = "text-xl";
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="text-cyan-400 font-orbitron font-semibold mb-2">
                          Dr. Rabbit's Feedback
                        </h4>
                        <p className="text-gray-300 font-space italic">
                          {quizResults.passed
                            ? "Outstanding work, space cadet! Your knowledge of dental health is stellar. Keep up the excellent oral hygiene habits!"
                            : "Good effort, brave explorer! Every astronaut learns from each mission. Review the materials and try again - I believe in you!"}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Button
                    onClick={() => navigate("/")}
                    className="neon-button px-6"
                    variant="outline"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Mission Control
                  </Button>
                  {!quizResults.passed && (
                    <Button
                      onClick={() => {
                        setShowResults(false);
                        setCurrentQuestion(0);
                        setSelectedAnswers({});
                        setTimeLeft(300);
                        setQuizResults(null);
                      }}
                      className="neon-button px-6"
                      variant="outline"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Retry Mission
                    </Button>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="space-bg"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <motion.header
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate(`/lesson/${lesson.id}`)}
              className="neon-button"
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Mission
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-orbitron text-white neon-glow">
                Mission Assessment
              </h1>
              <p className="text-cyan-400 font-space">{lesson.title}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge
              variant="secondary"
              className={`${
                timeLeft <= 60
                  ? "bg-red-500/20 text-red-400 border-red-400/50 animate-pulse"
                  : "bg-cyan-500/20 text-cyan-400 border-cyan-400/50"
              }`}
            >
              <Clock className="w-3 h-3 mr-1" />
              {formatTime(timeLeft)}
            </Badge>
          </div>
        </motion.header>

        {/* Progress */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-space text-sm">
              Question Progress
            </span>
            <span className="text-cyan-400 font-mono">
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-3 bg-black/30" />
        </motion.div>

        {/* Question Card */}
        <motion.div
          className="max-w-3xl mx-auto"
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="glass-card border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className="bg-purple-500/20 text-purple-400 border-purple-400/50"
                >
                  Question {currentQuestion + 1}
                </Badge>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-400 font-space text-sm">
                    {Object.keys(selectedAnswers).length} / {questions.length}{" "}
                    answered
                  </span>
                </div>
              </div>
              <CardTitle className="text-xl font-orbitron text-white leading-relaxed">
                {questions[currentQuestion]?.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {questions[currentQuestion]?.options?.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion, option)}
                    className={`p-4 rounded-lg text-left transition-all duration-200 font-space ${
                      selectedAnswers[currentQuestion] === option
                        ? "bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400"
                        : "bg-black/20 border border-gray-600 text-gray-300 hover:bg-white/10 hover:border-gray-400"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswers[currentQuestion] === option
                            ? "border-cyan-400 bg-cyan-400"
                            : "border-gray-500"
                        }`}
                      >
                        {selectedAnswers[currentQuestion] === option && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 0}
                  className="neon-button"
                  variant="outline"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex space-x-3">
                  {currentQuestion < questions.length - 1 ? (
                    <Button
                      onClick={handleNextQuestion}
                      disabled={!selectedAnswers[currentQuestion]}
                      className="neon-button"
                      variant="outline"
                    >
                      Next
                      <Zap className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmitQuiz}
                      disabled={
                        Object.keys(selectedAnswers).length <
                          questions.length || isSubmitting
                      }
                      className="neon-button px-6"
                      variant="outline"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="space-spinner w-4 h-4 mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Trophy className="w-4 h-4 mr-2" />
                          Complete Mission
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Overview */}
          <Card className="glass-card border-0 mt-6">
            <CardContent className="p-4">
              <h4 className="text-white font-orbitron mb-3">
                Question Overview
              </h4>
              <div className="flex flex-wrap gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 rounded-lg font-mono text-sm border-2 transition-all ${
                      index === currentQuestion
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-400"
                        : selectedAnswers[index]
                        ? "bg-green-500/20 border-green-400 text-green-400"
                        : "bg-black/20 border-gray-600 text-gray-400 hover:border-gray-400"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizPage;
