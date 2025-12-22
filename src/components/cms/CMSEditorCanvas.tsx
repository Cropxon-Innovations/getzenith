import { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { motion } from 'framer-motion';
import EditorJS, { OutputData } from '@editorjs/editorjs';
// @ts-ignore
import Header from '@editorjs/header';
// @ts-ignore
import List from '@editorjs/list';
// @ts-ignore
import Quote from '@editorjs/quote';
// @ts-ignore
import Delimiter from '@editorjs/delimiter';
// @ts-ignore
import Code from '@editorjs/code';
// @ts-ignore
import Table from '@editorjs/table';
// @ts-ignore
import ImageTool from '@editorjs/image';
// @ts-ignore
import Embed from '@editorjs/embed';

import HeroBlock from './editor-blocks/HeroBlock';
import CTABlock from './editor-blocks/CTABlock';
import FeatureGridBlock from './editor-blocks/FeatureGridBlock';
import QuizBlock from './editor-blocks/QuizBlock';
import LessonContentBlock from './editor-blocks/LessonContentBlock';
import TestimonialBlock from './editor-blocks/TestimonialBlock';
import { Plus } from 'lucide-react';

interface CMSEditorCanvasProps {
  contentId: string | null;
  onDataChange?: (data: OutputData) => void;
  onRequestAddBlock?: () => void;
}

export interface InsertResult {
  ok: boolean;
  reason?: 'EDITOR_NOT_READY' | 'UNKNOWN_BLOCK' | 'INSERT_FAILED';
  error?: string;
}

export interface CMSEditorCanvasHandle {
  insertBlock: (blockType: string, data?: Record<string, unknown>) => Promise<InsertResult>;
  getEditor: () => EditorJS | null;
  isReady: () => boolean;
}

const getDefaultBlockData = (blockType: string): Record<string, unknown> => {
  switch (blockType) {
    case 'header':
      return { text: 'New Heading', level: 2 };
    case 'paragraph':
      return { text: 'Start typing...' };
    case 'list':
      return { style: 'unordered', items: ['Item 1', 'Item 2'] };
    case 'quote':
      return { text: 'Enter your quote here', caption: 'Author' };
    case 'delimiter':
      return {};
    case 'code':
      return { code: '// Your code here' };
    case 'table':
      return { content: [['', ''], ['', '']] };
    case 'hero':
      return {
        title: 'Hero Title',
        subtitle: 'A compelling subtitle that captures attention',
        ctaText: 'Get Started',
        ctaUrl: '#',
        alignment: 'center'
      };
    case 'cta':
      return {
        heading: 'Ready to get started?',
        description: 'Join thousands of users who trust our platform.',
        primaryText: 'Start Free Trial',
        primaryUrl: '#',
        secondaryText: 'Learn More',
        secondaryUrl: '#',
        style: 'default'
      };
    case 'featureGrid':
      return {
        columns: 3,
        features: [
          { title: 'Feature One', description: 'Description', icon: '✨' },
          { title: 'Feature Two', description: 'Description', icon: '🚀' },
          { title: 'Feature Three', description: 'Description', icon: '💡' },
        ]
      };
    case 'testimonial':
      return {
        quote: 'This is an amazing testimonial quote.',
        author: 'John Doe',
        role: 'CEO',
        company: 'Company Inc.',
        avatarUrl: ''
      };
    case 'lessonContent':
      return {
        lessonTitle: 'Lesson Title',
        duration: '10 min',
        objectives: ['Objective 1', 'Objective 2'],
        content: 'Lesson content goes here.',
        videoUrl: ''
      };
    case 'quiz':
      return {
        question: 'What is the correct answer?',
        options: [
          { text: 'Option A', isCorrect: true },
          { text: 'Option B', isCorrect: false },
          { text: 'Option C', isCorrect: false },
        ],
        explanation: 'Explanation for the correct answer.',
        type: 'single'
      };
    case 'image':
      return { file: { url: '' }, caption: '' };
    case 'embed':
      return { service: 'youtube', source: '', embed: '', width: 580, height: 320 };
    default:
      return {};
  }
};

const dummyContent: OutputData = {
  time: Date.now(),
  blocks: [
    {
      type: 'header',
      data: { text: 'Getting Started with Zenith Studio', level: 1 }
    },
    {
      type: 'paragraph',
      data: {
        text: 'Welcome to Zenith Studio — the unified platform for managing your digital business. This guide will help you understand the core concepts and get up and running quickly.'
      }
    },
    {
      type: 'header',
      data: { text: 'Core Concepts', level: 2 }
    },
    {
      type: 'list',
      data: {
        style: 'unordered',
        items: [
          '<b>CMS Studio</b> — Your content system of record',
          '<b>Website Builder</b> — Create and manage web experiences',
          '<b>LMS Studio</b> — Build learning journeys and courses',
          '<b>Automation Studio</b> — Connect events to actions'
        ]
      }
    },
  ],
  version: '2.28.2'
};

const emptyContent: OutputData = {
  time: Date.now(),
  blocks: [],
  version: '2.28.2'
};

export const CMSEditorCanvas = forwardRef<CMSEditorCanvasHandle, CMSEditorCanvasProps>(
  ({ contentId, onDataChange, onRequestAddBlock }, ref) => {
    const editorRef = useRef<EditorJS | null>(null);
    const holderRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);

    useImperativeHandle(ref, () => ({
      insertBlock: async (blockType: string, data?: Record<string, unknown>): Promise<InsertResult> => {
        if (!editorRef.current || !isReady) {
          return { ok: false, reason: 'EDITOR_NOT_READY' };
        }
        
        const blockData = data || getDefaultBlockData(blockType);
        
        try {
          const currentBlockIndex = editorRef.current.blocks.getCurrentBlockIndex();
          const insertIndex = currentBlockIndex >= 0 ? currentBlockIndex + 1 : editorRef.current.blocks.getBlocksCount();
          
          await editorRef.current.blocks.insert(blockType, blockData, undefined, insertIndex, true);
          editorRef.current.caret.setToBlock(insertIndex, 'start');
          
          const savedData = await editorRef.current.save();
          setIsEmpty(savedData.blocks.length === 0);
          onDataChange?.(savedData);
          
          return { ok: true };
        } catch (error) {
          console.error('Failed to insert block:', error);
          return { ok: false, reason: 'INSERT_FAILED', error: String(error) };
        }
      },
      getEditor: () => editorRef.current,
      isReady: () => isReady
    }), [isReady, onDataChange]);

    const initEditor = useCallback(async () => {
      if (!holderRef.current || editorRef.current) return;

      const isNewContent = contentId?.startsWith('new');
      const initialData = isNewContent ? emptyContent : dummyContent;
      setIsEmpty(initialData.blocks.length === 0);

      const editor = new EditorJS({
        holder: holderRef.current,
        data: initialData,
        placeholder: 'Start writing or click Add Block...',
        tools: {
          header: {
            class: Header,
            config: { levels: [1, 2, 3, 4], defaultLevel: 2 }
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: { defaultStyle: 'unordered' }
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: { quotePlaceholder: 'Enter a quote', captionPlaceholder: 'Quote author' }
          },
          delimiter: Delimiter,
          code: Code,
          table: {
            class: Table as any,
            inlineToolbar: true,
            config: { rows: 2, cols: 3 }
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile: async (file: File) => {
                  const url = URL.createObjectURL(file);
                  return { success: 1, file: { url } };
                },
                uploadByUrl: async (url: string) => {
                  return { success: 1, file: { url } };
                }
              }
            }
          },
          embed: {
            class: Embed,
            config: {
              services: { youtube: true, vimeo: true, twitter: true, instagram: true, codepen: true, gist: true }
            }
          },
          hero: { class: HeroBlock as any },
          cta: { class: CTABlock as any },
          featureGrid: { class: FeatureGridBlock as any },
          testimonial: { class: TestimonialBlock as any },
          lessonContent: { class: LessonContentBlock as any },
          quiz: { class: QuizBlock as any },
        },
        onChange: async () => {
          if (editorRef.current) {
            const data = await editorRef.current.save();
            setIsEmpty(data.blocks.length === 0);
            onDataChange?.(data);
          }
        },
        onReady: () => {
          setIsReady(true);
        }
      });

      editorRef.current = editor;
    }, [onDataChange, contentId]);

    useEffect(() => {
      initEditor();

      return () => {
        if (editorRef.current?.destroy) {
          editorRef.current.destroy();
          editorRef.current = null;
          setIsReady(false);
        }
      };
    }, [initEditor]);

    useEffect(() => {
      const renderContent = async () => {
        if (contentId && editorRef.current && isReady) {
          try {
            await editorRef.current.isReady;
            const content = contentId.startsWith('new') ? emptyContent : dummyContent;
            setIsEmpty(content.blocks.length === 0);
            if (editorRef.current.render) {
              await editorRef.current.render(content);
            }
          } catch (error) {
            console.error('Failed to render content:', error);
          }
        }
      };
      renderContent();
    }, [contentId, isReady]);

    if (!contentId) {
      return (
        <div className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Select content to edit</h3>
            <p className="text-sm text-muted-foreground">
              Choose a content item from the library or create new content.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col bg-background overflow-hidden">
        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto py-12 px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isReady ? 1 : 0.5 }}
              transition={{ duration: 0.3 }}
            >
              {/* Empty State */}
              {isEmpty && isReady && (
                <button 
                  onClick={onRequestAddBlock}
                  className="w-full border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <Plus size={32} className="mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">Add your first block</p>
                </button>
              )}

              {/* Editor.js Container */}
              <div 
                ref={holderRef} 
                className={`prose prose-sm dark:prose-invert max-w-none
                  ${isEmpty ? 'hidden' : ''}
                  [&_.ce-block]:py-1
                  [&_.ce-block__content]:max-w-none
                  [&_.ce-toolbar]:left-0
                  [&_.ce-inline-toolbar]:bg-card
                  [&_.ce-inline-toolbar]:border-border
                  [&_.ce-inline-toolbar]:shadow-lg
                  [&_.ce-conversion-toolbar]:bg-card
                  [&_.ce-conversion-toolbar]:border-border
                  [&_.ce-settings]:bg-card
                  [&_.ce-settings]:border-border
                  [&_.ce-popover]:bg-card
                  [&_.ce-popover]:border-border
                  [&_.ce-popover]:shadow-lg
                  [&_h1]:text-3xl
                  [&_h1]:font-bold
                  [&_h2]:text-2xl
                  [&_h2]:font-semibold
                  [&_h3]:text-xl
                  [&_.cdx-quote]:border-l-primary
                  [&_.cdx-quote]:bg-muted/50
                  [&_.cdx-quote]:rounded-r-lg
                  [&_.cdx-quote]:p-4
                  [&_.ce-delimiter]:before:bg-border
                `}
              />
            </motion.div>
          </div>
        </div>
      </div>
    );
  }
);

CMSEditorCanvas.displayName = 'CMSEditorCanvas';
