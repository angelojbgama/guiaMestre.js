document.addEventListener('DOMContentLoaded', () => {
    const steps = [
      { dataHelper: 'nome', text: 'Digite seu nome completo aqui.', position: 'right' },
      { dataHelper: 'cpf', text: 'Insira seu CPF com pontos e hífen.', position: 'right' },
      { dataHelper: 'rg', text: 'Informe seu RG.', position: 'right' },
      { dataHelper: 'data_nascimento', text: 'Escolha sua data de nascimento.', position: 'top' },
      { dataHelper: 'sexo', text: 'Selecione seu sexo.', position: 'right' },
      { dataHelper: 'nacionalidade', text: 'Selecione sua nacionalidade.', position: 'bottom' },
      { dataHelper: 'email', text: 'Digite seu e-mail.', position: 'top' },
      { dataHelper: 'telefone', text: 'Insira seu telefone para contato.', position: 'right' },
      { dataHelper: 'logradouro', text: 'Informe o logradouro do seu endereço.', position: 'bottom' },
      { dataHelper: 'numero', text: 'Digite o número do seu endereço.', position: 'bottom' },
      { dataHelper: 'complemento', text: 'Informe o complemento, se houver.', position: 'bottom' },
      { dataHelper: 'bairro', text: 'Digite o bairro onde você reside.', position: 'bottom' },
      { dataHelper: 'cidade', text: 'Informe a cidade do seu endereço.', position: 'right' },
      { dataHelper: 'estado', text: 'Selecione o estado onde mora.', position: 'bottom' },
      { dataHelper: 'cep', text: 'Insira seu CEP.', position: 'left' },
      { dataHelper: 'cargo', text: 'Digite o cargo que você ocupa.', position: 'right' },
      { dataHelper: 'departamento', text: 'Selecione o departamento em que trabalha.', position: 'bottom' },
      { dataHelper: 'salario', text: 'Informe seu salário.', position: 'top' },
      { dataHelper: 'data_admissao', text: 'Escolha a data de sua admissão.', position: 'top' },
      { dataHelper: 'documento_trabalho', text: 'Insira o número da CTPS.', position: 'right' },
      { dataHelper: 'website', text: 'Se tiver, informe seu website ou portfólio.', position: 'right' },
      { dataHelper: 'foto',
        text: 'Aqui você pode fazer o upload de sua foto. Veja o exemplo da imagem abaixo.',
        position: 'bottom',
        imagem: 'https://c.tenor.com/UwWOOIM6UPMAAAAC/tenor.gif',
        imagemWidth: '150px',
        imagemHeight: 'auto',
        imagemOrder: 'after',
        imagemCentered: true},
      { dataHelper: 'observacoes', text: 'Adicione observações adicionais, se necessário.', position: 'right' }
    ];

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
      onFinish: () => { alert('Tour finalizado!'); }
    };

    const startButton = document.getElementById('startHelper');
    startButton.addEventListener('click', () => {
      // Cria uma nova instância a cada clique para garantir que os estilos sejam reativados
      window.myHelperInstance = new EnhancedHelper(steps, helperOptions);
      window.myHelperInstance.start();
    });
  });
