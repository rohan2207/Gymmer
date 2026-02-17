'use client';

import { useState } from 'react';
import { useHistory } from '@/lib/hooks/use-history';
import { Header } from '@/components/layout/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Calendar, TrendingUp, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { calculateWorkoutVolume } from '@/lib/utils/calculations';

export default function HistoryPage() {
  const { completedWorkouts, personalRecords } = useHistory();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'week' | 'month'>('all');

  const filteredWorkouts = completedWorkouts.filter(workout => {
    if (selectedFilter === 'all') return true;
    
    const workoutDate = new Date(workout.date);
    const now = new Date();
    
    if (selectedFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return workoutDate >= weekAgo;
    }
    
    if (selectedFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return workoutDate >= monthAgo;
    }
    
    return true;
  });

  return (
    <>
      <Header title="History" />

      <div className="px-4 py-6">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
          {(['all', 'week', 'month'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                selectedFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {filter === 'all' ? 'All Time' : filter === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>

        {/* Recent PRs */}
        {personalRecords.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 mb-3 px-1">Recent PRs 🔥</h3>
            <div className="space-y-2">
              {personalRecords.slice(0, 3).map((pr) => (
                <Card key={pr.id} className="bg-gradient-to-r from-yellow-900/20 to-transparent border-yellow-700/30">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <div>
                          <p className="font-medium text-sm">{pr.exerciseName}</p>
                          <p className="text-xs text-gray-400">
                            {format(new Date(pr.date), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{pr.weight} lbs × {pr.reps}</p>
                        <p className="text-xs text-gray-400">Est. 1RM: {pr.oneRepMax} lbs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Workout History */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3 px-1">Workouts</h3>
          
          {filteredWorkouts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Dumbbell className="w-16 h-16 mb-4 text-gray-600" />
              <h2 className="text-xl font-semibold mb-2">No workouts yet</h2>
              <p className="text-gray-400 text-center">
                Complete your first workout to see it here
              </p>
            </div>
          ) : (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {filteredWorkouts.map((workout) => {
                const volume = calculateWorkoutVolume(workout);
                const duration = workout.duration 
                  ? `${Math.floor(workout.duration / 60)}m` 
                  : null;

                return (
                  <Card key={workout.id} className="hover:border-gray-700 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold mb-1">{workout.dayName}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(workout.date), 'MMM d, yyyy')}</span>
                            {duration && (
                              <>
                                <span>•</span>
                                <span>{duration}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge variant="default">{workout.exercises.length} exercises</Badge>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-400">Total Volume:</span>
                        <span className="font-semibold text-blue-400">
                          {volume.toLocaleString()} lbs
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
