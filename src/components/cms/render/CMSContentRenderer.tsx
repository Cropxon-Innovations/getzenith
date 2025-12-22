import { OutputData } from '@editorjs/editorjs';
import { cn } from '@/lib/utils';

interface CMSContentRendererProps {
  data: OutputData;
  className?: string;
}

// Individual block renderers
const renderHeader = (block: { data: { text: string; level: number } }) => {
  const Tag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
  const sizes: Record<number, string> = {
    1: 'text-3xl font-bold',
    2: 'text-2xl font-semibold',
    3: 'text-xl font-semibold',
    4: 'text-lg font-medium',
  };
  return (
    <Tag 
      className={cn(sizes[block.data.level] || 'text-lg font-medium', 'mb-4')}
      dangerouslySetInnerHTML={{ __html: block.data.text }}
    />
  );
};

const renderParagraph = (block: { data: { text: string } }) => (
  <p 
    className="text-base leading-relaxed mb-4 text-foreground/90"
    dangerouslySetInnerHTML={{ __html: block.data.text }}
  />
);

const renderList = (block: { data: { style: string; items: string[] } }) => {
  const Tag = block.data.style === 'ordered' ? 'ol' : 'ul';
  return (
    <Tag className={cn(
      'mb-4 pl-6 space-y-1',
      block.data.style === 'ordered' ? 'list-decimal' : 'list-disc'
    )}>
      {block.data.items.map((item, i) => (
        <li key={i} className="text-foreground/90" dangerouslySetInnerHTML={{ __html: item }} />
      ))}
    </Tag>
  );
};

const renderQuote = (block: { data: { text: string; caption?: string } }) => (
  <blockquote className="border-l-4 border-primary pl-4 py-2 mb-4 bg-muted/30 rounded-r-lg">
    <p className="text-lg italic text-foreground/80" dangerouslySetInnerHTML={{ __html: block.data.text }} />
    {block.data.caption && (
      <cite className="text-sm text-muted-foreground mt-2 block">— {block.data.caption}</cite>
    )}
  </blockquote>
);

const renderDelimiter = () => (
  <div className="flex items-center justify-center gap-2 my-8">
    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
  </div>
);

const renderCode = (block: { data: { code: string } }) => (
  <pre className="bg-muted rounded-lg p-4 mb-4 overflow-x-auto">
    <code className="text-sm font-mono text-foreground">{block.data.code}</code>
  </pre>
);

const renderImage = (block: { data: { file: { url: string }; caption?: string } }) => (
  <figure className="mb-4">
    <img 
      src={block.data.file.url} 
      alt={block.data.caption || ''} 
      className="w-full rounded-lg"
      loading="lazy"
    />
    {block.data.caption && (
      <figcaption className="text-sm text-muted-foreground mt-2 text-center">
        {block.data.caption}
      </figcaption>
    )}
  </figure>
);

const renderEmbed = (block: { data: { service: string; embed: string; caption?: string } }) => (
  <div className="mb-4">
    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
      <iframe 
        src={block.data.embed} 
        className="w-full h-full"
        allowFullScreen
        title={block.data.caption || 'Embedded content'}
      />
    </div>
    {block.data.caption && (
      <p className="text-sm text-muted-foreground mt-2 text-center">{block.data.caption}</p>
    )}
  </div>
);

