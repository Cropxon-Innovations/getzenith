import { BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';

interface QuizOption {
  text: string;
  isCorrect: boolean;
}

interface QuizBlockData {
  question: string;
  options: QuizOption[];
  explanation: string;
  type: 'single' | 'multiple';
}

export default class QuizBlock implements BlockTool {
  private data: QuizBlockData;
  private wrapper: HTMLElement | null = null;

  static get toolbox() {
    return {
      title: 'Quiz',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({ data }: BlockToolConstructorOptions<QuizBlockData>) {
    this.data = {
      question: data.question || 'What is the correct answer?',
      options: data.options || [
        { text: 'Option A', isCorrect: true },
        { text: 'Option B', isCorrect: false },
        { text: 'Option C', isCorrect: false },
        { text: 'Option D', isCorrect: false },
      ],
      explanation: data.explanation || 'This is the explanation for the correct answer.',
      type: data.type || 'single'
    };
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('cdx-quiz-block');
    this.wrapper.style.cssText = `
      background: hsl(var(--card));
      border: 1px solid hsl(var(--border));
      border-radius: 12px;
      padding: 24px;
      border-left: 4px solid hsl(var(--primary));
    `;

    // Quiz badge
    const badge = document.createElement('div');
    badge.textContent = 'QUIZ';
    badge.style.cssText = `
      display: inline-block;
      font-size: 10px;
      font-weight: 600;
      color: hsl(var(--primary));
      background: hsl(var(--primary) / 0.1);
      padding: 4px 8px;
      border-radius: 4px;
      margin-bottom: 16px;
      letter-spacing: 0.5px;
    `;

    // Question
    const questionInput = document.createElement('h4');
    questionInput.contentEditable = 'true';
    questionInput.textContent = this.data.question;
    questionInput.style.cssText = `
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 16px;
      outline: none;
      color: hsl(var(--foreground));
    `;
    questionInput.addEventListener('input', () => {
      this.data.question = questionInput.textContent || '';
    });

    // Options container
    const optionsContainer = document.createElement('div');
    optionsContainer.style.cssText = `display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;`;

    this.data.options.forEach((option, index) => {
      const optionRow = document.createElement('div');
      optionRow.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border-radius: 8px;
        background: hsl(var(--secondary) / 0.5);
        border: 1px solid ${option.isCorrect ? 'hsl(var(--primary))' : 'transparent'};
      `;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = option.isCorrect;
      checkbox.style.cssText = `width: 16px; height: 16px; cursor: pointer;`;
      checkbox.addEventListener('change', () => {
        this.data.options[index].isCorrect = checkbox.checked;
      });

      const textInput = document.createElement('span');
      textInput.contentEditable = 'true';
      textInput.textContent = option.text;
      textInput.style.cssText = `
        flex: 1;
        outline: none;
        color: hsl(var(--foreground));
      `;
      textInput.addEventListener('input', () => {
        this.data.options[index].text = textInput.textContent || '';
      });

      optionRow.appendChild(checkbox);
      optionRow.appendChild(textInput);
      optionsContainer.appendChild(optionRow);
    });

    // Explanation
    const expLabel = document.createElement('div');
    expLabel.textContent = 'Explanation (shown after answer)';
    expLabel.style.cssText = `
      font-size: 11px;
      color: hsl(var(--muted-foreground));
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    `;

    const explanationInput = document.createElement('p');
    explanationInput.contentEditable = 'true';
    explanationInput.textContent = this.data.explanation;
    explanationInput.style.cssText = `
      font-size: 0.875rem;
      color: hsl(var(--muted-foreground));
      padding: 12px;
      background: hsl(var(--secondary) / 0.3);
      border-radius: 8px;
      outline: none;
    `;
    explanationInput.addEventListener('input', () => {
      this.data.explanation = explanationInput.textContent || '';
    });

    this.wrapper.appendChild(badge);
    this.wrapper.appendChild(questionInput);
    this.wrapper.appendChild(optionsContainer);
    this.wrapper.appendChild(expLabel);
    this.wrapper.appendChild(explanationInput);

    return this.wrapper;
  }

  save(): QuizBlockData {
    return this.data;
  }
}
