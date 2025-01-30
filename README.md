# guiaMestre.js

**guiaMestre.js** é uma biblioteca JavaScript leve projetada para criar tours interativos e guiados em suas aplicações web. Ela destaca elementos específicos, fornece informações contextuais através de tooltips e oferece controles de navegação para melhorar o onboarding de usuários e a descoberta de funcionalidades.

## Índice

- [Recursos](#recursos)
- [Instalação](#instalação)
- [Uso](#uso)
  - [Configuração HTML](#configuração-html)
  - [Definindo Passos](#definindo-passos)
  - [Inicializando o EnhancedHelper](#inicializando-o-enhancedhelper)
- [Opções de Configuração](#opções-de-configuração)
- [Personalização](#personalização)
- [Exemplo](#exemplo)
- [Referência da API](#referência-da-api)
- [Licença](#licença)

## Recursos

- **Destaque de Elementos**: Enfatiza elementos específicos na página com bordas personalizáveis.
- **Overlay de Fundo**: Aplica um overlay semi-transparente para escurecer o restante da página, focando a atenção nos elementos destacados.
- **Tooltips com Texto e Imagens**: Exibe tooltips informativos adjacentes aos elementos destacados, suportando tanto texto quanto imagens opcionais.
- **Controles de Navegação**: Fornece botões "Anterior", "Próximo" e "Fechar" para navegar pelos passos do tour.
- **Design Responsivo**: Ajusta automaticamente o redimensionamento da janela para manter o posicionamento correto dos destaques e tooltips.
- **Estilos Personalizáveis**: Permite ampla personalização de estilos para overlays, destaques, tooltips e botões.
- **Callback ao Finalizar**: Executa uma função de callback quando o tour é concluído ou fechado.

## Instalação

1. **Baixe a Biblioteca**

   Certifique-se de ter o arquivo `guiaMestre.js` no diretório do seu projeto.

2. **Inclua no Seu HTML**

   ```html
   <script src="caminho/para/guiaMestre.js"></script>
   ```

   Substitua `caminho/para/guiaMestre.js` pelo caminho real para o arquivo `guiaMestre.js`.

## Uso

### Configuração HTML

Adicione o atributo `helper` aos elementos HTML que você deseja destacar durante o tour. Cada atributo `helper` deve ter um identificador único.

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <title>Exemplo GuiaMestre</title>
  <style>
    /* Seus estilos CSS aqui */
  </style>
</head>
<body>
  <div class="container">
    <!-- Elementos a serem destacados -->
    <div class="box" helper="bloco1"></div>
    <div class="box" helper="bloco2"></div>
    <div class="form-group" helper="nome">
      <label for="nome">Nome</label>
      <input type="text" id="nome" />
    </div>
    <div class="form-group" helper="sobrenome">
      <label for="sobrenome">Sobrenome</label>
      <input type="text" id="sobrenome" />
    </div>

    <!-- Botão para iniciar o tour -->
    <button id="startHelper">AJUDA</button>
  </div>

  <!-- Inclua o script EnhancedHelper -->
  <script src="guiaMestre.js"></script>
  <script src="index_helper.js"></script>
</body>
</html>
```

### Definindo Passos

Defina os passos do seu tour especificando o atributo `helper`, o texto descritivo, a posição do tooltip e imagens opcionais.

```javascript
const steps = [
  {
    helper: 'bloco1', // Seleciona o elemento com helper="bloco1"
    text: 'Este é o primeiro bloco azul. Clique em "Próximo" para continuar.', // Texto do tooltip
    position: 'bottom' // Posição do tooltip em relação ao elemento
  },
  {
    helper: 'bloco2',
    text: 'Este é o segundo bloco azul. Clique em "Próximo" para continuar.',
    position: 'bottom'
  },
  {
    helper: 'nome',
    text: 'Aqui você pode digitar seu nome!',
    position: 'right'
  },
  {
    helper: 'sobrenome',
    text: 'Digite seu sobrenome e clique em "Concluir" para finalizar o tour!',
    position: 'top',
    imagem: 'https://c.tenor.com/gpgRaDj_ym4AAAAd/tenor.gif', // URL da imagem opcional
    imagemWidth: '2rem', // Largura da imagem (opcional)
    imagemHeight: 'auto'   // Altura da imagem (opcional)
  }
];
```

### Inicializando o EnhancedHelper

Inicialize o `EnhancedHelper` com os passos definidos e as configurações opcionais.

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const helperOptions = {
    overlayColor: 'rgba(0, 0, 0, 0.5)', // Cor do overlay
    highlightBorder: '4px dashed #ff0000', // Estilo da borda de destaque
    transitionDuration: '0.3s', // Duração das transições CSS
    highlightTransparent: true, // Mantém a cor original do elemento destacado
    textBoxStyles: {
      padding: '15px',
      backgroundColor: '#fff',
      color: '#333',
      borderRadius: '8px',
      maxWidth: '300px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px'
    },
    onFinish: () => { // Função de callback executada ao finalizar o tour
      alert('Tour finalizado!');
    }
  };

  const myHelper = new EnhancedHelper(steps, helperOptions);

  const startButton = document.getElementById('startHelper');
  if (startButton) {
    startButton.addEventListener('click', () => {
      myHelper.start(); // Inicia o tour quando o botão é clicado
    });
  } else {
    console.error('Botão com ID "startHelper" não encontrado.');
  }
});
```

## Opções de Configuração

A classe `EnhancedHelper` aceita dois parâmetros: `steps` e `options`.

### Passos

Um array de objetos que define cada parte do tour.

- **helper**: `string` *(obrigatório)*  
  O valor do atributo `helper` usado para selecionar o elemento a ser destacado.

- **text**: `string` *(obrigatório)*  
  O texto descritivo exibido no tooltip.

- **position**: `'top' | 'right' | 'bottom' | 'left'` *(opcional)*  
  A posição do tooltip em relação ao elemento destacado.

- **imagem**: `string` *(opcional)*  
  URL de uma imagem a ser exibida dentro do tooltip.

- **imagemWidth**: `string` *(opcional)*  
  Largura da imagem (exemplo: `'200px'`).

- **imagemHeight**: `string` *(opcional)*  
  Altura da imagem (exemplo: `'auto'`).

### Opções

Um objeto para personalizar o comportamento e a aparência do tour.

- **overlayColor**: `string` *(padrão: `'rgba(0, 0, 0, 0.7)'`)*  
  A cor do overlay de fundo.

- **highlightBorder**: `string` *(padrão: `'3px dashed #ff0000'`)*  
  O estilo da borda do elemento destacado.

- **transitionDuration**: `string` *(padrão: `'0.3s'`)*  
  A duração das transições CSS para animações suaves.

- **textBoxStyles**: `object` *(padrão: estilos pré-definidos)*  
  Estilos personalizados para a caixa de texto (tooltip). Permite sobrescrever estilos padrão.

- **highlightTransparent**: `boolean` *(padrão: `false`)*  
  Se `true`, mantém a cor original do elemento destacado ao invés de escurecê-lo.

- **onFinish**: `function` *(padrão: `null`)*  
  Uma função de callback executada quando o tour é finalizado ou fechado.

## Personalização

Você pode personalizar extensivamente a aparência e o comportamento do tour modificando o objeto `options`. Isso inclui mudar cores, bordas, durações de transição e estilos de tooltip para combinar com a linguagem de design da sua aplicação.

### Exemplo: Personalizando Estilos do Tooltip

```javascript
const helperOptions = {
  // ... outras opções
  textBoxStyles: {
    padding: '20px',
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: '10px',
    maxWidth: '400px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.4)',
    fontFamily: 'Helvetica, sans-serif',
    fontSize: '16px'
  },
  // ... outras opções
};
```

## Exemplo

Aqui está um exemplo completo integrando HTML, CSS e JavaScript para criar um tour guiado usando `guiaMestre.js`.

### HTML (`index.html`)

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <title>Exemplo GuiaMestre</title>
  <style>
    /* Zera margens e paddings */
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
    }

    /* Container flex para centralizar conteúdo */
    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f0f0f0;
    }

    /* Estilo para caixas */
    .box {
      width: 100px;
      height: 100px;
      margin: 20px;
      background-color: lightblue;
      display: inline-block;
    }

    /* Estilos para grupos de formulário */
    .form-group {
      margin: 1rem 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    /* Estilos para labels */
    label {
      margin-bottom: 5px;
      font-weight: bold;
    }

    /* Estilos para inputs */
    input {
      padding: 5px;
      width: 200px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    /* Estilos para botões */
    button {
      padding: 10px 20px;
      margin-top: 20px;
      border: none;
      border-radius: 4px;
      background-color: #007BFF;
      color: white;
      cursor: pointer;
      font-size: 16px;
    }

    /* Efeito de hover para botões */
    button:hover {
      background-color: #0056b3;
    }

    /* Estilos para elementos dimmed (escurecidos) */
    .dimmed {
      opacity: 0.3;
      transition: opacity 0.3s;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Elementos a serem destacados com atributos helper únicos -->
    <div class="box" helper="bloco1"></div>
    <div class="box" helper="bloco2"></div>
    <div class="form-group" helper="nome">
      <label for="nome">Nome</label>
      <input type="text" id="nome" />
    </div>
    <div class="form-group" helper="sobrenome">
      <label for="sobrenome">Sobrenome</label>
      <input type="text" id="sobrenome" />
    </div>

    <!-- Botão para iniciar o tour -->
    <button id="startHelper">AJUDA</button>
  </div>

  <!-- Inclua o script EnhancedHelper -->
  <script src="guiaMestre.js"></script>
  <script src="index_helper.js"></script>
</body>
</html>
```

### JavaScript (`index_helper.js`)

```javascript
// index_helper.js

document.addEventListener('DOMContentLoaded', () => {
  // Define os passos do tour
  const steps = [
    {
      helper: 'bloco1',
      text: 'Este é o primeiro bloco azul. Clique em "Próximo" para continuar.',
      position: 'bottom'
    },
    {
      helper: 'bloco2',
      text: 'Este é o segundo bloco azul. Clique em "Próximo" para continuar.',
      position: 'bottom'
    },
    {
      helper: 'nome',
      text: 'Aqui você pode digitar seu nome!',
      position: 'right'
    },
    {
      helper: 'sobrenome',
      text: 'Digite seu sobrenome e clique em "Concluir" para finalizar o tour!',
      position: 'top',
      imagem: 'https://c.tenor.com/gpgRaDj_ym4AAAAd/tenor.gif',
      imagemWidth: '2rem',
      imagemHeight: 'auto'
    }
  ];

  // Opções de configuração para o helper
  const helperOptions = {
    overlayColor: 'rgba(0, 0, 0, 0.5)',
    highlightBorder: '4px dashed #ff0000',
    transitionDuration: '0.3s',
    highlightTransparent: true,
    textBoxStyles: {
      padding: '15px',
      backgroundColor: '#fff',
      color: '#333',
      borderRadius: '8px',
      maxWidth: '300px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px'
    },
    onFinish: () => {
      alert('Tour finalizado!');
    }
  };

  // Instancia o EnhancedHelper com os passos e opções
  const myHelper = new EnhancedHelper(steps, helperOptions);

  // Seleciona o botão de início e adiciona um evento de clique para iniciar o tour
  const startButton = document.getElementById('startHelper');
  if (startButton) {
    startButton.addEventListener('click', () => {
      myHelper.start(); // Inicia o tour quando o botão é clicado
    });
  } else {
    console.error('Botão com ID "startHelper" não encontrado.');
  }
});
```

## Referência da API

### `new EnhancedHelper(steps, options)`

Cria uma nova instância do EnhancedHelper.

- **Parâmetros**:
  - `steps` (`Array`): Um array de objetos de passo definindo cada parte do tour.
  - `options` (`Object`): Opções de configuração para personalizar o comportamento e a aparência do tour.

### Métodos

- **`start()`**

  Inicia o tour guiado.

- **`next()`**

  Avança para o próximo passo do tour.

- **`prev()`**

  Retorna para o passo anterior do tour.

- **`stop()`**

  Encerra o tour, removendo todos os destaques e overlays.

### Objeto de Passo

Cada objeto de passo no array `steps` pode ter as seguintes propriedades:

- **`helper`** (`string`, obrigatório)  
  O valor do atributo `helper` usado para selecionar o elemento a ser destacado.

- **`text`** (`string`, obrigatório)  
  O texto descritivo exibido no tooltip.

- **`position`** (`'top' | 'right' | 'bottom' | 'left'`, opcional)  
  A posição do tooltip em relação ao elemento destacado. Padrão é `'right'`.

- **`imagem`** (`string`, opcional)  
  URL de uma imagem a ser exibida dentro do tooltip.

- **`imagemWidth`** (`string`, opcional)  
  Largura da imagem (exemplo: `'200px'`).

- **`imagemHeight`** (`string`, opcional)  
  Altura da imagem (exemplo: `'auto'`).

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).