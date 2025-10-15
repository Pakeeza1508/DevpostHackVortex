import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Sparkles, Rocket, Star, Zap, Trophy, BookOpen, Play, User, Target, Timer, Award, Brain } from 'lucide-react';
import AIChatBot from './AIChatBot'; // <-- ADD THIS IMPORT

const HomePage = ({ user, lessons, onSelectLesson }) => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [showChatBot, setShowChatBot] = useState(false); // <-- ADD THIS STATE

  const handleStartLesson = (lesson) => {
    onSelectLesson(lesson);
    navigate(`/lesson/${lesson.id}`);
  };

  const handleStartChallenge = (challengeType) => {
    // Navigate to different challenge types
    navigate(`/challenge/${challengeType}`);
  };

  const backgroundImages = [
    "https://images.unsplash.com/photo-1486881809698-a59614a9ac7e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHxmdXR1cmlzdGljfGVufDB8fHx8MTc2MDE2MTc5NHww&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxhc3Ryb25hdXR8ZW58MHx8fHwxNzYwMTYxNzk5fDA&ixlib=rb-4.1.0&q=85"
  ];

  const filteredLessons = lessons.filter(lesson => lesson.level === selectedLevel);

  // Additional challenges and activities
  const dailyChallenges = [
    {
      id: 'speed-quiz',
      title: 'Lightning Quiz',
      description: 'Answer 10 questions in 60 seconds',
      icon: <Timer className="w-6 h-6" />,
      reward: '50 Points',
      difficulty: 'Medium',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'perfect-score',
      title: 'Perfect Score Challenge',
      description: 'Get 100% on any lesson quiz',
      icon: <Target className="w-6 h-6" />,
      reward: '100 Points',
      difficulty: 'Hard',
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: 'knowledge-master',
      title: 'Knowledge Master',
      description: 'Complete 3 lessons in a row',
      icon: <Brain className="w-6 h-6" />,
      reward: '75 Points',
      difficulty: 'Medium',
      color: 'from-purple-400 to-pink-500'
    }
  ];

  // Dr. Rabbit Character with fallback
  const DrRabbitCharacter = ({ size = "w-10 h-10" }) => (
    <div className={`${size} rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-2xl overflow-hidden`}>
      <div className="text-2xl">🐰</div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url(${backgroundImages[0]})`,
            filter: 'blur(2px)'
          }}
        />
        <div className="space-bg"></div>
      </div>

      {/* Floating Elements */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        >
          {i % 3 === 0 && <Sparkles className="w-4 h-4 text-cyan-400" />}
          {i % 3 === 1 && <Star className="w-3 h-3 text-purple-400" />}
          {i % 3 === 2 && <Zap className="w-4 h-4 text-pink-400" />}
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center space-x-4">
            <motion.div
              className="floating"
              whileHover={{ scale: 1.1 }}
            >
              <DrRabbitCharacter size="w-16 h-16" />
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-6xl font-orbitron holographic font-bold">
                DENTAL QUEST
              </h1>
              <p className="text-cyan-400 font-space text-lg">
                Advanced Academy for Dental Health
              </p>
            </div>
          </div>

          <Button
            onClick={() => navigate('/profile')}
            className="neon-button text-white font-space"
            variant="outline"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
        </motion.header>

        {/* Welcome Section */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Welcome Card */}
          <Card className="lg:col-span-2 glass-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <motion.div
                  className="relative"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1454789548928-9efd52dc4031?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxhc3Ryb25hdXR8ZW58MHx8fHwxNzYwMTYxNzk5fDA&ixlib=rb-4.1.0&q=85"
                    alt="Explorer"
                    className="w-20 h-20 rounded-full object-cover border-2 border-cyan-400"
                  />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-orbitron text-white neon-glow">
                    Welcome, {user?.username || 'Explorer'}!
                  </h2>
                  <p className="text-gray-300 font-space mt-2">
                    Ready to explore the advanced world of dental health? Join Dr. Rabbit on an
                    epic journey through interactive learning and discover the secrets of perfect oral hygiene!
                  </p>
                  <div className="flex items-center space-x-4 mt-4">
                    <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-400/50">
                      <Rocket className="w-3 h-3 mr-1" />
                      Advanced Cadet
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-400/50">
                      <Star className="w-3 h-3 mr-1" />
                      Level {user?.level || 1}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="glass-card border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-white font-orbitron flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                Academy Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Total Score</span>
                  <span className="text-cyan-400 font-mono">{user?.total_score || 0}</span>
                </div>
                <Progress value={(user?.total_score || 0) % 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Achievements</span>
                  <span className="text-purple-400 font-mono">{user?.achievements?.length || 0}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Current Level</span>
                  <span className="text-yellow-400 font-mono">{user?.level || 1}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Daily Challenges Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-2xl font-orbitron text-white neon-glow mb-4 flex items-center">
            <Award className="w-6 h-6 mr-3 text-yellow-400" />
            Daily Challenges
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dailyChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer"
                onClick={() => handleStartChallenge(challenge.id)}
              >
                <Card className="glass-card border-0 h-full group hover:neon-border transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <motion.div
                      className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${challenge.color} flex items-center justify-center`}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                      {challenge.icon}
                    </motion.div>
                    <h4 className="text-white font-orbitron text-sm font-semibold mb-2">
                      {challenge.title}
                    </h4>
                    <p className="text-gray-300 font-space text-xs mb-3">
                      {challenge.description}
                    </p>
                    <div className="space-y-2">
                      <Badge
                        variant="secondary"
                        className={`bg-gradient-to-r ${challenge.color} bg-opacity-20 text-white border-opacity-50`}
                      >
                        {challenge.reward}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-gray-400 border-gray-600 text-xs"
                      >
                        {challenge.difficulty}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Level Selection */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="text-2xl font-orbitron text-white neon-glow mb-4">
            Choose Your Learning Level
          </h3>
          <div className="flex space-x-4">
            {[1, 2, 3].map((level) => (
              <Button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`neon-button font-space ${
                  selectedLevel === level ? 'bg-cyan-500/30 border-cyan-400' : ''
                }`}
                variant="outline"
              >
                Level {level}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Lessons Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {filteredLessons.length > 0 ? filteredLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              className="group cursor-pointer"
              onClick={() => handleStartLesson(lesson)}
            >
              <Card className="glass-card border-0 h-full group-hover:neon-border transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border-cyan-400/50"
                    >
                      Lesson {index + 1}
                    </Badge>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                      <BookOpen className="w-5 h-5 text-purple-400" />
                    </motion.div>
                  </div>
                  <CardTitle className="text-white font-orbitron text-lg group-hover:neon-glow transition-all duration-300">
                    {lesson.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 font-space text-sm">
                    {lesson.description}
                  </p>

                  {lesson.content?.key_points && (
                    <div className="space-y-2">
                      <h4 className="text-cyan-400 font-space text-sm font-medium">
                        Key Learning Points:
                      </h4>
                      <ul className="text-gray-400 text-xs space-y-1">
                        {lesson.content.key_points.slice(0, 2).map((point, i) => (
                          <li key={i} className="flex items-center">
                            <Sparkles className="w-3 h-3 mr-2 text-cyan-400" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    className="w-full neon-button font-space group-hover:shadow-lg transition-all duration-300"
                    variant="outline"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Learning
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )) : (
            <motion.div
              className="col-span-full text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <div className="glass-card p-8 max-w-md mx-auto">
                <Rocket className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
                <h3 className="text-xl font-orbitron text-white mb-2">
                  No lessons available for Level {selectedLevel}
                </h3>
                <p className="text-gray-400 font-space">
                  Try selecting a different level or check back later for new content!
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Dr. Rabbit Floating Assistant */}
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2, type: "spring", bounce: 0.6 }}
        >
          <motion.div
            className="cursor-pointer"
            onClick={() => setShowChatBot(true)} // <-- ADD THIS ONCLICK HANDLER
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative">
              <DrRabbitCharacter size="w-16 h-16" />
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-white text-xs font-bold">?</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* AI Chat Bot Overlay */}
      <AnimatePresence>
        {showChatBot && (
          <AIChatBot
            onClose={() => setShowChatBot(false)}
            user={user}
            lessonContext={null}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;