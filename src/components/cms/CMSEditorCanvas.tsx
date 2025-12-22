import { useState, useEffect, useRef, useCallback } from 'react';
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

interface CMSEditorCanvasProps {
  contentId: string | null;
  onDataChange?: (data: OutputData) => void;
}

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
      type: 'header',
      data: {
        text: 'Next Steps',
        level: 2
      }
    },
    {
      type: 'paragraph',
      data: {
        text: 'Now that you understand the basics, explore each studio to see how they work together to power your business.'
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

export const CMSEditorCanvas = ({ contentId, onDataChange }: CMSEditorCanvasProps) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const initEditor = useCallback(async () => {
    if (!holderRef.current || editorRef.current) return;

    const editor = new EditorJS({
      holder: holderRef.current,
      data: dummyContent,
      placeholder: 'Start writing or press "/" for commands...',
      tools: {
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
        }
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
  }, [onDataChange]);

  useEffect(() => {
    initEditor();

    return () => {
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [initEditor]);

  // Reinitialize when content changes
  useEffect(() => {
    if (contentId && editorRef.current && isReady) {
      // In a real app, fetch content by ID and render it
      editorRef.current.render(dummyContent);
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

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden">
      {/* Editor Toolbar / Status */}
      <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-card/50">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Getting Started Guide</span>
          <span className="px-2 py-0.5 text-[10px] rounded-full bg-green-500/10 text-green-500">
            Published
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
        <div className="max-w-3xl mx-auto py-8 px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isReady ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              ref={holderRef} 
              className="prose prose-sm dark:prose-invert max-w-none
                [&_.ce-block]:py-1
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
};