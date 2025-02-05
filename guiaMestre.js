/**
 * guiaMestre.js
 */
class EnhancedHelper {
  constructor(steps = [], options = {}) {
    this.steps = steps;
    this.currentStepIndex = 0;

    this.options = {
      overlayColor: options.overlayColor || 'rgba(0, 0, 0, 0.7)',
      highlightBorder: options.highlightBorder || '3px dashed #ff0000',
      transitionDuration: options.transitionDuration || '0.3s',
      textBoxStyles: {
        padding: '15px',
        backgroundColor: '#fff',
        color: '#333',
        borderRadius: '8px',
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        ...options.textBoxStyles
      },
      highlightTransparent: options.highlightTransparent || false,
      onFinish: options.onFinish || null,
    };

    // Mapa para armazenar os z-index originais dos elementos destacados
    this.originalZIndices = new Map();
    // Conjunto para armazenar os elementos que já foram "dimmed"
    this.dimmedElements = new Set();

    // Cria o overlay que bloqueia a interação com o restante da página
    this.overlay = document.createElement('div');
    Object.assign(this.overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: this.options.overlayColor,
      pointerEvents: 'auto', // captura os eventos
      zIndex: '9998',
      transition: `opacity ${this.options.transitionDuration}`,
      opacity: '0'
    });
    document.body.appendChild(this.overlay);

    // Cria a caixa de destaque em volta do elemento
    this.highlightBox = document.createElement('div');
    Object.assign(this.highlightBox.style, {
      position: 'fixed',
      border: this.options.highlightBorder,
      boxSizing: 'border-box',
      zIndex: '10000',
      pointerEvents: 'none',
      transition: `all ${this.options.transitionDuration}`,
      display: 'none'
    });
    document.body.appendChild(this.highlightBox);

    // Cria a caixa de tooltip (texto)
    this.textBox = document.createElement('div');
    Object.assign(this.textBox.style, {
      position: 'fixed',
      zIndex: '10001'
    });
    this.applyStyles(this.textBox, this.options.textBoxStyles);
    this.textBox.style.display = 'none';

    // Cria o conteúdo de texto da tooltip
    this.textContent = document.createElement('div');
    this.textContent.style.marginBottom = '10px';

    // Cria o conteúdo de imagem (opcional)
    this.imageContent = document.createElement('img');
    Object.assign(this.imageContent.style, {
      width: '100%',
      height: 'auto',
      borderRadius: '5px',
      marginBottom: '10px',
      display: 'none'
    });

    // Cria o container para os botões de navegação
    this.buttonsContainer = document.createElement('div');
    this.buttonsContainer.style.marginTop = '10px';
    this.buttonsContainer.style.display = 'flex';
    this.buttonsContainer.style.flexWrap = 'wrap';
    this.buttonsContainer.style.justifyContent = 'flex-end';
    this.buttonsContainer.style.gap = '5px';

