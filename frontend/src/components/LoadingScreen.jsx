import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing Dental Quest...");

  const loadingStages = [
    "Initializing Dental Quest...",
    "Preparing 3D Tooth Models...",
    "Loading AI Tutor Dr. Rabbit...",
    "Calibrating Space Equipment...",
    "Almost Ready for Launch!"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        
        const newProgress = prev + Math.random() * 15 + 5;
        const stage = Math.floor((newProgress / 100) * loadingStages.length);
        if (stage < loadingStages.length) {
          setLoadingText(loadingStages[stage]);
        }
        
        return Math.min(newProgress, 100);
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="space-bg"></div>
        
        {/* Floating Stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Loading Content */}
      <motion.div
        className="relative z-10 text-center space-y-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Logo/Title */}
        <motion.div
          className="space-y-4"
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <h1 className="text-6xl md:text-8xl font-orbitron holographic font-bold">
            DENTAL
          </h1>
          <h1 className="text-6xl md:text-8xl font-orbitron neon-glow text-cyan-400 font-bold">
            QUEST
          </h1>
          <p className="text-xl md:text-2xl font-space text-white/80 mt-4">
            AI-Powered Dental Education Platform
          </p>
        </motion.div>

        {/* Rabbit Mascot Preview */}
        <motion.div
          className="w-32 h-32 mx-auto mb-8 relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
            <img
              src="https://img.freepik.com/free-vector/cute-rabbit-waving-hand-cartoon-vector-icon-illustration-animal-nature-icon-isolated-flat-vector_138676-13891.jpg"
              alt="Dr. Rabbit"
              className="w-20 h-20 object-contain"
              onError={(e) => {
                e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzAiIGZpbGw9IndoaXRlIi8+CjxjaXJjbGUgY3g9IjMwIiBjeT0iMzUiIHI9IjMiIGZpbGw9ImJsYWNrIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjMiIGZpbGw9ImJsYWNrIi8+CjxwYXRoIGQ9Ik0zNSA0NUw0MCA1MEw0NSA0NSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==";
              }}
            />
          </div>
          
          {/* Astronaut Helmet Effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-cyan-300/40"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Loading Progress */}
        <div className="space-y-6 w-80 mx-auto">
          <motion.p 
            className="text-white font-space text-lg"
            key={loadingText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {loadingText}
          </motion.p>
          
          {/* Progress Bar */}
          <div className="relative">
            <div className="h-3 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm border border-cyan-500/30">
              <motion.div
                className="h-full progress-bar"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.3 }}
              />
            </div>
            
            {/* Progress Percentage */}
            <motion.div
              className="absolute -top-8 text-cyan-400 font-mono text-sm"
              style={{ left: `${Math.max(5, Math.min(95, progress))}%` }}
              animate={{ x: "-50%" }}
            >
              {Math.round(progress)}%
            </motion.div>
          </div>
        </div>

        {/* Loading Spinner */}
        <motion.div
          className="space-spinner mx-auto"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />

        {/* Bottom Text */}
        <motion.div
          className="pt-8"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-white/60 font-space text-sm">
            Powered by Advanced AI • Secure • Educational
          </p>
        </motion.div>
      </motion.div>

      {/* Particle Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-50, window.innerHeight + 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;