import { OutputData } from '@editorjs/editorjs';

export type ContentStatus = 'draft' | 'published' | 'scheduled';

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: ContentStatus;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  scheduledAt?: Date;
  data: OutputData;
  tags: string[];
}

export interface ContentVersion {
  id: string;
  contentId: string;
  timestamp: Date;
  author: string;
  authorInitials: string;
  changes: string;
  blocksChanged: number;
  data: OutputData;
}

export type UserRole = 'tenant_admin' | 'editor' | 'mentor' | 'viewer';
export type PlanTier = 'free' | 'pro' | 'enterprise';

export interface CollaboratorCursor {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  lastActive: Date;
}
