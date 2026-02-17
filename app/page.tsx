'use client';

import { useEffect, useState } from 'react';
import { useTemplates } from '@/lib/hooks/use-templates';
import { useWorkouts } from '@/lib/hooks/use-workouts';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ExerciseCard } from '@/components/workout/exercise-card';
import { RestTimer } from '@/components/workout/rest-timer';
import { Plus, Dumbbell, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkoutSet } from '@/lib/types';
import { calculateWorkoutCompletion } from '@/lib/utils/calculations';

export default function TodayPage() {
  const { activeTemplate, initializeDefaultTemplate } = useTemplates();
  const { getTodaysWorkout, createWorkout, updateSet, completeWorkout } = useWorkouts();
  const todaysWorkout = getTodaysWorkout;
  
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set());
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeDefaultTemplate().then(() => setIsInitialized(true));
  }, []);

  useEffect(() => {
    if (todaysWorkout?.exercises) {
      const firstIncomplete = todaysWorkout.exercises.findIndex(ex => !ex.isCompleted);
      if (firstIncomplete >= 0) {
        setCurrentExerciseIndex(firstIncomplete);
        setExpandedExercises(new Set([todaysWorkout.exercises[firstIncomplete].id]));
      }
    }
  }, [todaysWorkout?.id]);

  const handleStartWorkout = async (dayName: string) => {
    if (!activeTemplate) return;
    await createWorkout(activeTemplate, dayName);
  };

  const handleUpdateSet = async (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => {
    if (!todaysWorkout) return;
    await updateSet(todaysWorkout.id!, exerciseId, setId, updates);
  };

  const handleExerciseComplete = (exerciseId: string) => {
    setShowRestTimer(true);
    
    if (todaysWorkout) {
      const nextIndex = todaysWorkout.exercises.findIndex((ex, idx) => 
        idx > currentExerciseIndex && !ex.isCompleted
      );
      
      if (nextIndex >= 0) {
        setTimeout(() => {
          setCurrentExerciseIndex(nextIndex);
          setExpandedExercises(new Set([todaysWorkout.exercises[nextIndex].id]));
        }, 500);
      }
    }
  };

  const handleCompleteWorkout = async () => {
    if (!todaysWorkout) return;
    await completeWorkout(todaysWorkout.id!);
  };

  const toggleExpand = (exerciseId: string) => {
    setExpandedExercises(prev => {
      const next = new Set(prev);
      if (next.has(exerciseId)) {
        next.delete(exerciseId);
      } else {
        next.add(exerciseId);
      }
      return next;
    });
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Dumbbell className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-pulse" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!activeTemplate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <Dumbbell className="w-16 h-16 mb-4 text-gray-600" />
        <h2 className="text-xl font-semibold mb-2">No Active Template</h2>
        <p className="text-gray-400 text-center mb-6">
          Select a workout template to get started
        </p>
        <Button onClick={() => window.location.href = '/templates'}>
          Go to Templates
        </Button>
      </div>
    );
  }

  if (!todaysWorkout) {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    
    return (
      <>
        <Header title="Today's Workout" />
        <div className="px-4 py-6">
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <Dumbbell className="w-12 h-12 mx-auto mb-3 text-blue-500" />
              <h2 className="text-xl font-semibold mb-2">Ready to train?</h2>
              <p className="text-gray-400 mb-1">{today}</p>
              <p className="text-sm text-gray-500 mb-6">{activeTemplate.name}</p>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-400 px-1">Choose Today's Workout</h3>
            {activeTemplate.days.map((day) => (
              <Card 
                key={day.dayName}
                className="cursor-pointer hover:border-gray-700 transition-colors"
                onClick={() => handleStartWorkout(day.dayName)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold mb-1">{day.dayName}</h4>
                      <p className="text-sm text-gray-400">{day.exercises.length} exercises</p>
                    </div>
                    <Plus className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </>
    );
  }

  const completion = calculateWorkoutCompletion(todaysWorkout);
  const isComplete = completion === 100;

  return (
    <>
      <Header 
        title={todaysWorkout.dayName}
        action={
          isComplete ? (
            <Button size="sm" onClick={handleCompleteWorkout}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Finish
            </Button>
          ) : (
            <span className="text-sm text-gray-400">{completion}%</span>
          )
        }
      />

      <div className="px-4 py-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {todaysWorkout.exercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onUpdateSet={(setId, updates) => handleUpdateSet(exercise.id, setId, updates)}
              onComplete={() => handleExerciseComplete(exercise.id)}
              isExpanded={expandedExercises.has(exercise.id)}
              onToggleExpand={() => toggleExpand(exercise.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showRestTimer && (
          <RestTimer
            initialSeconds={90}
            onClose={() => setShowRestTimer(false)}
            onComplete={() => setShowRestTimer(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
