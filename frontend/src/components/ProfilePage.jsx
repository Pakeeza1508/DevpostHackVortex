import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  ArrowLeft,
  User,
  Trophy,
  Star,
  Target,
  Calendar,
  Zap,
  Award,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// const BACKEND_URL = process.env.NODE_ENV === 'production' ? '' : process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProfilePage = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    averageScore: 0,
    totalPoints: 0,
  });

  if (!user) {
    // You can show a loading spinner or a message here
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white">Loading user profile...</div>
      </div>
    );
  }

  useEffect(() => {
    if (user) {
      fetchUserProgress();
      generateAchievements();
    }
  }, [user]);

  const fetchUserProgress = async () => {
    try {
      const response = await axios.get(`${API}/users/${user.id}/progress`);
      setUserProgress(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error("Error fetching user progress:", error);
    }
  };

  const calculateStats = (progress) => {
    const completed = progress.filter((p) => p.completed);
    const totalScore = completed.reduce((sum, p) => sum + (p.score || 0), 0);

    setStats({
      totalLessons: 10, // Estimated total lessons
      completedLessons: completed.length,
      averageScore:
        completed.length > 0 ? Math.round(totalScore / completed.length) : 0,
      totalPoints: user.total_score || 0,
    });
  };

  const generateAchievements = () => {
    const userAchievements = [];

    // Based on total score
    if (user.total_score >= 500) {
      userAchievements.push({
        id: "master",
        title: "Dental Master",
        description: "Achieved 500+ total points",
        icon: "🏆",
        color: "from-yellow-400 to-orange-500",
        unlocked: true,
      });
    }

    if (user.total_score >= 200) {
      userAchievements.push({
        id: "expert",
        title: "Space Dental Expert",
        description: "Achieved 200+ total points",
        icon: "⭐",
        color: "from-purple-400 to-pink-500",
        unlocked: true,
      });
    }

    if (user.total_score >= 50) {
      userAchievements.push({
        id: "explorer",
        title: "Cosmic Explorer",
        description: "Achieved 50+ total points",
        icon: "🚀",
        color: "from-cyan-400 to-blue-500",
        unlocked: true,
      });
    }

    // Add locked achievements for motivation
    if (user.total_score < 1000) {
      userAchievements.push({
        id: "legend",
        title: "Dental Legend",
        description: "Achieve 1000+ total points",
        icon: "👑",
        color: "from-gray-400 to-gray-600",
        unlocked: false,
        requirement: 1000,
      });
    }

    setAchievements(userAchievements);
  };

  const getLevelProgress = () => {
    if (!user) return 0;
    const currentLevelBase = (user.level - 1) * 100;
    const nextLevelRequirement = user.level * 100;
    const progress =
      ((user.total_score - currentLevelBase) /
        (nextLevelRequirement - currentLevelBase)) *
      100;
    return Math.max(0, Math.min(100, progress));
  };

  const getNextLevelPoints = () => {
    const nextLevelRequirement = user.level * 100;
    return Math.max(0, nextLevelRequirement - user.total_score);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="space-bg"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <motion.header
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate("/")}
              className="neon-button"
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Mission Control
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-orbitron text-white neon-glow">
                Space Cadet Profile
              </h1>
              <p className="text-cyan-400 font-space">
                Your Dental Quest Journey
              </p>
            </div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* User Info Card */}
            <Card className="glass-card border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-6">
                  <motion.div
                    className="relative"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-2xl">
                      <img
                        src="https://images.unsplash.com/photo-1454789548928-9efd52dc4031?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxhc3Ryb25hdXR8ZW58MHx8fHwxNzYwMTYxNzk5fDA&ixlib=rb-4.1.0&q=85"
                        alt="Space Explorer"
                        className="w-20 h-20 rounded-full object-cover border-2 border-cyan-400"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center border-2 border-white">
                      <span className="text-white font-bold text-xs">
                        {user.level}
                      </span>
                    </div>
                  </motion.div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-orbitron text-white neon-glow mb-2">
                      {user.username}
                    </h2>
                    <p className="text-gray-300 font-space mb-4">
                      {user.email}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="glass-card-dark p-3 rounded-lg">
                        <div className="text-2xl font-bold text-cyan-400 font-mono">
                          {stats.totalPoints}
                        </div>
                        <div className="text-gray-400 font-space text-sm">
                          Total Points
                        </div>
                      </div>
                      <div className="glass-card-dark p-3 rounded-lg">
                        <div className="text-2xl font-bold text-purple-400 font-mono">
                          {stats.completedLessons}
                        </div>
                        <div className="text-gray-400 font-space text-sm">
                          Missions Complete
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Level Progress */}
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-white font-orbitron flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                  Level Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-white font-space text-lg">
                        Level {user.level}
                      </span>
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-cyan-500/20 text-cyan-400 border-cyan-400/50"
                      >
                        Space Cadet
                      </Badge>
                    </div>
                    <span className="text-gray-400 font-space text-sm">
                      {getNextLevelPoints()} points to Level {user.level + 1}
                    </span>
                  </div>
                  <Progress
                    value={getLevelProgress()}
                    className="h-4 bg-black/30"
                  />
                  <div className="flex justify-between text-sm text-gray-400 font-mono">
                    <span>{(user.level - 1) * 100}</span>
                    <span>{user.level * 100}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-white font-orbitron flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-purple-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userProgress.length > 0 ? (
                    userProgress.slice(0, 5).map((progress, index) => (
                      <motion.div
                        key={progress.id}
                        className="flex items-center justify-between p-3 glass-card-dark rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              progress.completed
                                ? "bg-green-500/20"
                                : "bg-orange-500/20"
                            }`}
                          >
                            {progress.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                              <Target className="w-4 h-4 text-orange-400" />
                            )}
                          </div>
                          <div>
                            <div className="text-white font-space text-sm">
                              Lesson: {progress.lesson_id.slice(0, 8)}...
                            </div>
                            <div className="text-gray-400 font-space text-xs">
                              {progress.completed ? "Completed" : "In Progress"}
                            </div>
                          </div>
                        </div>
                        {progress.score && (
                          <Badge
                            variant="secondary"
                            className={`${
                              progress.score >= 90
                                ? "bg-green-500/20 text-green-400 border-green-400/50"
                                : progress.score >= 70
                                ? "bg-yellow-500/20 text-yellow-400 border-yellow-400/50"
                                : "bg-red-500/20 text-red-400 border-red-400/50"
                            }`}
                          >
                            {progress.score}%
                          </Badge>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 mx-auto text-gray-500 mb-3" />
                      <p className="text-gray-400 font-space">
                        No missions completed yet!
                      </p>
                      <Button
                        onClick={() => navigate("/")}
                        className="neon-button mt-4"
                        variant="outline"
                        size="sm"
                      >
                        Start Your First Mission
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Stats Overview */}
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-white font-orbitron flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                  Mission Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-space text-sm">
                    Average Score
                  </span>
                  <span className="text-cyan-400 font-mono font-bold">
                    {stats.averageScore}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-space text-sm">
                    Completion Rate
                  </span>
                  <span className="text-purple-400 font-mono font-bold">
                    {stats.totalLessons > 0
                      ? Math.round(
                          (stats.completedLessons / stats.totalLessons) * 100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-space text-sm">
                    Missions Left
                  </span>
                  <span className="text-orange-400 font-mono font-bold">
                    {stats.totalLessons - stats.completedLessons}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-space text-sm">
                    Current Rank
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border-cyan-400/50"
                  >
                    Space Cadet
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-white font-orbitron flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-400" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      className={`p-4 rounded-lg border transition-all ${
                        achievement.unlocked
                          ? "glass-card-dark border-yellow-400/50"
                          : "bg-black/20 border-gray-600"
                      }`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`text-2xl ${
                            achievement.unlocked ? "" : "grayscale"
                          }`}
                        >
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h4
                            className={`font-orbitron font-semibold ${
                              achievement.unlocked
                                ? "text-yellow-400"
                                : "text-gray-500"
                            }`}
                          >
                            {achievement.title}
                          </h4>
                          <p
                            className={`text-xs font-space ${
                              achievement.unlocked
                                ? "text-gray-300"
                                : "text-gray-600"
                            }`}
                          >
                            {achievement.description}
                          </p>
                          {!achievement.unlocked && achievement.requirement && (
                            <div className="mt-2">
                              <Progress
                                value={
                                  (user.total_score / achievement.requirement) *
                                  100
                                }
                                className="h-2 bg-black/30"
                              />
                              <p className="text-xs text-gray-500 mt-1 font-mono">
                                {user.total_score}/{achievement.requirement}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dr. Rabbit's Message */}
            <Card className="glass-card border-0">
              <CardContent className="p-6">
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
                      Dr. Rabbit's Message
                    </h4>
                    <div className="glass-card-dark p-3 rounded-lg">
                      <p className="text-cyan-300 font-space text-sm italic">
                        {stats.completedLessons === 0
                          ? "Welcome to the Dental Quest Academy! I'm excited to be your guide on this journey to stellar oral health. Ready for your first mission?"
                          : stats.averageScore >= 80
                          ? "Exceptional work, space cadet! Your commitment to dental health is truly out of this world. Keep up the fantastic progress!"
                          : "Great progress on your dental journey! Remember, every astronaut learns through practice. Keep exploring and your skills will shine brighter than the stars!"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
