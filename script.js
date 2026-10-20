// 1. Mostrar/Ocultar Senha
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling;
    if (input.type === 'password') {
        input.type = 'text'; icon.classList.replace('ph-eye', 'ph-eye-closed');
    } else {
        input.type = 'password'; icon.classList.replace('ph-eye-closed', 'ph-eye');
    }
}

// 2. Transições e Elementos Globais
const telaCadastro = document.getElementById('tela-cadastro');
const telaDashboard = document.getElementById('tela-dashboard');
const telaPerfil = document.getElementById('tela-perfil');
const emailInput = document.getElementById('email-input');
const emailDisplay = document.getElementById('user-email-display');
const editEmail = document.getElementById('edit-email');

document.getElementById('form-cadastro').addEventListener('submit', function(e) {
    e.preventDefault();
    const senha = document.getElementById('senha');
    const confirma = document.getElementById('confirma-senha');
    const erro = document.getElementById('erro-senha');
    
    if (senha.value !== confirma.value) {
        erro.style.display = 'block'; return; 
    }
    
    emailDisplay.innerText = emailInput.value;
    editEmail.value = emailInput.value; // Já preenche o form de edição de perfil
    
    telaCadastro.classList.remove('active');
    telaDashboard.classList.add('active');
});

// 3. Lógica do Menu e Temas
const sidebar = document.getElementById('sidebar');
const menuOverlay = document.getElementById('menu-overlay');
const modalHistorico = document.getElementById('modal-historico');

function toggleMenu() {
    sidebar.classList.toggle('open');
    menuOverlay.classList.toggle('show');
}

document.getElementById('open-menu').addEventListener('click', toggleMenu);
document.getElementById('close-menu').addEventListener('click', toggleMenu);
menuOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    menuOverlay.classList.remove('show');
    modalHistorico.classList.remove('show');
});

document.getElementById('btn-sair').addEventListener('click', () => {
    toggleMenu(); document.getElementById('form-cadastro').reset();
    telaDashboard.classList.remove('active'); telaCadastro.classList.add('active');
});

document.getElementById('btn-theme-toggle').addEventListener('click', () => {
    document.getElementById('app-container').classList.toggle('light-mode');
    const icon = document.querySelector('#btn-theme-toggle i');
    const txt = document.getElementById('theme-text');
    if (document.getElementById('app-container').classList.contains('light-mode')) {
        icon.classList.replace('ph-sun', 'ph-moon'); txt.innerText = 'Modo Escuro';
    } else {
        icon.classList.replace('ph-moon', 'ph-sun'); txt.innerText = 'Modo Claro';
    }
});

document.getElementById('btn-ajuda').addEventListener('click', () => {
    window.open(`https://wa.me/5511999999999?text=Olá! Preciso de ajuda com o Sistema do SENAI.`, '_blank');
});

document.getElementById('btn-abrir-historico').addEventListener('click', () => {
    sidebar.classList.remove('open'); modalHistorico.classList.remove('hide');
    setTimeout(() => { modalHistorico.classList.add('show'); }, 10);
});
document.getElementById('btn-close-historico').addEventListener('click', () => {
    modalHistorico.classList.remove('show'); menuOverlay.classList.remove('show');
});

// 4. Empréstimo
const btnAction = document.getElementById('btn-action');
const btnText = document.getElementById('btn-text');
const loader = document.getElementById('loader');
const displayNum = document.getElementById('computer-number');
const inputPc = document.getElementById('manual-pc-input');
const toast = document.getElementById('toast');
const checkCarregador = document.getElementById('carregador');

let historicoArray = []; let currentPc = null;

function showToast(msg, error = false) {
    toast.innerText = msg;
    error ? toast.classList.add('cancel-mode') : toast.classList.remove('cancel-mode');
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

btnAction.addEventListener('click', () => {
    btnAction.disabled = true; btnText.classList.add('hide'); loader.classList.remove('hide');
    setTimeout(() => {
        btnAction.disabled = false; btnText.classList.remove('hide'); loader.classList.add('hide');
        
        if (!btnAction.classList.contains('cancelar')) {
            currentPc = (inputPc.value && inputPc.value > 0) ? inputPc.value : Math.floor(Math.random() * 50) + 1;
            displayNum.innerText = currentPc;
            document.getElementById('container-input-pc').classList.add('hide');
            
            historicoArray.unshift({ html: `<li>✅ Empréstimo - PC ${currentPc} ${checkCarregador.checked ? "(Com Carregador)" : ""}</li>`});
            document.getElementById('lista-historico').innerHTML = historicoArray.map(i => i.html).join('');
            
            btnText.innerText = 'CANCELAR / DEVOLVER'; btnAction.classList.add('cancelar');
            checkCarregador.disabled = true;
            showToast(`Comprovante do PC ${currentPc} enviado.`);
        } else {
            historicoArray.unshift({ html: `<li class="devolucao">❌ Devolução - PC ${currentPc}</li>`});
            document.getElementById('lista-historico').innerHTML = historicoArray.map(i => i.html).join('');
            
            displayNum.innerText = ''; inputPc.value = ''; currentPc = null;
            document.getElementById('container-input-pc').classList.remove('hide');
            
            btnText.innerText = 'REGISTRAR'; btnAction.classList.remove('cancelar');
            checkCarregador.disabled = false; checkCarregador.checked = false;
            showToast('Computador devolvido com sucesso.', true);
        }
    }, 1000);
});

// 5. Lógica de Editar Perfil (FOTO, NOME e EMAIL)
const btnAbrirPerfil = document.getElementById('btn-abrir-perfil');
const btnVoltarDashboard = document.getElementById('btn-voltar-dashboard');
const btnTrocarFoto = document.getElementById('btn-trocar-foto');
const inputFoto = document.getElementById('input-foto');
const avatarPreview = document.getElementById('avatar-preview');
const avatarDisplay = document.getElementById('user-avatar-display');
const editApelido = document.getElementById('edit-apelido');
const btnSalvarPerfil = document.getElementById('btn-salvar-perfil');

// Abrir e Fechar tela de perfil
btnAbrirPerfil.addEventListener('click', () => {
    telaDashboard.classList.remove('active');
    telaPerfil.classList.add('active');
});

btnVoltarDashboard.addEventListener('click', () => {
    telaPerfil.classList.remove('active');
    telaDashboard.classList.add('active');
});

// Trocar Foto (Abre o gerenciador de arquivos)
btnTrocarFoto.addEventListener('click', () => {
    inputFoto.click();
});

inputFoto.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.addEventListener('load', function() {
            // Aplica a imagem como fundo das duas bolinhas de avatar
            avatarPreview.style.backgroundImage = `url(${this.result})`;
            avatarDisplay.style.backgroundImage = `url(${this.result})`;
            
            // Esconde os ícones de bonequinho originais
            document.getElementById('icon-avatar-preview').style.display = 'none';
            document.getElementById('icon-avatar-display').style.display = 'none';
        });
        reader.readAsDataURL(file);
    }
});

// Salvar as informações novas
btnSalvarPerfil.addEventListener('click', () => {
    // Se digitou apelido, mostra apelido. Se não, mostra o e-mail editado.
    if (editApelido.value.trim() !== "") {
        emailDisplay.innerText = editApelido.value;
    } else if (editEmail.value.trim() !== "") {
        emailDisplay.innerText = editEmail.value;
    }
    
    // Volta pro dashboard
    telaPerfil.classList.remove('active');
    telaDashboard.classList.add('active');
    showToast("Perfil atualizado com sucesso!");
});