import { BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';

interface TestimonialBlockData {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarUrl: string;
}

export default class TestimonialBlock implements BlockTool {
  private data: TestimonialBlockData;
  private wrapper: HTMLElement | null = null;

  static get toolbox() {
    return {
      title: 'Testimonial',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({ data }: BlockToolConstructorOptions<TestimonialBlockData>) {
    this.data = {
      quote: data.quote || 'This platform has completely transformed how we manage our content. The seamless integration between systems saves us hours every week.',
      author: data.author || 'Sarah Johnson',
      role: data.role || 'Head of Content',
      company: data.company || 'TechCorp Inc.',
      avatarUrl: data.avatarUrl || ''
    };
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('cdx-testimonial-block');
    this.wrapper.style.cssText = `
      background: hsl(var(--card));
      border: 1px solid hsl(var(--border));
      border-radius: 12px;
      padding: 32px;
      position: relative;
    `;

    // Quote mark
    const quoteMark = document.createElement('div');
    quoteMark.innerHTML = '"';
    quoteMark.style.cssText = `
      position: absolute;
      top: 16px;
      left: 24px;
      font-size: 48px;
      color: hsl(var(--primary) / 0.2);
      font-family: Georgia, serif;
      line-height: 1;
    `;

    // Quote text
    const quoteInput = document.createElement('p');
    quoteInput.contentEditable = 'true';
    quoteInput.textContent = this.data.quote;
    quoteInput.style.cssText = `
      font-size: 1.125rem;
      font-style: italic;
      color: hsl(var(--foreground));
      margin-bottom: 24px;
      line-height: 1.6;
      outline: none;
      padding-left: 24px;
    `;
    quoteInput.addEventListener('input', () => {
      this.data.quote = quoteInput.textContent || '';
    });

    // Author section
    const authorSection = document.createElement('div');
    authorSection.style.cssText = `display: flex; align-items: center; gap: 16px;`;

    // Avatar
    const avatar = document.createElement('div');
    avatar.style.cssText = `
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7));
      display: flex;
      align-items: center;
      justify-content: center;
      color: hsl(var(--primary-foreground));
      font-weight: 600;
      font-size: 16px;
    `;
    avatar.textContent = this.data.author.split(' ').map(n => n[0]).join('').slice(0, 2);

    // Author info
    const authorInfo = document.createElement('div');

    const authorName = document.createElement('div');
    authorName.contentEditable = 'true';
    authorName.textContent = this.data.author;
    authorName.style.cssText = `
      font-weight: 600;
      color: hsl(var(--foreground));
      outline: none;
    `;
    authorName.addEventListener('input', () => {
      this.data.author = authorName.textContent || '';
      avatar.textContent = (authorName.textContent || '').split(' ').map(n => n[0]).join('').slice(0, 2);
    });

    const authorRole = document.createElement('div');
    authorRole.style.cssText = `display: flex; gap: 4px; font-size: 0.875rem; color: hsl(var(--muted-foreground));`;

    const roleInput = document.createElement('span');
    roleInput.contentEditable = 'true';
    roleInput.textContent = this.data.role;
    roleInput.style.cssText = `outline: none;`;
    roleInput.addEventListener('input', () => {
      this.data.role = roleInput.textContent || '';
    });

    const separator = document.createElement('span');
    separator.textContent = ' at ';

    const companyInput = document.createElement('span');
    companyInput.contentEditable = 'true';
    companyInput.textContent = this.data.company;
    companyInput.style.cssText = `outline: none;`;
    companyInput.addEventListener('input', () => {
      this.data.company = companyInput.textContent || '';
    });

    authorRole.appendChild(roleInput);
    authorRole.appendChild(separator);
    authorRole.appendChild(companyInput);

    authorInfo.appendChild(authorName);
    authorInfo.appendChild(authorRole);

    authorSection.appendChild(avatar);
    authorSection.appendChild(authorInfo);

    this.wrapper.appendChild(quoteMark);
    this.wrapper.appendChild(quoteInput);
    this.wrapper.appendChild(authorSection);

    return this.wrapper;
  }

  save(): TestimonialBlockData {
    return this.data;
  }
}
