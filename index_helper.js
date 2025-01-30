// index_helper.js

document.addEventListener('DOMContentLoaded', () => { // Aguarda o carregamento completo do DOM
  // Definição dos passos do tour usando o atributo helper
  const steps = [
      {
          helper: 'bloco1', // Seleciona o elemento com helper="bloco1"
          text: 'Este é o primeiro bloco azul. Clique em "Próximo" para continuar.', // Texto do tooltip
          position: 'bottom' // Posição do tooltip em relação ao elemento
      },
      {
          helper: 'bloco2', // Seleciona o elemento com helper="bloco2"
          text: 'Este é o segundo bloco azul. Clique em "Próximo" para continuar.',
          position: 'bottom'
      },
      {
          helper: 'nome', // Seleciona o elemento com helper="nome"
          text: 'Aqui você pode digitar seu nome!', // Texto do tooltip
          position: 'right' // Posição do tooltip em relação ao elemento
      },
      {
          helper: 'sobrenome', // Seleciona o elemento com helper="sobrenome"
          text: 'Digite seu sobrenome e clique em "Concluir" para finalizar o tour!', // Texto do tooltip
          position: 'top', // Posição do tooltip em relação ao elemento
          imagem: 'https://c.tenor.com/gpgRaDj_ym4AAAAd/tenor.gif', // URL da imagem opcional a ser exibida no tooltip
          imagemWidth: '19rem', // Largura da imagem (opcional)
          imagemHeight: 'auto'   // Altura da imagem (opcional)
      }
  ];

  // Configurações de estilo centralizadas para o helper
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
      onFinish: () => { // Função de callback executada quando o tour é finalizado
          alert('Tour finalizado!');
      },
      // Adicione outras configurações de estilo aqui, se necessário
  };

  // Instancia o helper com as configurações ajustadas
  const myHelper = new EnhancedHelper(steps, helperOptions);

  // Seleciona o botão para iniciar o tour
  const startButton = document.getElementById('startHelper');
  if (startButton) { // Verifica se o botão existe
      startButton.addEventListener('click', () => { // Adiciona um listener de clique
          myHelper.start(); // Inicia o tour quando o botão é clicado
      });
  } else { // Caso o botão não seja encontrado
      console.error('Botão com ID "startHelper" não encontrado.');
  }
});
