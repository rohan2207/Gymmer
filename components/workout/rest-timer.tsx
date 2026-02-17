'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface RestTimerProps {
  initialSeconds?: number;
  onComplete?: () => void;
  onClose?: () => void;
}

export function RestTimer({ 
  initialSeconds = 90, 
  onComplete,
  onClose 
}: RestTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            setIsActive(false);
            setShowCompleted(true);
            onComplete?.();
            // Play notification sound if available
            if (typeof window !== 'undefined' && 'vibrate' in navigator) {
              navigator.vibrate([200, 100, 200]);
            }
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, onComplete]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const progress = ((initialSeconds - seconds) / initialSeconds) * 100;

  const presets = [30, 60, 90, 120, 180];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-x-0 bottom-20 z-50 px-4"
    >
      <Card className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-blue-600/20 transition-all duration-1000 ease-linear"
          style={{ transform: `scaleX(${progress / 100})`, transformOrigin: 'left' }}
        />
        
        <CardContent className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">Rest Timer</h3>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center mb-6">
            <motion.div
              key={seconds}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-5xl font-bold text-white mb-2"
            >
              {formatTime(seconds)}
            </motion.div>
            
            <AnimatePresence>
              {showCompleted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-400 font-medium"
                >
                  Rest complete! 💪
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsActive(!isActive)}
              className="flex-1"
            >
              {isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isActive ? 'Pause' : 'Resume'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSeconds(initialSeconds);
                setIsActive(true);
                setShowCompleted(false);
              }}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {presets.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setSeconds(preset);
                  setIsActive(true);
                  setShowCompleted(false);
                }}
                className="flex-1 py-2 text-sm rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors touch-manipulation"
              >
                {preset}s
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
