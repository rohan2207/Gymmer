'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/db';
import type { Template } from '@/lib/types';
import { PPLUL_TEMPLATE } from '@/data/pplul-template';

export function useTemplates() {
  const templates = useLiveQuery(() => db.templates.toArray()) ?? [];
  const activeTemplate = useLiveQuery(() => 
    db.templates.where('isActive').equals(1).first()
  );

  const createTemplate = async (template: Omit<Template, 'id'>) => {
    return await db.templates.add({
      ...template,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  };

  const updateTemplate = async (id: number, updates: Partial<Template>) => {
    return await db.templates.update(id, {
      ...updates,
      updatedAt: Date.now()
    });
  };

  const deleteTemplate = async (id: number) => {
    return await db.templates.delete(id);
  };

  const setActiveTemplate = async (id: number) => {
    // Deactivate all templates
    const allTemplates = await db.templates.toArray();
    await Promise.all(
      allTemplates.map(t => db.templates.update(t.id!, { isActive: false }))
    );
    
    // Activate selected template
    return await db.templates.update(id, { isActive: true });
  };

  const duplicateTemplate = async (id: number) => {
    const template = await db.templates.get(id);
    if (!template) return;

    const newTemplate: Omit<Template, 'id'> = {
      ...template,
      name: `${template.name} (Copy)`,
      isActive: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    return await db.templates.add(newTemplate);
  };

  const initializeDefaultTemplate = async () => {
    const count = await db.templates.count();
    if (count === 0) {
      await db.templates.add(PPLUL_TEMPLATE);
    }
  };

  return {
    templates,
    activeTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    setActiveTemplate,
    duplicateTemplate,
    initializeDefaultTemplate
  };
}
