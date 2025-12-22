import { BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';

interface LessonContentBlockData {
  lessonTitle: string;
  duration: string;
  objectives: string[];
  content: string;
  videoUrl: string;
}

export default class LessonContentBlock implements BlockTool {
  private data: LessonContentBlockData;
  private wrapper: HTMLElement | null = null;

  static get toolbox() {
    return {
      title: 'Lesson Content',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({ data }: BlockToolConstructorOptions<LessonContentBlockData>) {
    this.data = {
      lessonTitle: data.lessonTitle || 'Lesson Title',
      duration: data.duration || '10 min',
      objectives: data.objectives || ['Understand the basics', 'Apply concepts in practice'],
      content: data.content || 'This is the main lesson content. Add your educational material here.',
      videoUrl: data.videoUrl || ''
    };
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('cdx-lesson-content-block');
    this.wrapper.style.cssText = `
      background: hsl(var(--card));
      border: 1px solid hsl(var(--border));
      border-radius: 12px;
      overflow: hidden;
    `;

    // Header
    const header = document.createElement('div');
    header.style.cssText = `
      background: linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--secondary)));
      padding: 20px 24px;
      border-bottom: 1px solid hsl(var(--border));
    `;

    const badge = document.createElement('div');
    badge.textContent = 'LESSON';
    badge.style.cssText = `
      display: inline-block;
      font-size: 10px;
      font-weight: 600;
      color: hsl(var(--primary));
      background: hsl(var(--primary) / 0.15);
      padding: 4px 8px;
      border-radius: 4px;
      margin-bottom: 12px;
      letter-spacing: 0.5px;
    `;

    const titleRow = document.createElement('div');
    titleRow.style.cssText = `display: flex; align-items: center; justify-content: space-between;`;

    const titleInput = document.createElement('h3');
    titleInput.contentEditable = 'true';
    titleInput.textContent = this.data.lessonTitle;
    titleInput.style.cssText = `
      font-size: 1.25rem;
      font-weight: 600;
      outline: none;
      color: hsl(var(--foreground));
    `;
    titleInput.addEventListener('input', () => {
      this.data.lessonTitle = titleInput.textContent || '';
    });

    const durationInput = document.createElement('span');
    durationInput.contentEditable = 'true';
    durationInput.textContent = this.data.duration;
    durationInput.style.cssText = `
      font-size: 0.75rem;
      color: hsl(var(--muted-foreground));
      background: hsl(var(--secondary));
      padding: 4px 10px;
      border-radius: 12px;
      outline: none;
    `;
    durationInput.addEventListener('input', () => {
      this.data.duration = durationInput.textContent || '';
    });

    titleRow.appendChild(titleInput);
    titleRow.appendChild(durationInput);
    header.appendChild(badge);
    header.appendChild(titleRow);

    // Body
    const body = document.createElement('div');
    body.style.cssText = `padding: 24px;`;

    // Objectives
    const objectivesSection = document.createElement('div');
    objectivesSection.style.cssText = `margin-bottom: 20px;`;

    const objLabel = document.createElement('div');
    objLabel.textContent = 'Learning Objectives';
    objLabel.style.cssText = `
      font-size: 11px;
      color: hsl(var(--muted-foreground));
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
    `;

    const objList = document.createElement('ul');
    objList.style.cssText = `
      margin: 0;
      padding-left: 20px;
    `;

    this.data.objectives.forEach((obj, index) => {
      const li = document.createElement('li');
      li.contentEditable = 'true';
      li.textContent = obj;
      li.style.cssText = `
        color: hsl(var(--foreground));
        margin-bottom: 4px;
        outline: none;
      `;
      li.addEventListener('input', () => {
        this.data.objectives[index] = li.textContent || '';
      });
      objList.appendChild(li);
    });

    objectivesSection.appendChild(objLabel);
    objectivesSection.appendChild(objList);

    // Video placeholder
    const videoSection = document.createElement('div');
    videoSection.style.cssText = `
      background: hsl(var(--secondary));
      border-radius: 8px;
      padding: 40px;
      text-align: center;
      margin-bottom: 20px;
      border: 2px dashed hsl(var(--border));
    `;
    videoSection.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 8px; color: hsl(var(--muted-foreground));">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
      <div style="font-size: 12px; color: hsl(var(--muted-foreground));">Add video URL or upload</div>
    `;

    // Content
    const contentSection = document.createElement('div');
    const contentLabel = document.createElement('div');
    contentLabel.textContent = 'Lesson Content';
    contentLabel.style.cssText = `
      font-size: 11px;
      color: hsl(var(--muted-foreground));
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
    `;

    const contentInput = document.createElement('p');
    contentInput.contentEditable = 'true';
    contentInput.textContent = this.data.content;
    contentInput.style.cssText = `
      color: hsl(var(--foreground));
      line-height: 1.6;
      outline: none;
    `;
    contentInput.addEventListener('input', () => {
      this.data.content = contentInput.textContent || '';
    });

    contentSection.appendChild(contentLabel);
    contentSection.appendChild(contentInput);

    body.appendChild(objectivesSection);
    body.appendChild(videoSection);
    body.appendChild(contentSection);

    this.wrapper.appendChild(header);
    this.wrapper.appendChild(body);

    return this.wrapper;
  }

  save(): LessonContentBlockData {
    return this.data;
  }
}
