// 1. Mostrar/Ocultar Senha
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('ph-eye', 'ph-eye-closed');
    } else {
        input.type = 'password';
        icon.classList.replace('ph-eye-closed', 'ph-eye');
    }
}

// 2. Lógica de Cadastro e Validação
const formCadastro = document.getElementById('form-cadastro');
const senha = document.getElementById('senha');
const confirmaSenha = document.getElementById('confirma-senha');
const erroSenha = document.getElementById('erro-senha');
const emailInput = document.getElementById('email-input');
const emailDisplay = document.getElementById('user-email-display');

formCadastro.addEventListener('submit', function(e) {
    e.preventDefault();
    if (senha.value !== confirmaSenha.value) {
        erroSenha.style.display = 'block';
        senha.style.borderColor = '#CC0000';
        confirmaSenha.style.borderColor = '#CC0000';
        return; 
    }
    erroSenha.style.display = 'none';
    senha.style.borderColor = '#bbb';
    confirmaSenha.style.borderColor = '#bbb';
    emailDisplay.innerText = emailInput.value;

    document.getElementById('tela-cadastro').classList.remove('active');
    document.getElementById('tela-dashboard').classList.add('active');
});

// 3. Lógica do Menu Lateral e Modal de Histórico
const openMenuBtn = document.getElementById('open-menu');
const closeMenuBtn = document.getElementById('close-menu');
const sidebar = document.getElementById('sidebar');
const menuOverlay = document.getElementById('menu-overlay');
const btnSair = document.getElementById('btn-sair');
const btnAbrirHistorico = document.getElementById('btn-abrir-historico');
const modalHistorico = document.getElementById('modal-historico');
const btnCloseHistorico = document.getElementById('btn-close-historico');

function toggleMenu() {
    sidebar.classList.toggle('open');
    menuOverlay.classList.toggle('show');
}

openMenuBtn.addEventListener('click', toggleMenu);
closeMenuBtn.addEventListener('click', toggleMenu);
menuOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    menuOverlay.classList.remove('show');
    modalHistorico.classList.remove('show'); // Fecha histórico se clicar fora
});

btnSair.addEventListener('click', function() {
    toggleMenu(); 
    formCadastro.reset(); 
    document.getElementById('tela-dashboard').classList.remove('active');
    document.getElementById('tela-cadastro').classList.add('active');
});

// Abre Histórico
btnAbrirHistorico.addEventListener('click', () => {
    sidebar.classList.remove('open'); // Fecha o menu lateral
    modalHistorico.classList.remove('hide');
    // Pequeno atraso para a animação do CSS funcionar
    setTimeout(() => { modalHistorico.classList.add('show'); }, 10);
});

// Fecha Histórico
btnCloseHistorico.addEventListener('click', () => {
    modalHistorico.classList.remove('show');
    menuOverlay.classList.remove('show');
});


// 4. Lógica de Empréstimo, Input Manual e Histórico Dinâmico
const btnAction = document.getElementById('btn-action');
const btnText = document.getElementById('btn-text');
const loader = document.getElementById('loader');
const computerNumberDisplay = document.getElementById('computer-number');
const manualPcInput = document.getElementById('manual-pc-input');
const containerInputPc = document.getElementById('container-input-pc');
const toast = document.getElementById('toast');
const checkboxCarregador = document.getElementById('carregador');
const listaHistorico = document.getElementById('lista-historico');

// Array para guardar os históricos
let historicoArray = []; 
let currentPcNumber = null; // Guarda o PC atual em uso

// Função para atualizar a tela de histórico
function atualizarHistorico(acao, numeroPc, carregador) {
    const dataAtual = new Date();
    const horaFormatada = dataAtual.getHours().toString().padStart(2, '0') + ':' + dataAtual.getMinutes().toString().padStart(2, '0');
    
    let textoCarregador = carregador ? " (Com Carregador)" : "";
    let classeLi = acao === 'Devolução' ? 'devolucao' : '';
    let icone = acao === 'Devolução' ? '❌' : '✅';

    const registro = {
        html: `<li class="${classeLi}">${icone} ${acao} - PC ${numeroPc}${textoCarregador} - às ${horaFormatada}</li>`
    };

    historicoArray.unshift(registro); // Adiciona no início da lista (mais recentes primeiro)
    renderizarHistorico();
}

function renderizarHistorico() {
    listaHistorico.innerHTML = ''; // Limpa a lista
    if (historicoArray.length === 0) {
        listaHistorico.innerHTML = '<li class="empty-msg">Nenhum empréstimo realizado ainda.</li>';
        return;
    }
    // Adiciona os itens na tela
    historicoArray.forEach(item => {
        listaHistorico.innerHTML += item.html;
    });
}


btnAction.addEventListener('click', function() {
    btnAction.disabled = true;
    btnText.classList.add('hide');
    loader.classList.remove('hide');

    setTimeout(() => {
        btnAction.disabled = false;
        btnText.classList.remove('hide');
        loader.classList.add('hide');

        if (!btnAction.classList.contains('cancelar')) {
            // ================= MODO REGISTRAR (EMPRÉSTIMO) =================
            
            // Verifica se o usuário digitou algo no input
            let numeroDigitado = manualPcInput.value.trim();

            if (numeroDigitado !== "" && parseInt(numeroDigitado) > 0) {
                // Pega o número digitado
                currentPcNumber = parseInt(numeroDigitado);
            } else {
                // Sorteia um número de 1 a 50 se tiver vazio
                currentPcNumber = Math.floor(Math.random() * 50) + 1;
            }

            // Mostra no display gigante
            computerNumberDisplay.innerText = currentPcNumber;
            
            // Esconde o campo de digitar input
            containerInputPc.classList.add('hide');

            // Salva no histórico
            atualizarHistorico('Empréstimo', currentPcNumber, checkboxCarregador.checked);

            // Muda visual do botão
            btnText.innerText = 'CANCELAR / DEVOLVER';
            btnAction.classList.add('cancelar');
            checkboxCarregador.disabled = true; 

            // Mostra Notificação
            toast.innerText = `Comprovante do PC ${currentPcNumber} enviado pro E-mail.`;
            toast.classList.remove('cancel-mode');
            toast.classList.add('show');
            setTimeout(() => { toast.classList.remove('show'); }, 4000);

        } else {
            // ================= MODO CANCELAR (DEVOLUÇÃO) =================
            
            // Salva devolução no histórico antes de limpar a variável
            atualizarHistorico('Devolução', currentPcNumber, false);

            // Limpa a tela
            computerNumberDisplay.innerText = '';
            manualPcInput.value = ''; // Limpa o que foi digitado
            currentPcNumber = null;
            
            // Mostra o campo de input de novo
            containerInputPc.classList.remove('hide');

            // Restaura botão e checkbox
            btnText.innerText = 'REGISTRAR';
            btnAction.classList.remove('cancelar');
            checkboxCarregador.disabled = false; 
            checkboxCarregador.checked = false; 

            // Mostra Notificação
            toast.innerText = 'Computador devolvido/cancelado com sucesso.';
            toast.classList.add('cancel-mode');
            toast.classList.add('show');
            setTimeout(() => { toast.classList.remove('show'); }, 3000);
        }
    }, 1000);
});