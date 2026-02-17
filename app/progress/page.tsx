'use client';

import { useState } from 'react';
import { useHistory } from '@/lib/hooks/use-history';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export default function ProgressPage() {
  const { weeklyComparison, completedWorkouts } = useHistory();
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  // Get unique exercises from history
  const allExercises = Array.from(
    new Set(
      completedWorkouts.flatMap(w => w.exercises.map(e => e.name))
    )
  ).sort();

  // Get exercise history data for selected exercise
  const getExerciseData = (exerciseName: string) => {
    return completedWorkouts
      .filter(w => w.exercises.some(e => e.name === exerciseName))
      .map(w => {
        const exercise = w.exercises.find(e => e.name === exerciseName)!;
        const completedSets = exercise.sets.filter(s => s.completed && s.weight && s.reps);
        const maxWeight = Math.max(...completedSets.map(s => s.weight || 0), 0);
        const totalVolume = completedSets.reduce((sum, s) => sum + (s.weight || 0) * (s.reps || 0), 0);

        return {
          date: format(new Date(w.date), 'MMM d'),
          timestamp: w.date,
          weight: maxWeight,
          volume: totalVolume
        };
      })
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-10); // Last 10 workouts
  };

  return (
    <>
      <Header title="Progress" />

      <div className="px-4 py-6 space-y-6">
        {/* Weekly Comparison */}
        <div>
          <h3 className="text-lg font-semibold mb-3">This Week vs Last Week</h3>
          
          {!weeklyComparison || weeklyComparison.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <p className="text-gray-400">Complete more workouts to see comparisons</p>
              </CardContent>
            </Card>
          ) : (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {weeklyComparison.map((comparison) => {
                const hasIncrease = comparison.volumeChange > 0;
                const hasDecrease = comparison.volumeChange < 0;
                const noChange = comparison.volumeChange === 0;

                return (
                  <Card key={comparison.exerciseName}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{comparison.exerciseName}</h4>
                        {hasIncrease && (
                          <Badge variant="success" className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            +{comparison.volumeChangePercent.toFixed(1)}%
                          </Badge>
                        )}
                        {hasDecrease && (
                          <Badge variant="danger" className="flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" />
                            {comparison.volumeChangePercent.toFixed(1)}%
                          </Badge>
                        )}
                        {noChange && (
                          <Badge variant="default" className="flex items-center gap-1">
                            <Minus className="w-3 h-3" />
                            No change
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400 mb-1">Previous</p>
                          <p className="font-semibold">
                            {comparison.previousVolume.toLocaleString()} lbs
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Current</p>
                          <p className="font-semibold">
                            {comparison.currentVolume.toLocaleString()} lbs
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Exercise Progression Charts */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Exercise Progression</h3>
          
          {/* Exercise Selector */}
          <div className="mb-4 overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 pb-2">
              {allExercises.slice(0, 10).map((exercise) => (
                <button
                  key={exercise}
                  onClick={() => setSelectedExercise(exercise)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedExercise === exercise
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {exercise}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          {selectedExercise ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{selectedExercise}</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const data = getExerciseData(selectedExercise);
                  
                  if (data.length === 0) {
                    return (
                      <div className="py-8 text-center text-gray-400">
                        No data available
                      </div>
                    );
                  }

                  return (
                    <>
                      <div className="h-48 mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis 
                              dataKey="date" 
                              stroke="#9CA3AF"
                              style={{ fontSize: '12px' }}
                            />
                            <YAxis 
                              stroke="#9CA3AF"
                              style={{ fontSize: '12px' }}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1F2937', 
                                border: '1px solid #374151',
                                borderRadius: '8px'
                              }}
                              labelStyle={{ color: '#F3F4F6' }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="weight" 
                              stroke="#3B82F6" 
                              strokeWidth={2}
                              dot={{ fill: '#3B82F6', r: 4 }}
                              name="Max Weight (lbs)"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis 
                              dataKey="date" 
                              stroke="#9CA3AF"
                              style={{ fontSize: '12px' }}
                            />
                            <YAxis 
                              stroke="#9CA3AF"
                              style={{ fontSize: '12px' }}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1F2937', 
                                border: '1px solid #374151',
                                borderRadius: '8px'
                              }}
                              labelStyle={{ color: '#F3F4F6' }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="volume" 
                              stroke="#10B981" 
                              strokeWidth={2}
                              dot={{ fill: '#10B981', r: 4 }}
                              name="Total Volume (lbs)"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <p className="text-gray-400">Select an exercise to view progression</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
