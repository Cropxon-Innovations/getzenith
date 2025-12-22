import { BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';

interface CTABlockData {
  heading: string;
  description: string;
  primaryText: string;
  primaryUrl: string;
  secondaryText: string;
  secondaryUrl: string;
  style: 'default' | 'accent' | 'minimal';
}

export default class CTABlock implements BlockTool {
  private data: CTABlockData;
  private wrapper: HTMLElement | null = null;

  static get toolbox() {
    return {
      title: 'Call to Action',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>'
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({ data }: BlockToolConstructorOptions<CTABlockData>) {
    this.data = {
      heading: data.heading || 'Ready to get started?',
      description: data.description || 'Join thousands of users who trust our platform.',
      primaryText: data.primaryText || 'Start Free Trial',
      primaryUrl: data.primaryUrl || '#',
      secondaryText: data.secondaryText || 'Learn More',
      secondaryUrl: data.secondaryUrl || '#',
      style: data.style || 'default'
    };
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('cdx-cta-block');
    this.wrapper.style.cssText = `
      background: hsl(var(--card));
      border: 1px solid hsl(var(--border));
      border-radius: 12px;
      padding: 32px;
      text-align: center;
    `;

    const headingInput = document.createElement('h3');
    headingInput.contentEditable = 'true';
    headingInput.textContent = this.data.heading;
    headingInput.style.cssText = `
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 8px;
      outline: none;
      color: hsl(var(--foreground));
    `;
    headingInput.addEventListener('input', () => {
      this.data.heading = headingInput.textContent || '';
    });

    const descInput = document.createElement('p');
    descInput.contentEditable = 'true';
    descInput.textContent = this.data.description;
    descInput.style.cssText = `
      color: hsl(var(--muted-foreground));
      margin-bottom: 24px;
      outline: none;
    `;
    descInput.addEventListener('input', () => {
      this.data.description = descInput.textContent || '';
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `display: flex; gap: 12px; justify-content: center;`;

    const primaryBtn = document.createElement('button');
    primaryBtn.contentEditable = 'true';
    primaryBtn.textContent = this.data.primaryText;
    primaryBtn.style.cssText = `
      background: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 500;
      border: none;
      cursor: text;
      outline: none;
    `;
    primaryBtn.addEventListener('input', () => {
      this.data.primaryText = primaryBtn.textContent || '';
    });

    const secondaryBtn = document.createElement('button');
    secondaryBtn.contentEditable = 'true';
    secondaryBtn.textContent = this.data.secondaryText;
    secondaryBtn.style.cssText = `
      background: transparent;
      color: hsl(var(--foreground));
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 500;
      border: 1px solid hsl(var(--border));
      cursor: text;
      outline: none;
    `;
    secondaryBtn.addEventListener('input', () => {
      this.data.secondaryText = secondaryBtn.textContent || '';
    });

    buttonContainer.appendChild(primaryBtn);
    buttonContainer.appendChild(secondaryBtn);

    this.wrapper.appendChild(headingInput);
    this.wrapper.appendChild(descInput);
    this.wrapper.appendChild(buttonContainer);

    return this.wrapper;
  }

  save(): CTABlockData {
    return this.data;
  }
}
