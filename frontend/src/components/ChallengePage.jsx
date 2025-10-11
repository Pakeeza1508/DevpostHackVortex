import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, Timer, Target, CheckCircle2, XCircle, Trophy, Zap, Star, Brain, Award } from 'lucide-react';
import { toast } from 'sonner';

const ChallengePage = ({ user }) => {
  const navigate = useNavigate();
  const { challengeType } = useParams();
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Dr. Rabbit Character Component
  const DrRabbitCharacter = ({ size = "w-10 h-10", message = "" }) => (
    <div className="flex items-center space-x-3">
      <div className={`${size} rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-2xl`}>
        <div className="text-2xl">🐰</div>
      </div>
      {message && (
        <div className="glass-card-dark p-3 rounded-lg max-w-sm">
          <p className="text-cyan-300 font-space text-sm italic">{message}</p>
        </div>
      )}
    </div>
  );

  const challenges = {
    'speed-quiz': {
      title: 'Lightning Quiz Challenge',
      description: 'Answer 10 dental health questions as fast as you can!',
      timeLimit: 60,
      icon: <Timer className="w-6 h-6" />,
      color: 'from-yellow-400 to-orange-500',
      questions: [
        {
          question: "How many times should you brush your teeth daily?",
          options: ["Once", "Twice", "Three times", "Four times"],
          correct: "Twice"
        },
        {
          question: "What is the main ingredient in toothpaste that prevents cavities?",
          options: ["Calcium", "Fluoride", "Sodium", "Potassium"],
          correct: "Fluoride"
        },
        {
          question: "How long should you brush your teeth?",
          options: ["30 seconds", "1 minute", "2 minutes", "5 minutes"],
          correct: "2 minutes"
        },
        {
          question: "Which food is BEST for your teeth?",
          options: ["Candy", "Cheese", "Soda", "Cookies"],
          correct: "Cheese"
        },
        {
          question: "What causes tooth decay?",
          options: ["Bacteria", "Cold water", "Hot food", "Breathing"],
          correct: "Bacteria"
        },
        {
          question: "How often should you replace your toothbrush?",
          options: ["Every month", "Every 3 months", "Every 6 months", "Every year"],
          correct: "Every 3 months"
        },
        {
          question: "What is the hardest substance in the human body?",
          options: ["Bone", "Nail", "Tooth enamel", "Hair"],
          correct: "Tooth enamel"
        },
        {
          question: "When should you floss your teeth?",
          options: ["Only when something is stuck", "Once a week", "Daily", "Never"],
          correct: "Daily"
        },
        {
          question: "What should you do after eating sugary foods?",
          options: ["Sleep immediately", "Drink water", "Eat more sugar", "Nothing"],
          correct: "Drink water"
        },
        {
          question: "What is the best drink for your teeth?",
          options: ["Soda", "Juice", "Water", "Energy drinks"],
          correct: "Water"
        }
      ]
    },
    'perfect-score': {
      title: 'Perfect Score Challenge',
      description: 'Get 100% on this advanced dental knowledge test!',
      timeLimit: 180,
      icon: <Target className="w-6 h-6" />,
      color: 'from-green-400 to-emerald-500',
      questions: [
        {
          question: "What is the scientific name for tooth decay?",
          options: ["Gingivitis", "Periodontitis", "Caries", "Plaque"],
          correct: "Caries"
        },
        {
          question: "Which vitamin is most important for healthy gums?",
          options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
          correct: "Vitamin C"
        },
        {
          question: "What is the pH level at which tooth enamel begins to dissolve?",
          options: ["7.0", "6.5", "5.5", "4.5"],
          correct: "5.5"
        },
        {
          question: "How many permanent teeth does an adult typically have?",
          options: ["28", "30", "32", "34"],
          correct: "32"
        },
        {
          question: "What is the name of the soft tissue inside a tooth?",
          options: ["Enamel", "Dentin", "Pulp", "Cementum"],
          correct: "Pulp"
        }
      ]
    },
    'knowledge-master': {
      title: 'Knowledge Master Challenge',
      description: 'Demonstrate your comprehensive understanding of oral health!',
      timeLimit: 120,
      icon: <Brain className="w-6 h-6" />,
      color: 'from-purple-400 to-pink-500',
      questions: [
        {
          question: "What is the first sign of gum disease?",
          options: ["Tooth loss", "Bad breath", "Bleeding gums", "White spots"],
          correct: "Bleeding gums"
        },
        {
          question: "Which bacteria is primarily responsible for tooth decay?",
          options: ["E. coli", "Streptococcus mutans", "Staphylococcus", "Lactobacillus"],
          correct: "Streptococcus mutans"
        },
        {
          question: "What is the recommended fluoride concentration in toothpaste for adults?",
          options: ["500 ppm", "1000 ppm", "1450 ppm", "2000 ppm"],
          correct: "1450 ppm"
        },
        {
          question: "At what age do children typically get their first permanent tooth?",
          options: ["4 years", "6 years", "8 years", "10 years"],
          correct: "6 years"
        },
        {
          question: "Which technique is most effective for removing plaque?",
          options: ["Circular motions", "Back and forth", "Bass technique", "Vertical strokes"],
          correct: "Bass technique"
        }
      ]
    }
  };

  useEffect(() => {
    if (challengeType && challenges[challengeType]) {
      setCurrentChallenge(challenges[challengeType]);
      setTimeLeft(challenges[challengeType].timeLimit);
    }
  }, [challengeType]);

  useEffect(() => {
    if (isActive && timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isCompleted) {
      handleComplete();
    }
  }, [timeLeft, isActive, isCompleted]);

  const startChallenge = () => {
    setIsActive(true);
    toast.success("Challenge started! Good luck!");
  };

  const handleAnswerSelect = (answer) => {
    if (!isActive) return;
    
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answer
    });

    // Auto-advance for speed quiz
    if (challengeType === 'speed-quiz') {
      setTimeout(() => {
        if (currentQuestion < currentChallenge.questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          handleComplete();
        }
      }, 500);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < currentChallenge.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    setIsCompleted(true);
    
    // Calculate score
    let correctAnswers = 0;
    Object.keys(selectedAnswers).forEach(questionIndex => {
      const question = currentChallenge.questions[parseInt(questionIndex)];
      if (question && selectedAnswers[questionIndex] === question.correct) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / currentChallenge.questions.length) * 100);
    setScore(finalScore);

    if (finalScore === 100) {
      toast.success("🏆 Perfect Score! You're a dental health champion!");
    } else if (finalScore >= 80) {
      toast.success("🌟 Excellent work! You really know your dental health!");
    } else if (finalScore >= 60) {
      toast("👍 Good job! Keep learning to become a dental expert!");
    } else {
      toast("💪 Nice try! Dr. Rabbit believes you can do better next time!");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <Trophy className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
          <h2 className="text-2xl font-orbitron text-white mb-4">Challenge Not Found</h2>
          <Button onClick={() => navigate('/')} className="neon-button">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Academy
          </Button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
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
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
                  className="mb-6"
                >
                  {score === 100 ? (
                    <Trophy className="w-20 h-20 mx-auto text-yellow-400" />
                  ) : score >= 80 ? (
                    <Award className="w-20 h-20 mx-auto text-green-400" />
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
                  Challenge Complete!
                </motion.h2>

                <motion.div
                  className="space-y-6 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="text-6xl font-bold font-mono text-cyan-400">
                    {score}%
                  </div>

                  <Badge 
                    variant="secondary" 
                    className={`${
                      score === 100 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-400/50' :
                      score >= 80 ? 'bg-green-500/20 text-green-400 border-green-400/50' :
                      score >= 60 ? 'bg-blue-500/20 text-blue-400 border-blue-400/50' :
                      'bg-red-500/20 text-red-400 border-red-400/50'
                    }`}
                  >
                    {score === 100 ? 'Perfect!' : score >= 80 ? 'Excellent!' : score >= 60 ? 'Good Job!' : 'Keep Trying!'}
                  </Badge>

                  {/* Dr. Rabbit Feedback */}
                  <div className="glass-card-dark p-6 rounded-lg">
                    <DrRabbitCharacter 
                      size="w-12 h-12"
                      message={
                        score === 100 
                          ? "Outstanding! You've mastered this challenge perfectly. Your dental knowledge is stellar!" 
                          : score >= 80
                          ? "Fantastic work! You really understand dental health principles. Keep it up!"
                          : score >= 60
                          ? "Good effort! You're on the right track. Keep learning and you'll become an expert!"
                          : "Nice try! Every challenge teaches us something new. Review the lessons and try again!"
                      }
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Button
                    onClick={() => navigate('/')}
                    className="neon-button px-6"
                    variant="outline"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Academy
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    className="neon-button px-6"
                    variant="outline"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="space-bg"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          <motion.header
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={() => navigate('/')}
              className="neon-button"
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Academy
            </Button>
          </motion.header>

          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="glass-card border-0">
              <CardContent className="p-8">
                <motion.div
                  className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${currentChallenge.color} flex items-center justify-center`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  {currentChallenge.icon}
                </motion.div>

                <h1 className="text-3xl font-orbitron text-white neon-glow mb-4">
                  {currentChallenge.title}
                </h1>
                <p className="text-gray-300 font-space text-lg mb-6">
                  {currentChallenge.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="glass-card-dark p-4 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-400 font-mono">
                      {currentChallenge.questions.length}
                    </div>
                    <div className="text-gray-400 font-space text-sm">Questions</div>
                  </div>
                  <div className="glass-card-dark p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400 font-mono">
                      {formatTime(currentChallenge.timeLimit)}
                    </div>
                    <div className="text-gray-400 font-space text-sm">Time Limit</div>
                  </div>
                </div>

                {/* Dr. Rabbit Pre-Challenge Message */}
                <div className="glass-card-dark p-6 rounded-lg mb-8">
                  <DrRabbitCharacter 
                    size="w-12 h-12"
                    message="Ready for the challenge? Take your time to think through each question. Remember, learning is more important than speed!"
                  />
                </div>

                <Button
                  onClick={startChallenge}
                  className="neon-button px-8 py-3 text-lg"
                  variant="outline"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Start Challenge
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQ = currentChallenge.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / currentChallenge.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="space-bg"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header with Timer */}
        <motion.header
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-400/50">
              Question {currentQuestion + 1} / {currentChallenge.questions.length}
            </Badge>
          </div>

          <Badge 
            variant="secondary" 
            className={`${timeLeft <= 20 ? 'bg-red-500/20 text-red-400 border-red-400/50 animate-pulse' : 'bg-cyan-500/20 text-cyan-400 border-cyan-400/50'}`}
          >
            <Timer className="w-3 h-3 mr-1" />
            {formatTime(timeLeft)}
          </Badge>
        </motion.header>

        {/* Progress Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
        >
          <Progress value={progress} className="h-3 bg-black/30" />
        </motion.div>

        {/* Question */}
        <motion.div
          className="max-w-3xl mx-auto"
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="text-xl font-orbitron text-white leading-relaxed">
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {currentQ.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`p-4 rounded-lg text-left transition-all duration-200 font-space ${
                      selectedAnswers[currentQuestion] === option
                        ? 'bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400'
                        : 'bg-black/20 border border-gray-600 text-gray-300 hover:bg-white/10 hover:border-gray-400'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestion] === option
                          ? 'border-cyan-400 bg-cyan-400'
                          : 'border-gray-500'
                      }`}>
                        {selectedAnswers[currentQuestion] === option && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Navigation for non-speed challenges */}
              {challengeType !== 'speed-quiz' && (
                <div className="flex justify-end pt-6">
                  <Button
                    onClick={nextQuestion}
                    disabled={!selectedAnswers[currentQuestion]}
                    className="neon-button"
                    variant="outline"
                  >
                    {currentQuestion < currentChallenge.questions.length - 1 ? 'Next' : 'Complete'}
                    <Zap className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ChallengePage;