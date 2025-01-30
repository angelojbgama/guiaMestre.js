// guiaMestre.js

// EnhancedHelper.js
class EnhancedHelper {
    constructor(steps = [], options = {}) {
        /**
         * steps: Array de objetos que definem cada passo do tour.
         * Cada objeto pode conter:
         *   - helper: string (valor do atributo helper para selecionar o elemento)
         *   - text: string (texto a ser exibido no tooltip)
         *   - position: 'top' | 'right' | 'bottom' | 'left' (posição do tooltip em relação ao elemento)
         *   - imagem: string (URL da imagem opcional a ser exibida no tooltip)
         *   - imagemWidth: string (largura da imagem, ex: '200px')
         *   - imagemHeight: string (altura da imagem, ex: 'auto')
         *   - imagemOrder: 'before' | 'after' (ordem da imagem em relação ao texto)
         *   - imagemCentered: boolean (se a imagem deve ser centralizada)
         *
         * options: Objeto para configurar o comportamento e estilo do tour.
         *   - overlayColor: string (cor do overlay, em rgba ou hex)
         *   - highlightBorder: string (estilo da borda do destaque)
         *   - transitionDuration: string (duração das transições CSS)
         *   - textBoxStyles: objeto (estilos personalizados para a caixa de texto)
         *   - highlightTransparent: boolean (se verdadeiro, mantém a cor original do elemento destacado)
         *   - onFinish: function (callback a ser executado quando o tour finalizar)
         */
        
        this.steps = steps; // Armazena os passos do tour
        this.currentStepIndex = 0; // Índice do passo atual

        // Define as opções padrão, permitindo sobrescrever com o objeto options fornecido
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
                alignItems: 'flex-start', // Alinhamento padrão
                ...options.textBoxStyles // Permite sobrescrever estilos
            },
            highlightTransparent: options.highlightTransparent || false,
            onFinish: options.onFinish || null,
        };

        // Mapa para armazenar os z-indices originais dos elementos destacados
        this.originalZIndices = new Map();

        // Conjunto para armazenar elementos já dimming (escurecidos)
        this.dimmedElements = new Set();

        // Cria o overlay que escurece o fundo
        this.overlay = document.createElement('div');
        this.overlay.style.position = 'fixed';
        this.overlay.style.top = '0';
        this.overlay.style.left = '0';
        this.overlay.style.width = '100%';
        this.overlay.style.height = '100%';
        this.overlay.style.backgroundColor = this.options.overlayColor;
        this.overlay.style.pointerEvents = 'none'; // Permite interações com elementos abaixo
        this.overlay.style.zIndex = '9998';
        this.overlay.style.transition = `opacity ${this.options.transitionDuration}`;
        this.overlay.style.opacity = '0'; // Inicialmente transparente
        document.body.appendChild(this.overlay); // Adiciona o overlay ao body

        // Cria a caixa de destaque ao redor do elemento atual
        this.highlightBox = document.createElement('div');
        this.highlightBox.style.position = 'fixed';
        this.highlightBox.style.border = this.options.highlightBorder;
        this.highlightBox.style.boxSizing = 'border-box';
        this.highlightBox.style.zIndex = '10000'; // Acima do overlay
        this.highlightBox.style.pointerEvents = 'none'; // Não captura eventos
        this.highlightBox.style.transition = `all ${this.options.transitionDuration}`;
        this.highlightBox.style.display = 'none'; // Inicialmente escondida
        document.body.appendChild(this.highlightBox); // Adiciona a caixa de destaque ao body

        // Cria a caixa de texto (tooltip) que exibirá as informações do passo
        this.textBox = document.createElement('div');
        this.textBox.style.position = 'fixed';
        this.textBox.style.zIndex = '10001'; // Acima da highlightBox
        this.applyStyles(this.textBox, this.options.textBoxStyles); // Aplica estilos personalizados
        this.textBox.style.display = 'none'; // Inicialmente escondida

        // Cria o conteúdo de texto dentro da caixa de texto
        this.textContent = document.createElement('div');
        this.textContent.style.marginBottom = '10px';

        // Cria o conteúdo de imagem (opcional) dentro da caixa de texto
        this.imageContent = document.createElement('img');
        this.imageContent.style.width = '100%'; // Ajusta a largura conforme necessário
        this.imageContent.style.height = 'auto';
        this.imageContent.style.borderRadius = '5px';
        this.imageContent.style.marginBottom = '10px';
        this.imageContent.style.display = 'none'; // Inicialmente escondida

        // Cria o container para os botões de navegação dentro da caixa de texto
        this.buttonsContainer = document.createElement('div');
        this.buttonsContainer.style.marginTop = '10px';
        this.buttonsContainer.style.textAlign = 'right';

        // Cria o botão "Anterior"
        this.prevBtn = document.createElement('button');
        this.prevBtn.innerText = 'Anterior';
        this.prevBtn.style.marginRight = '5px';
        this.prevBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que o evento se propague
            this.prev(); // Chama o método para ir para o passo anterior
        });

        // Cria o botão "Próximo"
        this.nextBtn = document.createElement('button');
        this.nextBtn.innerText = 'Próximo';
        this.nextBtn.style.marginRight = '5px';
        this.nextBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que o evento se propague
            this.next(); // Chama o método para ir para o próximo passo
        });

        // Cria o botão "Fechar"
        this.closeBtn = document.createElement('button');
        this.closeBtn.innerText = 'Fechar';
        this.closeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que o evento se propague
            this.stop(); // Chama o método para encerrar o tour
        });

        // Adiciona os botões ao container de botões
        this.buttonsContainer.appendChild(this.prevBtn);
        this.buttonsContainer.appendChild(this.nextBtn);
        this.buttonsContainer.appendChild(this.closeBtn);

        // Monta a textBox com texto, imagem e botões
        this.textBox.appendChild(this.textContent);
        this.textBox.appendChild(this.imageContent); // Adiciona a imagem (se houver)
        this.textBox.appendChild(this.buttonsContainer);
        document.body.appendChild(this.textBox); // Adiciona a caixa de texto ao body

        // Bind para garantir que o contexto de 'this' seja mantido no evento de resize
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize); // Adiciona o listener de resize

        // Adiciona estilos para a classe 'dimmed' que escurece elementos
        const style = document.createElement('style');
        style.innerHTML = `
            .dimmed {
                opacity: 0.3;
                transition: opacity 0.3s;
            }
        `;
        document.head.appendChild(style); // Adiciona o estilo ao head
    }

    /**
     * Aplica estilos CSS a um elemento com base em um objeto de estilos.
     * @param {HTMLElement} element - O elemento a ser estilizado.
     * @param {Object} styles - Objeto contendo pares de propriedade e valor CSS.
     */
    applyStyles(element, styles) {
        Object.keys(styles).forEach((key) => {
            element.style[key] = styles[key];
        });
    }

    /**
     * Exibe a interface do tour (overlay, highlightBox e textBox).
     */
    showUI() {
        this.overlay.style.opacity = '1'; // Torna o overlay visível
        this.highlightBox.style.display = 'block'; // Exibe a caixa de destaque
        this.textBox.style.display = 'block'; // Exibe a caixa de texto
    }

    /**
     * Esconde a interface do tour e reseta elementos.
     */
    hideUI() {
        this.overlay.style.opacity = '0'; // Torna o overlay transparente
        this.highlightBox.style.display = 'none'; // Esconde a caixa de destaque
        this.textBox.style.display = 'none'; // Esconde a caixa de texto

        // Esconde a imagem e reseta seu src
        this.imageContent.style.display = 'none';
        this.imageContent.src = '';
        // Remove estilos de tamanho da imagem
        this.imageContent.style.width = '100%';
        this.imageContent.style.height = 'auto';

        // Reseta a direção e alinhamento do textBox
        this.textBox.style.flexDirection = 'column';
        this.textBox.style.alignItems = 'flex-start';
    }

    /**
     * Inicia o tour guiado.
     */
    start() {
        if (!this.steps.length) { // Verifica se há passos definidos
            console.error('Nenhum passo definido para destacar!');
            return;
        }
        this.currentStepIndex = 0; // Define o passo atual para o primeiro
        this.dimAllElements(); // Escurece todos os elementos do tour
        this.showUI(); // Exibe a interface do tour
        this.highlightCurrentStep(); // Destaca o primeiro passo
    }

    /**
     * Destaca o elemento correspondente ao passo atual e atualiza a interface.
     */
    highlightCurrentStep() {
        const step = this.steps[this.currentStepIndex];
        const selector = `[helper="${step.helper}"]`;
        const element = document.querySelector(selector);

        if (!element) {
            console.error(`Elemento não encontrado com helper="${step.helper}"`);
            this.next();
            return;
        }

        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

        setTimeout(() => {
            const rect = element.getBoundingClientRect();

            this.highlightBox.style.top = `${rect.top}px`;
            this.highlightBox.style.left = `${rect.left}px`;
            this.highlightBox.style.width = `${rect.width}px`;
            this.highlightBox.style.height = `${rect.height}px`;

            this.textContent.innerText = step.text || '';

            // Resetando o conteúdo da textBox
            this.textBox.innerHTML = '';
            this.textBox.appendChild(this.textContent);
            this.textBox.appendChild(this.imageContent);
            this.textBox.appendChild(this.buttonsContainer);

            // Configurando a ordem e alinhamento da imagem e do texto
            if (step.imagem) {
                this.imageContent.style.display = 'block';
                this.imageContent.style.width = step.imagemWidth || '100%';
                this.imageContent.style.height = step.imagemHeight || 'auto';

                // Configura a ordem da imagem
                if (step.imagemOrder === 'before') {
                    this.textBox.insertBefore(this.imageContent, this.textContent);
                } else if (step.imagemOrder === 'after') {
                    this.textBox.insertBefore(this.imageContent, this.buttonsContainer);
                }

                // Configura o alinhamento da imagem
                if (step.imagemCentered) {
                    this.textBox.style.alignItems = 'center'; // Centraliza os itens
                    this.imageContent.style.margin = '0 auto 10px auto'; // Centraliza a imagem
                    this.textContent.style.textAlign = 'center'; // Centraliza o texto
                } else {
                    this.textBox.style.alignItems = 'flex-start'; // Alinha à esquerda
                    this.imageContent.style.margin = '0 0 10px 0'; // Margem padrão
                    this.textContent.style.textAlign = 'left'; // Alinha o texto à esquerda
                }

                const imageLoadHandler = () => {
                    this.positionTextBox(rect, step.position || 'right');
                    this.imageContent.removeEventListener('load', imageLoadHandler);
                };

                this.imageContent.addEventListener('load', imageLoadHandler);
                this.imageContent.src = step.imagem;

                // Se a imagem já estiver carregada (cache), chama imediatamente
                if (this.imageContent.complete) {
                    imageLoadHandler();
                }
            } else {
                this.imageContent.src = '';
                this.imageContent.style.display = 'none';
                this.positionTextBox(rect, step.position || 'right');
            }

            this.prevBtn.style.display = this.currentStepIndex === 0 ? 'none' : 'inline-block';
            this.nextBtn.innerText = (this.currentStepIndex === this.steps.length - 1) ? 'Concluir' : 'Próximo';

            if (this.options.highlightTransparent) {
                element.classList.remove('dimmed');
                this.dimmedElements.delete(element);

                if (!this.originalZIndices.has(element)) {
                    const originalZ = window.getComputedStyle(element).zIndex;
                    this.originalZIndices.set(element, originalZ === 'auto' ? '' : originalZ);
                }

                element.style.zIndex = '10000';

                const computedPosition = window.getComputedStyle(element).position;
                if (computedPosition === 'static') {
                    element.style.position = 'relative';
                }
            }
        }, 500);
    }

    /**
     * Calcula e ajusta a posição da caixa de texto (tooltip) com base na posição desejada.
     * @param {DOMRect} rect - As coordenadas do elemento destacado.
     * @param {string} position - A posição desejada para o tooltip ('top', 'right', 'bottom', 'left').
     */
    positionTextBox(rect, position) {
        const padding = 10; // Espaçamento entre o elemento e o tooltip
        let top = rect.top;
        let left = rect.left;

        // Temporariamente torna a textBox visível para calcular seu tamanho
        this.textBox.style.display = 'block';
        this.textBox.style.visibility = 'hidden'; // Evita que seja visível durante o cálculo

        const tooltipWidth = this.textBox.offsetWidth;
        const tooltipHeight = this.textBox.offsetHeight;

        this.textBox.style.visibility = 'visible'; // Torna visível novamente

        // Calcula a posição com base na posição desejada
        switch (position) {
            case 'top':
                top = top - tooltipHeight - padding;
                left = left + (rect.width / 2) - (tooltipWidth / 2);
                break;
            case 'right':
                top = top + (rect.height / 2) - (tooltipHeight / 2);
                left = left + rect.width + padding;
                break;
            case 'bottom':
                top = top + rect.height + padding;
                left = left + (rect.width / 2) - (tooltipWidth / 2);
                break;
            case 'left':
                top = top + (rect.height / 2) - (tooltipHeight / 2);
                left = left - tooltipWidth - padding;
                break;
            default:
                // Posição padrão: direita
                top = top + (rect.height / 2) - (tooltipHeight / 2);
                left = left + rect.width + padding;
                break;
        }

        // Garante que o tooltip não saia da viewport (área visível da janela)
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

        // Define a posição final da caixa de texto
        this.textBox.style.top = `${top}px`;
        this.textBox.style.left = `${left}px`;
    }

    /**
     * Avança para o próximo passo do tour.
     */
    next() {
        // "Apaga" (escurece) o elemento atual
        this.dimCurrentElement();

        if (this.currentStepIndex < this.steps.length - 1) {
            this.currentStepIndex++; // Incrementa o índice do passo atual
            this.highlightCurrentStep(); // Destaca o próximo passo
        } else {
            // Se estamos no último passo, encerra o tour
            this.stop();
        }
    }

    /**
     * Retorna para o passo anterior do tour.
     */
    prev() {
        if (this.currentStepIndex > 0) {
            // "Apaga" (escurece) o elemento atual
            this.dimCurrentElement();

            this.currentStepIndex--; // Decrementa o índice do passo atual
            this.highlightCurrentStep(); // Destaca o passo anterior
        }
    }

    /**
     * Encerra o tour, removendo todos os destaques e resetando estados.
     */
    stop() {
        // Remove o z-index modificado dos elementos, se houver
        if (this.options.highlightTransparent) {
            for (let [element, originalZ] of this.originalZIndices.entries()) {
                element.style.zIndex = originalZ; // Restaura o z-index original
                element.classList.remove('dimmed'); // Remove a classe 'dimmed'
            }
            this.originalZIndices.clear(); // Limpa o mapa de z-indices originais
        }

        // Remove todas as classes 'dimmed' de outros elementos
        this.removeAllDimmed();

        this.hideUI(); // Esconde a interface do tour
        this.currentStepIndex = 0; // Reseta o índice do passo atual

        // Executa o callback de finalização, se definido
        if (typeof this.options.onFinish === 'function') {
            this.options.onFinish();
        }
    }

    /**
     * Lida com eventos de redimensionamento da janela para ajustar a posição dos elementos destacados.
     */
    handleResize() {
        if (this.steps.length === 0) return; // Se não há passos, não faz nada
        if (this.currentStepIndex >= this.steps.length) return; // Se o índice está fora dos passos, não faz nada

        const step = this.steps[this.currentStepIndex];
        const selector = `[helper="${step.helper}"]`;
        const element = document.querySelector(selector);

        if (!element) return; // Se o elemento não for encontrado, não faz nada

        const rect = element.getBoundingClientRect(); // Obtém as coordenadas do elemento

        // Ajusta a highlightBox para envolver o elemento destacado
        this.highlightBox.style.top = `${rect.top}px`;
        this.highlightBox.style.left = `${rect.left}px`;
        this.highlightBox.style.width = `${rect.width}px`;
        this.highlightBox.style.height = `${rect.height}px`;

        // Reposiciona a caixa de texto com base na nova posição do elemento
        this.positionTextBox(rect, step.position || 'right');
    }

    /**
     * Aplica a classe 'dimmed' ao elemento atual para escurecê-lo.
     */
    dimCurrentElement() {
        if (this.currentStepIndex < 0 || this.currentStepIndex >= this.steps.length) return; // Verifica índices válidos
        const currentStep = this.steps[this.currentStepIndex];
        const currentSelector = `[helper="${currentStep.helper}"]`;
        const currentElement = document.querySelector(currentSelector);

        if (currentElement && !this.dimmedElements.has(currentElement)) {
            currentElement.classList.add('dimmed'); // Adiciona a classe 'dimmed'
            this.dimmedElements.add(currentElement); // Adiciona ao conjunto de elementos dimmed
        }
    }

    /**
     * Aplica a classe 'dimmed' a todos os elementos envolvidos no tour, exceto o primeiro.
     */
    dimAllElements() {
        // Escurece todos os elementos do tour
        this.steps.forEach(step => {
            const selector = `[helper="${step.helper}"]`;
            const element = document.querySelector(selector);
            if (element) {
                element.classList.add('dimmed'); // Adiciona a classe 'dimmed'
                this.dimmedElements.add(element); // Adiciona ao conjunto de elementos dimmed
            }
        });

        // Remove a classe 'dimmed' do primeiro passo para destacar
        if (this.steps.length > 0) {
            const firstStep = this.steps[0];
            const selector = `[helper="${firstStep.helper}"]`;
            const firstElement = document.querySelector(selector);
            if (firstElement) {
                firstElement.classList.remove('dimmed'); // Remove a classe 'dimmed'
                this.dimmedElements.delete(firstElement); // Remove do conjunto de elementos dimmed
            }
        }
    }

    /**
     * Remove a classe 'dimmed' de todos os elementos que foram escurecidos.
     */
    removeAllDimmed() {
        // Remove a classe 'dimmed' de todos os elementos
        this.dimmedElements.forEach(element => {
            element.classList.remove('dimmed');
        });
        this.dimmedElements.clear(); // Limpa o conjunto de elementos dimmed
    }
}
