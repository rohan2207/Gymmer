'use client';

import { useState } from 'react';
import { WorkoutExercise, WorkoutSet } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  onUpdateSet: (setId: string, updates: Partial<WorkoutSet>) => void;
  onComplete: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export function ExerciseCard({ 
  exercise, 
  onUpdateSet, 
  onComplete,
  isExpanded = true,
  onToggleExpand
}: ExerciseCardProps) {
  const [notes, setNotes] = useState(exercise.notes || '');
  
  const completedSets = exercise.sets.filter(s => s.completed).length;
  const totalSets = exercise.sets.length;
  const allCompleted = completedSets === totalSets;

  const handleSetComplete = (set: WorkoutSet) => {
    if (!set.weight || !set.reps) {
      alert('Please enter weight and reps');
      return;
    }
    
    onUpdateSet(set.id, { completed: !set.completed });
    
    if (!set.completed && completedSets + 1 === totalSets) {
      setTimeout(() => onComplete(), 300);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className={cn(
        'transition-colors',
        allCompleted && 'border-green-700/50 bg-green-950/20'
      )}>
        <CardHeader 
          className="cursor-pointer touch-manipulation"
          onClick={onToggleExpand}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-base">{exercise.name}</CardTitle>
                {allCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-5 h-5 text-green-400" />
                  </motion.div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>{completedSets}/{totalSets} sets</span>
                {exercise.sets.some(s => s.isPersonalRecord) && (
                  <Badge variant="warning" className="flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    PR
                  </Badge>
                )}
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="space-y-3">
                {/* Set Headers */}
                <div className="grid grid-cols-[40px_1fr_1fr_50px] gap-2 text-xs font-medium text-gray-400 px-2">
                  <span>Set</span>
                  <span>Weight</span>
                  <span>Reps</span>
                  <span></span>
                </div>

                {/* Sets */}
                {exercise.sets.map((set) => (
                  <div 
                    key={set.id}
                    className={cn(
                      'grid grid-cols-[40px_1fr_1fr_50px] gap-2 items-center',
                      'p-2 rounded-lg transition-colors',
                      set.completed ? 'bg-green-950/30' : 'bg-gray-800/50'
                    )}
                  >
                    <span className="text-sm font-medium text-gray-300">
                      {set.setNumber}
                    </span>
                    
                    <Input
                      type="number"
                      inputMode="decimal"
                      placeholder="lbs"
                      value={set.weight ?? ''}
                      onChange={(e) => onUpdateSet(set.id, { 
                        weight: e.target.value ? parseFloat(e.target.value) : null 
                      })}
                      disabled={set.completed}
                      className="h-10 text-center"
                    />
                    
                    <Input
                      type="number"
                      inputMode="numeric"
                      placeholder="reps"
                      value={set.reps ?? ''}
                      onChange={(e) => onUpdateSet(set.id, { 
                        reps: e.target.value ? parseInt(e.target.value) : null 
                      })}
                      disabled={set.completed}
                      className="h-10 text-center"
                    />
                    
                    <button
                      onClick={() => handleSetComplete(set)}
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        'transition-colors touch-manipulation',
                        set.completed 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      )}
                    >
                      {set.completed && <Check className="w-5 h-5" />}
                    </button>
                  </div>
                ))}

                {/* Notes */}
                <Input
                  placeholder="Notes (form, fatigue, etc.)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2"
                />
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
