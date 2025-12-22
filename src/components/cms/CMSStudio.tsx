import { useState, useCallback } from 'react';
import { CMSContentList } from './CMSContentList';
import { CMSEditorView } from './CMSEditorView';
import { CMSContentProvider, useCMSContent } from './state/CMSContentStore';
import { CollaborationProvider } from './collab/CollaborationProvider';
import { CursorOverlay } from './collab/CursorOverlay';

const CMSStudioInner = () => {
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const { createContent } = useCMSContent();

  const handleSelectContent = useCallback((id: string) => {
    setSelectedContentId(id);
    setView('editor');
  }, []);

  const handleNewContent = useCallback(() => {
    const newContent = createContent();
    setSelectedContentId(newContent.id);
    setView('editor');
  }, [createContent]);

  const handleBack = useCallback(() => {
    setView('list');
    setSelectedContentId(null);
  }, []);

  if (view === 'editor' && selectedContentId) {
    return (
      <CollaborationProvider contentId={selectedContentId}>
        <CursorOverlay />
        <CMSEditorView contentId={selectedContentId} onBack={handleBack} />
      </CollaborationProvider>
    );
  }

  return <CMSContentList onSelectContent={handleSelectContent} onNewContent={handleNewContent} />;
};

export const CMSStudio = () => {
  return (
    <CMSContentProvider>
      <CMSStudioInner />
    </CMSContentProvider>
  );
};
