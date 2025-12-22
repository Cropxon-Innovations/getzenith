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

// Custom blocks
import HeroBlock from './editor-blocks/HeroBlock';
import CTABlock from './editor-blocks/CTABlock';
import FeatureGridBlock from './editor-blocks/FeatureGridBlock';
import QuizBlock from './editor-blocks/QuizBlock';
import LessonContentBlock from './editor-blocks/LessonContentBlock';
import TestimonialBlock from './editor-blocks/TestimonialBlock';

interface CMSEditorCanvasProps {
  contentId: string | null;
  onDataChange?: (data: OutputData) => void;
}

export interface CMSEditorCanvasHandle {
  insertBlock: (blockType: string, data?: Record<string, unknown>) => Promise<void>;
  getEditor: () => EditorJS | null;
}

// Default data for different block types
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
      data: {
        text: 'Getting Started with Zenith Studio',
        level: 1
      }
    },
    {
      type: 'paragraph',
      data: {
        text: 'Welcome to Zenith Studio — the unified platform for managing your digital business. This guide will help you understand the core concepts and get up and running quickly.'
      }
    },
    {
      type: 'header',
      data: {
        text: 'Core Concepts',
        level: 2
      }
    },
    {
      type: 'paragraph',
      data: {
        text: 'Zenith Studio is built around four integrated systems that work together to power your entire digital presence:'
      }
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
    {
      type: 'quote',
      data: {
        text: 'Content created in CMS Studio can be rendered on websites, structured into lessons, used in emails, and consumed by external systems via APIs.',
        caption: 'The Zenith Philosophy'
      }
    },
    {
      type: 'delimiter',
      data: {}
    },
    {
      type: 'paragraph',
      data: {
        text: '<i>Last updated: December 2024</i>'
      }
    }
  ],
  version: '2.28.2'
};

const emptyContent: OutputData = {
  time: Date.now(),
  blocks: [
    {
      type: 'header',
      data: {
        text: 'Untitled Content',
        level: 1
      }
    },
    {
      type: 'paragraph',
      data: {
        text: 'Start writing your content here...'
      }
    }
  ],
  version: '2.28.2'
};

export const CMSEditorCanvas = forwardRef<CMSEditorCanvasHandle, CMSEditorCanvasProps>(
  ({ contentId, onDataChange }, ref) => {
    const editorRef = useRef<EditorJS | null>(null);
    const holderRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      insertBlock: async (blockType: string, data?: Record<string, unknown>) => {
        if (!editorRef.current || !isReady) return;
        
        const blockData = data || getDefaultBlockData(blockType);
        
        try {
          // Get current block index
          const currentBlockIndex = editorRef.current.blocks.getCurrentBlockIndex();
          const insertIndex = currentBlockIndex >= 0 ? currentBlockIndex + 1 : editorRef.current.blocks.getBlocksCount();
          
          // Insert new block
          await editorRef.current.blocks.insert(blockType, blockData, undefined, insertIndex, true);
          
          // Focus on the new block
          editorRef.current.caret.setToBlock(insertIndex, 'start');
          
          // Trigger save
          const savedData = await editorRef.current.save();
          onDataChange?.(savedData);
          setLastSaved(new Date());
        } catch (error) {
          console.error('Failed to insert block:', error);
        }
      },
      getEditor: () => editorRef.current
    }), [isReady, onDataChange]);

    const initEditor = useCallback(async () => {
      if (!holderRef.current || editorRef.current) return;

      const editor = new EditorJS({
        holder: holderRef.current,
        data: contentId === 'new' ? emptyContent : dummyContent,
        placeholder: 'Start writing or press "/" for commands...',
        tools: {
          // Core blocks
          header: {
            class: Header,
            config: {
              levels: [1, 2, 3, 4],
              defaultLevel: 2
            }
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            }
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: 'Quote author'
            }
          },
          delimiter: Delimiter,
          code: Code,
          table: {
            class: Table as any,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3
            }
          },
          // Media blocks
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile: async (file: File) => {
                  // Placeholder - in production, upload to storage
                  const url = URL.createObjectURL(file);
                  return {
                    success: 1,
                    file: { url }
                  };
                },
                uploadByUrl: async (url: string) => {
                  return {
                    success: 1,
                    file: { url }
                  };
                }
              }
            }
          },
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                vimeo: true,
                twitter: true,
                instagram: true,
                codepen: true,
                gist: true
              }
            }
          },
          // Experience blocks
          hero: {
            class: HeroBlock as any,
          },
          cta: {
            class: CTABlock as any,
          },
          featureGrid: {
            class: FeatureGridBlock as any,
          },
          testimonial: {
            class: TestimonialBlock as any,
          },
          // Education blocks
          lessonContent: {
            class: LessonContentBlock as any,
          },
          quiz: {
            class: QuizBlock as any,
          },
        },
        onChange: async () => {
          if (editorRef.current) {
            const data = await editorRef.current.save();
            onDataChange?.(data);
            setLastSaved(new Date());
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

    // Reinitialize when content changes
    useEffect(() => {
      if (contentId && editorRef.current && isReady) {
        // In a real app, fetch content by ID and render it
        const content = contentId === 'new' ? emptyContent : dummyContent;
        editorRef.current.render(content);
      }
    }, [contentId, isReady]);

    if (!contentId) {
      return (
        <div className="flex-1 flex items-center justify-center bg-background">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary/50 border border-border flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Select content to edit</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Choose a content item from the library or create new content to start editing.
            </p>
          </motion.div>
        </div>
      );
    }

    const contentTitle = contentId === 'new' ? 'Untitled Content' : 'Getting Started Guide';
    const contentStatus = contentId === 'new' ? 'Draft' : 'Published';
    const statusColor = contentId === 'new' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500';

    return (
      <div className="flex-1 flex flex-col bg-background overflow-hidden">
        {/* Editor Toolbar / Status */}
        <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-card/50">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{contentTitle}</span>
            <span className={`px-2 py-0.5 text-[10px] rounded-full ${statusColor}`}>
              {contentStatus}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {lastSaved && (
              <span>Saved {lastSaved.toLocaleTimeString()}</span>
            )}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-500"
            />
            <span>Autosave on</span>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto py-8 px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isReady ? 1 : 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <div 
                ref={holderRef} 
                className="prose prose-sm dark:prose-invert max-w-none
                  [&_.ce-block]:py-2
                  [&_.ce-block__content]:max-w-none
                  [&_.ce-toolbar]:left-0
                  [&_.ce-inline-toolbar]:bg-card
                  [&_.ce-inline-toolbar]:border-border
                  [&_.ce-conversion-toolbar]:bg-card
                  [&_.ce-conversion-toolbar]:border-border
                  [&_.ce-settings]:bg-card
                  [&_.ce-settings]:border-border
                  [&_.ce-popover]:bg-card
                  [&_.ce-popover]:border-border
                  [&_.ce-header]:font-display
                  [&_h1]:text-3xl
                  [&_h2]:text-2xl
                  [&_h3]:text-xl
                  [&_.cdx-quote]:border-l-primary
                  [&_.cdx-quote]:bg-secondary/30
                  [&_.ce-delimiter]:before:bg-border
                "
              />
            </motion.div>
          </div>
        </div>
      </div>
    );
  }
);

CMSEditorCanvas.displayName = 'CMSEditorCanvas';