    // Botão "Anterior"
    this.prevBtn = document.createElement('button');
    this.prevBtn.innerText = 'Anterior';
    this.prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.prev();
    });

    // Botão "Próximo"
    this.nextBtn = document.createElement('button');
    this.nextBtn.innerText = 'Próximo';
    this.nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.next();
    });

    // Botão "Fechar"
    this.closeBtn = document.createElement('button');
    this.closeBtn.innerText = 'Fechar';
    this.closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.stop();
    });

    [this.prevBtn, this.nextBtn, this.closeBtn].forEach(btn => {
      btn.style.padding = '10px 15px';
      btn.style.minWidth = '80px';
    });

    this.buttonsContainer.appendChild(this.prevBtn);
    this.buttonsContainer.appendChild(this.nextBtn);
    this.buttonsContainer.appendChild(this.closeBtn);

    // Monta a tooltip com texto, imagem e botões
    this.textBox.appendChild(this.textContent);
    this.textBox.appendChild(this.imageContent);
    this.textBox.appendChild(this.buttonsContainer);

    // Bind dos métodos e adição dos event listeners para resize e scroll
    this.handleResize = this.handleResize.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleResize);
  }

  /**
   * Aplica estilos CSS a um elemento com base em um objeto de estilos.
   */
  applyStyles(element, styles) {
    for (const key in styles) {
      element.style[key] = styles[key];
    }
  }

  /**
   * Exibe a interface do tour e adiciona o listener de teclado.
   */
  showUI() {
    if (!document.body.contains(this.textBox)) {
      document.body.appendChild(this.textBox);
    }
    this.overlay.style.opacity = '1';
    this.highlightBox.style.display = 'block';
    this.textBox.style.display = 'block';
    document.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Esconde a interface do tour e remove o listener de teclado.
   */
  hideUI() {
    this.overlay.style.opacity = '0';
    this.highlightBox.style.display = 'none';
    this.textBox.style.display = 'none';
    this.imageContent.style.display = 'none';
    this.imageContent.src = '';
    this.textBox.style.flexDirection = 'column';
    this.textBox.style.alignItems = 'flex-start';
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Inicia o tour guiado.
   */
  start() {
    if (!this.steps.length) {
      console.error('Nenhum passo definido para destacar!');
      return;
    }
    
    // Inicialmente, aplica o efeito “dim” a todos os campos
    this.steps.forEach(step => {
      const selector = `[data-helper="${step.dataHelper}"]`;
      const element = document.querySelector(selector);
      if (element) {
        element.setAttribute('data-dimmed', 'true');
        element.style.pointerEvents = 'none';
      }
    });

    this.currentStepIndex = 0;
    this.showUI();
    this.highlightCurrentStep();
  }

  /**
   * Destaca o elemento do passo atual, remove o efeito “dim” nele e aplica aos demais.
   */
  highlightCurrentStep() {
    const step = this.steps[this.currentStepIndex];
    const selector = `[data-helper="${step.dataHelper}"]`;
    const element = document.querySelector(selector);

    if (!element) {
      console.error(`Elemento não encontrado com data-helper="${step.dataHelper}"`);
      this.next();
      return;
    }

    // Remove o efeito "dim" somente do elemento atual e habilita sua interação
    element.removeAttribute('data-dimmed');
    element.style.pointerEvents = 'auto';

    // Aplica o efeito "dim" em todos os demais elementos
    this.steps.forEach((s, idx) => {
      if (idx !== this.currentStepIndex) {
        const sel = `[data-helper="${s.dataHelper}"]`;
        const el = document.querySelector(sel);
        if (el) {
          el.setAttribute('data-dimmed', 'true');
          el.style.pointerEvents = 'none';
        }
      }
    });

    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

    requestAnimationFrame(() => {
      const rect = element.getBoundingClientRect();

      Object.assign(this.highlightBox.style, {
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`
      });

      this.textContent.innerText = step.text || '';

      // Reconstrói o conteúdo da tooltip
      this.textBox.innerHTML = '';
      this.textBox.appendChild(this.textContent);
      this.textBox.appendChild(this.imageContent);
      this.textBox.appendChild(this.buttonsContainer);

      if (step.imagem) {
        this.imageContent.style.display = 'block';
        this.imageContent.style.width = step.imagemWidth || '100%';
        this.imageContent.style.height = step.imagemHeight || 'auto';

        if (step.imagemOrder === 'before') {
          this.textBox.insertBefore(this.imageContent, this.textContent);
        } else if (step.imagemOrder === 'after') {
          this.textBox.insertBefore(this.imageContent, this.buttonsContainer);
        }

        if (step.imagemCentered) {
          this.textBox.style.alignItems = 'center';
          this.imageContent.style.margin = '0 auto 10px auto';
          this.textContent.style.textAlign = 'center';
        } else {
          this.textBox.style.alignItems = 'flex-start';
          this.imageContent.style.margin = '0 0 10px 0';
          this.textContent.style.textAlign = 'left';
        }

        const imageLoadHandler = () => {
          this.positionTextBox(rect, step.position || 'right');
          this.imageContent.removeEventListener('load', imageLoadHandler);
        };
        this.imageContent.addEventListener('load', imageLoadHandler);
        this.imageContent.src = step.imagem;
        if (this.imageContent.complete) {
          imageLoadHandler();
        }
      } else {
        this.imageContent.src = '';
        this.imageContent.style.display = 'none';
        this.positionTextBox(rect, step.position || 'right');
      }

      this.prevBtn.style.display = this.currentStepIndex === 0 ? 'none' : 'inline-block';
      this.nextBtn.innerText =
        this.currentStepIndex === this.steps.length - 1 ? 'Concluir' : 'Próximo';

      // Se estiver usando o modo highlightTransparent, armazena o z-index original e aplica um novo
      if (this.options.highlightTransparent) {
        if (!this.originalZIndices.has(element)) {
          const originalZ = window.getComputedStyle(element).zIndex;
          this.originalZIndices.set(element, originalZ === 'auto' ? '' : originalZ);
        }
        element.style.zIndex = '10000';
        if (window.getComputedStyle(element).position === 'static') {
          element.style.position = 'relative';
        }
      }
    });
  }

  /**
   * Posiciona a tooltip com base na posição desejada.
   */
  positionTextBox(rect, position) {
    const padding = 10;
    let top = rect.top;
    let left = rect.left;

    // Oculta temporariamente para medir as dimensões
    this.textBox.style.visibility = 'hidden';
    const tooltipWidth = this.textBox.offsetWidth;
    const tooltipHeight = this.textBox.offsetHeight;
    this.textBox.style.visibility = 'visible';

    switch (position) {
      case 'top':
        top = rect.top - tooltipHeight - padding;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left + rect.width + padding;
        break;
      case 'bottom':
        top = rect.top + rect.height + padding;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - padding;
        break;
      default:
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left + rect.width + padding;
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    if (left + tooltipWidth > viewportWidth) {
      left = viewportWidth - tooltipWidth - padding;
    }
    if (left < padding) {
      left = padding;
    }
    if (top + tooltipHeight > viewportHeight) {
      top = viewportHeight - tooltipHeight - padding;
    }
    if (top < padding) {
      top = padding;
    }

    this.textBox.style.top = `${top}px`;
    this.textBox.style.left = `${left}px`;
  }

  /**
   * Avança para o próximo passo.
   */
  next() {
    this.blockCurrentElement();
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.highlightCurrentStep();
    } else {
      this.stop();
    }
  }

  /**
   * Retorna para o passo anterior.
   */
  prev() {
    if (this.currentStepIndex > 0) {
      this.blockCurrentElement();
      this.currentStepIndex--;
      this.highlightCurrentStep();
    }
  }

  /**
   * Bloqueia o elemento atual definindo pointer-events para 'none'
   * e reativa o efeito "dim" nele.
   */
  blockCurrentElement() {
    const step = this.steps[this.currentStepIndex];
    const selector = `[data-helper="${step.dataHelper}"]`;
    const element = document.querySelector(selector);
    if (element) {
      element.style.pointerEvents = 'none';
      // Aplica novamente o efeito "dim" se não estiver selecionado
      element.setAttribute('data-dimmed', 'true');
    }
  }

  /**
   * Encerra o tour:
   * - Restaura os z-index originais dos elementos destacados;
   * - Reabilita a interatividade dos campos;
   * - Remove os elementos adicionados e os event listeners.
   */
  stop() {
    // Restaura o z-index dos elementos destacados
    if (this.options.highlightTransparent) {
      for (const [element, originalZ] of this.originalZIndices.entries()) {
        element.style.zIndex = originalZ;
        element.removeAttribute('data-dimmed');
      }
      this.originalZIndices.clear();
    }

    // Reabilita a interatividade de todos os campos do tour
    this.steps.forEach(step => {
      const selector = `[data-helper="${step.dataHelper}"]`;
      const element = document.querySelector(selector);
      if (element) {
        element.style.pointerEvents = 'auto';
        element.removeAttribute('data-dimmed');
      }
    });

    // Executa a função onFinish (se definida)
    if (typeof this.options.onFinish === 'function') {
      this.options.onFinish();
    }

    // Remove todos os elementos e listeners adicionados pelo guia
    this.destroy();
  }

  /**
   * Remove os event listeners e os elementos (overlay, highlightBox, textBox) do DOM.
   */
  destroy() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleResize);
    document.removeEventListener('keydown', this.handleKeyDown);
    if (this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    if (this.highlightBox.parentNode) {
      this.highlightBox.parentNode.removeChild(this.highlightBox);
    }
    if (this.textBox.parentNode) {
      this.textBox.parentNode.removeChild(this.textBox);
    }
  }

  /**
   * Atualiza a posição do destaque e da tooltip ao redimensionar ou rolar a página.
   */
  handleResize() {
    if (this.textBox.style.display === 'none') return;
    if (!this.steps.length || this.currentStepIndex >= this.steps.length) return;
    const step = this.steps[this.currentStepIndex];
    const selector = `[data-helper="${step.dataHelper}"]`;
    const element = document.querySelector(selector);
    if (!element) return;
    const rect = element.getBoundingClientRect();
    Object.assign(this.highlightBox.style, {
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`
    });
    this.positionTextBox(rect, step.position || 'right');
  }

  /**
   * Lida com os eventos de teclado para navegação.
   */
  handleKeyDown(event) {
    switch (event.key) {
      case 'ArrowRight':
      case 'Enter':
        this.next();
        break;
      case 'ArrowLeft':
        this.prev();
        break;
      case 'Escape':
        this.stop();
        break;
    }
  }
}