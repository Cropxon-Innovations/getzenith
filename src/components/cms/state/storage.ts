import { ContentItem, ContentVersion } from './types';

const CONTENT_KEY = 'zenith-cms-content';
const VERSIONS_KEY = 'zenith-cms-versions';

export const storage = {
  // Content
  getContent: (): ContentItem[] => {
    try {
      const data = localStorage.getItem(CONTENT_KEY);
      if (!data) return [];
      const items = JSON.parse(data);
      return items.map((item: ContentItem) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
        publishedAt: item.publishedAt ? new Date(item.publishedAt) : undefined,
        scheduledAt: item.scheduledAt ? new Date(item.scheduledAt) : undefined,
      }));
    } catch {
      return [];
    }
  },

  saveContent: (content: ContentItem[]): void => {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
  },

  getContentById: (id: string): ContentItem | undefined => {
    const content = storage.getContent();
    return content.find((c) => c.id === id);
  },

  // Versions
  getVersions: (contentId: string): ContentVersion[] => {
    try {
      const data = localStorage.getItem(`${VERSIONS_KEY}-${contentId}`);
      if (!data) return [];
      const versions = JSON.parse(data);
      return versions.map((v: ContentVersion) => ({
        ...v,
        timestamp: new Date(v.timestamp),
      }));
    } catch {
      return [];
    }
  },

  saveVersions: (contentId: string, versions: ContentVersion[]): void => {
    localStorage.setItem(`${VERSIONS_KEY}-${contentId}`, JSON.stringify(versions));
  },

  addVersion: (contentId: string, version: ContentVersion): void => {
    const versions = storage.getVersions(contentId);
    versions.unshift(version);
    // Keep only last 50 versions
    storage.saveVersions(contentId, versions.slice(0, 50));
  },
};
