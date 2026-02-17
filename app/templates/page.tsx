'use client';

import { useEffect } from 'react';
import { useTemplates } from '@/lib/hooks/use-templates';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { TemplateCard } from '@/components/templates/template-card';
import { Plus, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TemplatesPage() {
  const { templates, initializeDefaultTemplate, setActiveTemplate } = useTemplates();

  useEffect(() => {
    initializeDefaultTemplate();
  }, []);

  const handleSelectTemplate = async (templateId: number) => {
    await setActiveTemplate(templateId);
  };

  return (
    <>
      <Header 
        title="Templates"
        action={
          <Button size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            New
          </Button>
        }
      />

      <div className="px-4 py-6">
        {templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Dumbbell className="w-16 h-16 mb-4 text-gray-600" />
            <h2 className="text-xl font-semibold mb-2">No Templates</h2>
            <p className="text-gray-400 text-center mb-6">
              Create your first workout template
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>
        ) : (
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={() => handleSelectTemplate(template.id!)}
              />
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}