const renderTable = (block: { data: { content: string[][] } }) => (
  <div className="overflow-x-auto mb-4">
    <table className="w-full border-collapse border border-border rounded-lg">
      <tbody>
        {block.data.content.map((row, i) => (
          <tr key={i} className={i === 0 ? 'bg-muted' : ''}>
            {row.map((cell, j) => (
              <td 
                key={j} 
                className="border border-border px-4 py-2 text-sm"
                dangerouslySetInnerHTML={{ __html: cell }}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Custom Zenith blocks
const renderHero = (block: { data: { title: string; subtitle?: string; ctaText?: string; ctaUrl?: string; alignment?: string } }) => (
  <div className={cn(
    'py-12 px-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 mb-6',
    block.data.alignment === 'center' && 'text-center',
    block.data.alignment === 'right' && 'text-right'
  )}>
    <h1 className="text-3xl md:text-4xl font-bold mb-4">{block.data.title}</h1>
    {block.data.subtitle && (
      <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">{block.data.subtitle}</p>
    )}
    {block.data.ctaText && (
      <a 
        href={block.data.ctaUrl || '#'} 
        className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
      >
        {block.data.ctaText}
      </a>
    )}
  </div>
);

const renderCTA = (block: { data: { heading: string; description?: string; primaryText?: string; primaryUrl?: string; secondaryText?: string; secondaryUrl?: string; style?: string } }) => (
  <div className={cn(
    'p-6 rounded-xl border border-border mb-6',
    block.data.style === 'gradient' && 'bg-gradient-to-r from-primary/10 to-accent/10'
  )}>
    <h3 className="text-xl font-semibold mb-2">{block.data.heading}</h3>
    {block.data.description && (
      <p className="text-muted-foreground mb-4">{block.data.description}</p>
    )}
    <div className="flex flex-wrap gap-3">
      {block.data.primaryText && (
        <a 
          href={block.data.primaryUrl || '#'} 
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90"
        >
          {block.data.primaryText}
        </a>
      )}
      {block.data.secondaryText && (
        <a 
          href={block.data.secondaryUrl || '#'} 
          className="px-4 py-2 rounded-lg border border-border hover:bg-muted"
        >
          {block.data.secondaryText}
        </a>
      )}
    </div>
  </div>
);

const renderFeatureGrid = (block: { data: { columns?: number; features?: { title: string; description: string; icon?: string }[] } }) => (
  <div className={cn(
    'grid gap-4 mb-6',
    block.data.columns === 2 && 'grid-cols-1 md:grid-cols-2',
    block.data.columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    block.data.columns === 4 && 'grid-cols-2 md:grid-cols-4',
    !block.data.columns && 'grid-cols-1 md:grid-cols-3'
  )}>
    {block.data.features?.map((feature, i) => (
      <div key={i} className="p-4 rounded-xl border border-border bg-card">
        {feature.icon && <span className="text-2xl mb-2 block">{feature.icon}</span>}
        <h4 className="font-semibold mb-1">{feature.title}</h4>
        <p className="text-sm text-muted-foreground">{feature.description}</p>
      </div>
    ))}
  </div>
);

const renderTestimonial = (block: { data: { quote: string; author: string; role?: string; company?: string; avatarUrl?: string } }) => (
  <div className="p-6 rounded-xl bg-muted/30 border border-border mb-6">
    <p className="text-lg italic mb-4">"{block.data.quote}"</p>
    <div className="flex items-center gap-3">
      {block.data.avatarUrl ? (
        <img src={block.data.avatarUrl} alt={block.data.author} className="w-10 h-10 rounded-full" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
          {block.data.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
      )}
      <div>
        <p className="font-medium">{block.data.author}</p>
        {(block.data.role || block.data.company) && (
          <p className="text-sm text-muted-foreground">
            {block.data.role}{block.data.role && block.data.company && ', '}{block.data.company}
          </p>
        )}
      </div>
    </div>
  </div>
);

const renderLessonContent = (block: { data: { lessonTitle: string; duration?: string; objectives?: string[]; content?: string } }) => (
  <div className="p-6 rounded-xl border border-border bg-card mb-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold">{block.data.lessonTitle}</h3>
      {block.data.duration && (
        <span className="px-3 py-1 rounded-full bg-muted text-sm">{block.data.duration}</span>
      )}
    </div>
    {block.data.objectives && block.data.objectives.length > 0 && (
      <div className="mb-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Learning Objectives</h4>
        <ul className="space-y-1">
          {block.data.objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-primary mt-0.5">✓</span>
              {obj}
            </li>
          ))}
        </ul>
      </div>
    )}
    {block.data.content && (
      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: block.data.content }} />
    )}
  </div>
);

const renderQuiz = (block: { data: { question: string; options?: { text: string; isCorrect: boolean }[]; explanation?: string } }) => (
  <div className="p-6 rounded-xl border border-border bg-card mb-6">
    <h4 className="font-semibold mb-4">{block.data.question}</h4>
    {block.data.options && (
      <div className="space-y-2 mb-4">
        {block.data.options.map((option, i) => (
          <div 
            key={i} 
            className="px-4 py-3 rounded-lg border border-border hover:border-primary/30 cursor-pointer transition-colors"
          >
            <span className="text-muted-foreground mr-2">{String.fromCharCode(65 + i)}.</span>
            {option.text}
          </div>
        ))}
      </div>
    )}
    {block.data.explanation && (
      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
        💡 {block.data.explanation}
      </p>
    )}
  </div>
);

// Main renderer
export const CMSContentRenderer = ({ data, className }: CMSContentRendererProps) => {
  if (!data.blocks || data.blocks.length === 0) {
    return (
      <div className={cn('text-center py-12 text-muted-foreground', className)}>
        <p>No content to preview</p>
      </div>
    );
  }

  return (
    <div className={cn('prose-content', className)}>
      {data.blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        
        switch (block.type) {
          case 'header':
            return <div key={key}>{renderHeader(block as any)}</div>;
          case 'paragraph':
            return <div key={key}>{renderParagraph(block as any)}</div>;
          case 'list':
            return <div key={key}>{renderList(block as any)}</div>;
          case 'quote':
            return <div key={key}>{renderQuote(block as any)}</div>;
          case 'delimiter':
            return <div key={key}>{renderDelimiter()}</div>;
          case 'code':
            return <div key={key}>{renderCode(block as any)}</div>;
          case 'image':
            return <div key={key}>{renderImage(block as any)}</div>;
          case 'embed':
            return <div key={key}>{renderEmbed(block as any)}</div>;
          case 'table':
            return <div key={key}>{renderTable(block as any)}</div>;
          case 'hero':
            return <div key={key}>{renderHero(block as any)}</div>;
          case 'cta':
            return <div key={key}>{renderCTA(block as any)}</div>;
          case 'featureGrid':
            return <div key={key}>{renderFeatureGrid(block as any)}</div>;
          case 'testimonial':
            return <div key={key}>{renderTestimonial(block as any)}</div>;
          case 'lessonContent':
            return <div key={key}>{renderLessonContent(block as any)}</div>;
          case 'quiz':
            return <div key={key}>{renderQuiz(block as any)}</div>;
          default:
            return (
              <div key={key} className="p-4 border border-dashed border-border rounded-lg mb-4 text-muted-foreground text-sm">
                Unsupported block type: {block.type}
              </div>
            );
        }
      })}
    </div>
  );
};
