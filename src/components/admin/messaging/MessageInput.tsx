import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip, Smile, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface AttachedFile {
  file: File;
  preview?: string;
}

interface MessageInputProps {
  onSend: (content: string, attachments: File[]) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export const MessageInput = ({
  onSend,
  disabled,
  placeholder = 'Type a message...',
}: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAttachments: AttachedFile[] = files.map((file) => ({
      file,
      preview: file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : undefined,
    }));
    setAttachedFiles((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleSend = async () => {
    if ((!message.trim() && attachedFiles.length === 0) || isSending || disabled) {
      return;
    }

    setIsSending(true);
    try {
      await onSend(
        message.trim(),
        attachedFiles.map((a) => a.file)
      );
      setMessage('');
      attachedFiles.forEach((a) => {
        if (a.preview) URL.revokeObjectURL(a.preview);
      });
      setAttachedFiles([]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="border-t border-border p-4">
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachedFiles.map((attachment, index) => (
            <div
              key={index}
              className="relative group flex items-center gap-2 bg-muted rounded-lg p-2 pr-8"
            >
              {attachment.preview ? (
                <img
                  src={attachment.preview}
                  alt={attachment.file.name}
                  className="w-10 h-10 object-cover rounded"
                />
              ) : (
                <div className="w-10 h-10 bg-background rounded flex items-center justify-center">
                  <span className="text-xs font-medium uppercase">
                    {attachment.file.name.split('.').pop()}
                  </span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-xs font-medium truncate max-w-[120px]">
                  {attachment.file.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(attachment.file.size)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => removeAttachment(index)}
              >
                <X size={12} />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          multiple
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        />

        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          <Paperclip size={20} />
        </Button>

        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isSending}
          className="min-h-[44px] max-h-32 resize-none"
          rows={1}
        />

        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0"
          disabled={disabled}
        >
          <Smile size={20} />
        </Button>

        <Button
          size="icon"
          onClick={handleSend}
          disabled={(!message.trim() && attachedFiles.length === 0) || isSending || disabled}
          className="flex-shrink-0"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};
