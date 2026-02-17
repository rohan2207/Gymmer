'use client';

import { useState } from 'react';
import { useHistory } from '@/lib/hooks/use-history';
import { Header } from '@/components/layout/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Flame, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';
import { cn } from '@/lib/utils/cn';

const DAY_COLORS: Record<string, string> = {
  'Push': 'bg-red-600',
  'Pull': 'bg-blue-600',
  'Legs': 'bg-yellow-600',
  'Upper': 'bg-purple-600',
  'Lower': 'bg-green-600'
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const monthWorkouts = useHistory().getMonthWorkouts(
    currentMonth.getFullYear(),
    currentMonth.getMonth()
  );
  const { getCurrentStreak } = useHistory();
  const currentStreak = getCurrentStreak ?? 0;

  const workouts = monthWorkouts ?? [];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day of week for first day (0 = Sunday)
  const firstDayOfWeek = monthStart.getDay();

  // Pad the beginning
  const paddingDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const getWorkoutForDay = (day: Date) => {
    return workouts.find(w => isSameDay(new Date(w.date), day));
  };

  const getWorkoutColor = (dayName: string) => {
    const type = dayName.split(' - ')[1]?.split(' ')[0] || dayName.split(' ')[0];
    return DAY_COLORS[type] || 'bg-gray-600';
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <>
      <Header title="Calendar" />

      <div className="px-4 py-6">
        {/* Stats Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="text-2xl font-bold">{currentStreak}</span>
                </div>
                <p className="text-sm text-gray-400">Day Streak</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CalendarIcon className="w-5 h-5 text-blue-500" />
                  <span className="text-2xl font-bold">{workouts.length}</span>
                </div>
                <p className="text-sm text-gray-400">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="p-2 text-gray-400 hover:text-white transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <motion.h2 
            key={currentMonth.toISOString()}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-semibold"
          >
            {format(currentMonth, 'MMMM yyyy')}
          </motion.h2>
          
          <button
            onClick={nextMonth}
            className="p-2 text-gray-400 hover:text-white transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMonth.toISOString()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-7 gap-2"
              >
                {/* Padding days */}
                {paddingDays.map(i => (
                  <div key={`padding-${i}`} className="aspect-square" />
                ))}

                {/* Actual days */}
                {daysInMonth.map(day => {
                  const workout = getWorkoutForDay(day);
                  const isToday = isSameDay(day, new Date());
                  const hasWorkout = !!workout;

                  return (
                    <motion.div
                      key={day.toISOString()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        'aspect-square rounded-lg flex items-center justify-center relative',
                        'transition-colors cursor-pointer touch-manipulation',
                        isToday && 'ring-2 ring-blue-500',
                        hasWorkout ? 'bg-gray-800' : 'bg-gray-900',
                        !hasWorkout && 'hover:bg-gray-800'
                      )}
                    >
                      <span className={cn(
                        'text-sm font-medium',
                        isToday ? 'text-blue-400' : 'text-gray-300'
                      )}>
                        {format(day, 'd')}
                      </span>
                      
                      {hasWorkout && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={cn(
                            'absolute bottom-1 left-1/2 -translate-x-1/2',
                            'w-1.5 h-1.5 rounded-full',
                            getWorkoutColor(workout.dayName)
                          )}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="mt-4">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-3">Workout Types</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(DAY_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className={cn('w-3 h-3 rounded-full', color)} />
                  <span className="text-gray-300">{type}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Workouts */}
        {workouts.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-400 mb-3 px-1">Recent Workouts</h3>
            <div className="space-y-2">
              {workouts.slice(0, 5).map(workout => (
                <Card key={workout.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{workout.dayName}</p>
                        <p className="text-xs text-gray-400">
                          {format(new Date(workout.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Badge variant="default">{workout.exercises.length} exercises</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
