import { BlockTool, BlockToolConstructorOptions } from '@editorjs/editorjs';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface FeatureGridBlockData {
  columns: 2 | 3 | 4;
  features: Feature[];
}

export default class FeatureGridBlock implements BlockTool {
  private data: FeatureGridBlockData;
  private wrapper: HTMLElement | null = null;

  static get toolbox() {
    return {
      title: 'Feature Grid',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>'
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({ data }: BlockToolConstructorOptions<FeatureGridBlockData>) {
    this.data = {
      columns: data.columns || 3,
      features: data.features || [
        { title: 'Feature One', description: 'Description for the first feature', icon: '✨' },
        { title: 'Feature Two', description: 'Description for the second feature', icon: '🚀' },
        { title: 'Feature Three', description: 'Description for the third feature', icon: '💡' },
      ]
    };
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('cdx-feature-grid-block');
    this.wrapper.style.cssText = `
      display: grid;
      grid-template-columns: repeat(${this.data.columns}, 1fr);
      gap: 16px;
    `;

    this.data.features.forEach((feature, index) => {
      const card = this.createFeatureCard(feature, index);
      this.wrapper!.appendChild(card);
    });

    // Add feature button
    const addBtn = document.createElement('button');
    addBtn.textContent = '+ Add Feature';
    addBtn.style.cssText = `
      padding: 24px;
      border: 2px dashed hsl(var(--border));
      border-radius: 12px;
      background: transparent;
      color: hsl(var(--muted-foreground));
      cursor: pointer;
      transition: all 0.2s;
    `;
    addBtn.addEventListener('click', () => {
      this.data.features.push({
        title: 'New Feature',
        description: 'Feature description',
        icon: '⭐'
      });
      this.wrapper!.innerHTML = '';
      this.data.features.forEach((f, i) => {
        this.wrapper!.appendChild(this.createFeatureCard(f, i));
      });
    });

    return this.wrapper;
  }

  private createFeatureCard(feature: Feature, index: number): HTMLElement {
    const card = document.createElement('div');
    card.style.cssText = `
      background: hsl(var(--card));
      border: 1px solid hsl(var(--border));
      border-radius: 12px;
      padding: 24px;
    `;

    const iconSpan = document.createElement('div');
    iconSpan.textContent = feature.icon;
    iconSpan.style.cssText = `
      font-size: 24px;
      margin-bottom: 12px;
    `;

    const titleInput = document.createElement('h4');
    titleInput.contentEditable = 'true';
    titleInput.textContent = feature.title;
    titleInput.style.cssText = `
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 8px;
      outline: none;
      color: hsl(var(--foreground));
    `;
    titleInput.addEventListener('input', () => {
      this.data.features[index].title = titleInput.textContent || '';
    });

    const descInput = document.createElement('p');
    descInput.contentEditable = 'true';
    descInput.textContent = feature.description;
    descInput.style.cssText = `
      font-size: 0.875rem;
      color: hsl(var(--muted-foreground));
      outline: none;
    `;
    descInput.addEventListener('input', () => {
      this.data.features[index].description = descInput.textContent || '';
    });

    card.appendChild(iconSpan);
    card.appendChild(titleInput);
    card.appendChild(descInput);

    return card;
  }

  save(): FeatureGridBlockData {
    return this.data;
  }
}
