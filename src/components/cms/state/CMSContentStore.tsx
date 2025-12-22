import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { OutputData } from '@editorjs/editorjs';
import { ContentItem, ContentVersion, ContentStatus } from './types';
import { storage } from './storage';

// Default content for demo
const defaultContent: ContentItem[] = [
  {
    id: '1',
    title: 'Homepage',
    slug: 'homepage',
    type: 'website page',
    status: 'published',
    author: 'Admin',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    publishedAt: new Date('2024-01-15'),
    data: { time: Date.now(), blocks: [], version: '2.28.2' },
    tags: [],
  },
  {
    id: '2',
    title: '10 Tips for Effective Online Learning',
    slug: 'online-learning-tips',
    type: 'blog post',
    status: 'published',
    author: 'Sarah Johnson',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    publishedAt: new Date('2024-01-20'),
    data: { time: Date.now(), blocks: [], version: '2.28.2' },
    tags: ['public share'],
  },
  {
    id: '3',
    title: 'JavaScript Variables Lesson',
    slug: 'js-variables',
    type: 'lms lesson',
    status: 'draft',
    author: 'Mike Chen',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    data: { time: Date.now(), blocks: [], version: '2.28.2' },
    tags: [],
  },
  {
    id: '4',
    title: 'Weekly Newsletter Template',
    slug: 'weekly-newsletter',
    type: 'email template',
    status: 'scheduled',
    author: 'Unknown',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    scheduledAt: new Date('2024-02-01'),
    data: { time: Date.now(), blocks: [], version: '2.28.2' },
    tags: ['automation input'],
  },
  {
    id: '5',
    title: 'Course Announcement',
    slug: 'course-announcement',
    type: 'announcement',
    status: 'published',
    author: 'Unknown',
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28'),
    publishedAt: new Date('2024-01-28'),
    data: { time: Date.now(), blocks: [], version: '2.28.2' },
    tags: ['email template'],
  },
];

interface CMSContentContextType {
  content: ContentItem[];
  getContentById: (id: string) => ContentItem | undefined;
  createContent: (title?: string) => ContentItem;
  updateContent: (id: string, updates: Partial<ContentItem>) => void;
  updateContentData: (id: string, data: OutputData) => void;
  deleteContent: (id: string) => void;
  publishContent: (id: string) => void;
  unpublishContent: (id: string) => void;
  getVersions: (id: string) => ContentVersion[];
  restoreVersion: (contentId: string, versionId: string) => OutputData | null;
  saveVersion: (contentId: string, changes: string) => void;
}

const CMSContentContext = createContext<CMSContentContextType | undefined>(undefined);

export const CMSContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ContentItem[]>(() => {
    const stored = storage.getContent();
    return stored.length > 0 ? stored : defaultContent;
  });

  // Persist on change
  useEffect(() => {
    storage.saveContent(content);
  }, [content]);

  const getContentById = useCallback((id: string) => {
    return content.find((c) => c.id === id);
  }, [content]);

  const createContent = useCallback((title?: string) => {
    const newId = `content-${Date.now()}`;
    const newContent: ContentItem = {
      id: newId,
      title: title || 'Untitled Content',
      slug: `untitled-${Date.now()}`,
      type: 'article',
      status: 'draft',
      author: 'You',
      createdAt: new Date(),
      updatedAt: new Date(),
      data: { time: Date.now(), blocks: [], version: '2.28.2' },
      tags: [],
    };
    setContent((prev) => [newContent, ...prev]);
    return newContent;
  }, []);

  const updateContent = useCallback((id: string, updates: Partial<ContentItem>) => {
    setContent((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
      )
    );
  }, []);

  const updateContentData = useCallback((id: string, data: OutputData) => {
    setContent((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, data, updatedAt: new Date() } : c
      )
    );
  }, []);

  const deleteContent = useCallback((id: string) => {
    setContent((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const publishContent = useCallback((id: string) => {
    setContent((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: 'published' as ContentStatus, publishedAt: new Date(), updatedAt: new Date() }
          : c
      )
    );
  }, []);

  const unpublishContent = useCallback((id: string) => {
    setContent((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: 'draft' as ContentStatus, publishedAt: undefined, updatedAt: new Date() }
          : c
      )
    );
  }, []);

  const getVersions = useCallback((id: string): ContentVersion[] => {
    return storage.getVersions(id);
  }, []);

  const saveVersion = useCallback((contentId: string, changes: string) => {
    const item = content.find((c) => c.id === contentId);
    if (!item) return;

    const version: ContentVersion = {
      id: `v-${Date.now()}`,
      contentId,
      timestamp: new Date(),
      author: 'You',
      authorInitials: 'YO',
      changes,
      blocksChanged: item.data.blocks.length,
      data: { ...item.data },
    };
    storage.addVersion(contentId, version);
  }, [content]);

  const restoreVersion = useCallback((contentId: string, versionId: string): OutputData | null => {
    const versions = storage.getVersions(contentId);
    const version = versions.find((v) => v.id === versionId);
    if (!version) return null;

    updateContentData(contentId, version.data);
    return version.data;
  }, [updateContentData]);

  return (
    <CMSContentContext.Provider
      value={{
        content,
        getContentById,
        createContent,
        updateContent,
        updateContentData,
        deleteContent,
        publishContent,
        unpublishContent,
        getVersions,
        restoreVersion,
        saveVersion,
      }}
    >
      {children}
    </CMSContentContext.Provider>
  );
};

export const useCMSContent = () => {
  const context = useContext(CMSContentContext);
  if (!context) {
    throw new Error('useCMSContent must be used within a CMSContentProvider');
  }
  return context;
};
