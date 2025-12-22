import { useState, useCallback } from 'react';
import { CMSContentList } from './CMSContentList';
import { CMSEditorView } from './CMSEditorView';

export const CMSStudio = () => {
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);

  const handleSelectContent = useCallback((id: string) => {
    setSelectedContentId(id);
    setView('editor');
  }, []);

  const handleNewContent = useCallback(() => {
    const newId = `new-${Date.now()}`;
    setSelectedContentId(newId);
    setView('editor');
  }, []);

  const handleBack = useCallback(() => {
    setView('list');
    setSelectedContentId(null);
  }, []);

  if (view === 'editor' && selectedContentId) {
    return <CMSEditorView contentId={selectedContentId} onBack={handleBack} />;
  }

  return <CMSContentList onSelectContent={handleSelectContent} onNewContent={handleNewContent} />;
};
