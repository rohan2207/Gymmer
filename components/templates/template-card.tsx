'use client';

import { Template } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface TemplateCardProps {
  template: Template;
  onSelect?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export function TemplateCard({ 
  template, 
  onSelect, 
  onEdit, 
  onDuplicate, 
  onDelete 
}: TemplateCardProps) {
  const totalExercises = template.days.reduce(
    (sum, day) => sum + day.exercises.length, 
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card 
        className="cursor-pointer hover:border-gray-700 transition-colors"
        onClick={onSelect}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-semibold text-white truncate">
                  {template.name}
                </h3>
                {template.isActive && (
                  <Badge variant="success" className="flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Active
                  </Badge>
                )}
              </div>
              
              {template.description && (
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                  {template.description}
                </p>
              )}
              
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{template.days.length} days</span>
                <span>•</span>
                <span>{totalExercises} exercises</span>
              </div>
            </div>
            
            <button 
              className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Show menu
              }}
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
