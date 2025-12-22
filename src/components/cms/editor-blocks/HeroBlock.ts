import { BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';

interface HeroBlockData {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  alignment: 'left' | 'center' | 'right';
}

export default class HeroBlock implements BlockTool {
  private data: HeroBlockData;
  private wrapper: HTMLElement | null = null;

  static get toolbox() {
    return {
      title: 'Hero',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>'
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({ data }: BlockToolConstructorOptions<HeroBlockData>) {
    this.data = {
      title: data.title || 'Hero Title',
      subtitle: data.subtitle || 'A compelling subtitle that captures attention',
      ctaText: data.ctaText || 'Get Started',
      ctaUrl: data.ctaUrl || '#',
      alignment: data.alignment || 'center'
    };
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('cdx-hero-block');
    this.wrapper.style.cssText = `
      background: linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--secondary)));
      border-radius: 12px;
      padding: 48px 32px;
      text-align: ${this.data.alignment};
      border: 1px solid hsl(var(--border));
    `;

    const titleInput = document.createElement('h1');
    titleInput.contentEditable = 'true';
    titleInput.textContent = this.data.title;
    titleInput.style.cssText = `
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 16px;
      outline: none;
      color: hsl(var(--foreground));
    `;
    titleInput.addEventListener('input', () => {
      this.data.title = titleInput.textContent || '';
    });

    const subtitleInput = document.createElement('p');
    subtitleInput.contentEditable = 'true';
    subtitleInput.textContent = this.data.subtitle;
    subtitleInput.style.cssText = `
      font-size: 1.125rem;
      color: hsl(var(--muted-foreground));
      margin-bottom: 24px;
      outline: none;
    `;
    subtitleInput.addEventListener('input', () => {
      this.data.subtitle = subtitleInput.textContent || '';
    });

    const ctaButton = document.createElement('button');
    ctaButton.contentEditable = 'true';
    ctaButton.textContent = this.data.ctaText;
    ctaButton.style.cssText = `
      background: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 500;
      border: none;
      cursor: text;
      outline: none;
    `;
    ctaButton.addEventListener('input', () => {
      this.data.ctaText = ctaButton.textContent || '';
    });

    this.wrapper.appendChild(titleInput);
    this.wrapper.appendChild(subtitleInput);
    this.wrapper.appendChild(ctaButton);

    return this.wrapper;
  }

  save(): HeroBlockData {
    return this.data;
  }
}
