import React, { useState, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text3D, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, Play, MessageCircle, BookOpen, Sparkles, Target, CheckCircle2, Lightbulb } from 'lucide-react';
import AIChatBot from './AIChatBot';

// 3D Tooth Component
const ToothModel = ({ position = [0, 0, 0] }) => {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh position={position}>
        <cylinderGeometry args={[0.8, 0.6, 2, 8]} />
        <MeshDistortMaterial color="#ffffff" distort={0.2} speed={2} />
      </mesh>
      {/* Tooth Crown */}
      <mesh position={[position[0], position[1] + 1.2, position[2]]}>
        <sphereGeometry args={[0.9, 8, 8]} />
        <MeshDistortMaterial color="#f8f8ff" distort={0.1} speed={1} />
      </mesh>
    </Float>
  );
};

// 3D Scene Component
const ToothScene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      <Suspense fallback={null}>
        <ToothModel position={[0, 0, 0]} />
        <ToothModel position={[-3, 0, -1]} />
        <ToothModel position={[3, 0, -1]} />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <Sphere key={i} args={[0.05]} position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
          ]}>
            <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.3} />
          </Sphere>
        ))}
      </Suspense>
      
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
};

const LessonPage = ({ lesson, user }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [showChatBot, setShowChatBot] = useState(false);
  const [completedSections, setCompletedSections] = useState(new Set());

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <BookOpen className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
          <h2 className="text-2xl font-orbitron text-white mb-4">Mission Not Found</h2>
          <Button onClick={() => navigate('/')} className="neon-button">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Base
          </Button>
        </div>
      </div>
    );
  }

  const sections = [
    {
      title: "Mission Briefing",
      icon: <Target className="w-5 h-5" />,
      content: lesson.description,
      type: "text"
    },
    {
      title: "Interactive 3D Model",
      icon: <Sparkles className="w-5 h-5" />,
      content: "Explore the 3D tooth model to understand dental anatomy",
      type: "3d"
    },
    {
      title: "Key Learning Points",
      icon: <Lightbulb className="w-5 h-5" />,
      content: lesson.content?.key_points || [],
      type: "points"
    }
  ];

  const handleSectionComplete = (sectionIndex) => {
    const newCompleted = new Set(completedSections);
    newCompleted.add(sectionIndex);
    setCompletedSections(newCompleted);
    
    const newProgress = (newCompleted.size / sections.length) * 100;
    setProgress(newProgress);
  };

  const handleStartQuiz = () => {
    navigate(`/quiz/${lesson.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="space-bg"></div>
        
        {/* Floating Elements */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
          </motion.div>
        ))}
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
              onClick={() => navigate('/')}
              className="neon-button"
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Mission Control
            </Button>
            <div>
              <h1 className="text-3xl font-orbitron text-white neon-glow">
                {lesson.title}
              </h1>
              <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-400/50">
                Level {lesson.level} Mission
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowChatBot(!showChatBot)}
              className="neon-button"
              variant="outline"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask Dr. Rabbit
            </Button>
          </div>
        </motion.header>

        {/* Progress Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-space text-sm">Mission Progress</span>
            <span className="text-cyan-400 font-mono">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3 bg-black/30" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 * index }}
              >
                <Card className={`glass-card border-0 ${completedSections.has(index) ? 'neon-border' : ''}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-white font-orbitron">
                      <div className="flex items-center space-x-2">
                        {section.icon}
                        <span>{section.title}</span>
                      </div>
                      {completedSections.has(index) && (
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {section.type === 'text' && (
                      <div className="space-y-4">
                        <p className="text-gray-300 font-space leading-relaxed">
                          {section.content}
                        </p>
                        <Button
                          onClick={() => handleSectionComplete(index)}
                          disabled={completedSections.has(index)}
                          className="neon-button"
                          variant="outline"
                        >
                          {completedSections.has(index) ? 'Complete' : 'Mark as Read'}
                        </Button>
                      </div>
                    )}

                    {section.type === '3d' && (
                      <div className="space-y-4">
                        <div className="h-64 rounded-lg overflow-hidden bg-black/30 border border-cyan-400/30">
                          <ToothScene />
                        </div>
                        <p className="text-gray-300 font-space text-sm">
                          Use your mouse to rotate and explore the 3D tooth models
                        </p>
                        <Button
                          onClick={() => handleSectionComplete(index)}
                          disabled={completedSections.has(index)}
                          className="neon-button"
                          variant="outline"
                        >
                          {completedSections.has(index) ? 'Explored' : 'Mark as Explored'}
                        </Button>
                      </div>
                    )}

                    {section.type === 'points' && (
                      <div className="space-y-4">
                        <ul className="space-y-3">
                          {section.content.map((point, i) => (
                            <motion.li
                              key={i}
                              className="flex items-start space-x-3"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * i }}
                            >
                              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">{i + 1}</span>
                              </div>
                              <p className="text-gray-300 font-space">{point}</p>
                            </motion.li>
                          ))}
                        </ul>
                        <Button
                          onClick={() => handleSectionComplete(index)}
                          disabled={completedSections.has(index)}
                          className="neon-button"
                          variant="outline"
                        >
                          {completedSections.has(index) ? 'Understood' : 'Mark as Understood'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Quiz Button */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: progress >= 100 ? 1 : 0.5, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className={`glass-card border-0 ${progress >= 100 ? 'neon-border' : ''}`}>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-orbitron text-white mb-4">
                    Ready for Mission Assessment?
                  </h3>
                  <p className="text-gray-300 font-space mb-6">
                    Test your knowledge and earn mission points!
                  </p>
                  <Button
                    onClick={handleStartQuiz}
                    disabled={progress < 100}
                    className="neon-button px-8 py-3 text-lg"
                    variant="outline"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Mission Test
                  </Button>
                  {progress < 100 && (
                    <p className="text-orange-400 font-space text-sm mt-3">
                      Complete all sections to unlock the assessment
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Dr. Rabbit Guide */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass-card border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-white font-orbitron text-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center mr-3">
                      <img
                        src="https://img.freepik.com/free-vector/cute-rabbit-waving-hand-cartoon-vector-icon-illustration-animal-nature-icon-isolated-flat-vector_138676-13891.jpg"
                        alt="Dr. Rabbit"
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.target.innerHTML = "🐰";
                          e.target.className = "text-lg";
                        }}
                      />
                    </div>
                    Dr. Rabbit Says
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="glass-card-dark p-4 rounded-lg">
                    <p className="text-cyan-300 font-space text-sm italic">
                      "Welcome to your dental mission, space cadet! Take your time to explore each section. 
                      Remember, healthy teeth are like stars - they shine brightest when they're well cared for!"
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowChatBot(true)}
                    className="w-full mt-4 neon-button"
                    variant="outline"
                    size="sm"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat with Dr. Rabbit
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mission Stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="glass-card border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white font-orbitron text-lg">
                    Mission Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-space text-sm">Sections</span>
                    <span className="text-cyan-400 font-mono">{completedSections.size}/{sections.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-space text-sm">Quiz Questions</span>
                    <span className="text-purple-400 font-mono">{lesson.quiz_questions?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-space text-sm">Difficulty</span>
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-400/50">
                      Level {lesson.level}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* AI Chat Bot */}
      <AnimatePresence>
        {showChatBot && (
          <AIChatBot
            onClose={() => setShowChatBot(false)}
            user={user}
            lessonContext={lesson}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LessonPage;