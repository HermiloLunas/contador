// Funções para manipular LocalStorage
const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
}

const getData = (key) => {
    return JSON.parse(localStorage.getItem(key)) || {};
}

// Função de inicialização
const init = () => {
    // Elementos do modal
    const modal = document.getElementById('modal');
    const modalTitulo = document.getElementById('modal-titulo');
    const quantidadeInput = document.getElementById('quantidade');
    const confirmarBtn = document.getElementById('confirmar');
    const fecharBtn = document.getElementById('fechar');
    
    if (!modal || !modalTitulo || !quantidadeInput || !confirmarBtn || !fecharBtn) {
        console.error('Elementos do modal não encontrados.');
        return;
    }

    let anoAtual = '';

    // Abrir o modal ao clicar em qualquer botão de ano
    document.querySelectorAll('.btano').forEach(button => {
        button.addEventListener('click', function () {
            anoAtual = this.getAttribute('data-ano');
            modalTitulo.innerText = anoAtual; // Mostra o texto do botão no modal

            // Verifica se já existe uma contagem para esse ano no LocalStorage
            const contagens = getData('contagens');
            if (contagens[anoAtual]) {
                quantidadeInput.value = contagens[anoAtual];  // Preencher input com o valor salvo
            } else {
                quantidadeInput.value = '';  // Limpar input se não houver valor
            }

            modal.style.display = 'flex';
        });
    });

    // Fechar o modal
    fecharBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Confirmar a contagem e salvar no LocalStorage
    confirmarBtn.addEventListener('click', function () {
        const quantidade = parseInt(quantidadeInput.value);
        if (isNaN(quantidade) || quantidade < 1) {
            alert('Por favor, insira uma quantidade válida.');
            return;
        }

        // Carregar as contagens já salvas
        const contagens = getData('contagens');

        // Atualizar a contagem para o ano atual
        contagens[anoAtual] = quantidade;  // Atualiza com o valor inserido no modal

        // Salvar de volta no LocalStorage
        saveData('contagens', contagens);

        // Atualizar a exibição dos resultados
        atualizarResultados();

        // Fechar o modal
        modal.style.display = 'none';
    });



    // Função para categorizar os anos
    const categorizarAnos = (ano) => {
        if (['1º ANO', '2º ANO'].includes(ano)) {
            return 'Fundamental 1 A';
        } else if (['3º ANO', '4º ANO', '5º ANO'].includes(ano)) {
            return 'Fundamental 1 B';
        } else if (['6º ANO', '7º ANO', '8º ANO', '9º ANO'].includes(ano)) {
            return 'Fundamental 2';
        } else if (['1º ANO M', '2º ANO M', '3º ANO M'].includes(ano)) {
            return 'Ensino Médio';
        } else {
            return 'Outros';
        }
    }



    // Atualizar a seção de resultados
    const atualizarResultados = () => {
        const resultadosSection = document.getElementById('resultados');
        const contagens = getData('contagens');
        let totalGeral = 0;
        const totaisPorCategoria = {
            'Fundamental 1 A': 0,
            'Fundamental 1 B': 0,
            'Fundamental 2': 0,
            'Ensino Médio': 0,
            'Outros': 0
        };
       
        // Limpar resultados anteriores
        resultadosSection.innerHTML = '';
        resultadosSection.innerHTML += '<h3>Turmas:</h3>';
        // Mostrar a contagem por ano e calcular totais por categoria
        for (const [ano, quantidade] of Object.entries(contagens)) {
            const categoria = categorizarAnos(ano);
            totaisPorCategoria[categoria] += quantidade;
            totalGeral += quantidade;

            resultadosSection.innerHTML += `
                <p id="ano-${ano}">
                    ${ano}: ${quantidade} alunos
                    <a class="delete-btn" data-ano="${ano}"><img src="./images/trash.svg" alt=""></a>
                </p>
            `;
        }

        // Mostrar totais por categoria
        resultadosSection.innerHTML += '<h3>Totais por Categoria:</h3>';
        for (const [categoria, total] of Object.entries(totaisPorCategoria)) {
            resultadosSection.innerHTML += `<p class="contagens-view">${categoria}:<br> ${total} alunos</p>`;
        }

        // Mostrar o total geral
        resultadosSection.innerHTML += `<h3>Total Geral:&nbsp;&nbsp;<span style="font-size: 26px; color: tomato; border:0.3px dotted tomato; padding:1px 8px; margin:2px 6px; display:flex; align-items:center; justify-content:center; border-radius:4px; "> ${totalGeral} </span>&nbsp;&nbsp; Alunos</h3>`;


        if (Object.keys(contagens).length > 0) {
            // Mostrar botão de reiniciar apenas se houver dados
            resultadosSection.innerHTML += `<button id="reiniciar" class="bt btredd">Reiniciar</button>`;

            // Adicionar evento ao botão de reiniciar
            const reiniciarBtn = document.getElementById('reiniciar');
            if (reiniciarBtn) {
                reiniciarBtn.addEventListener('click', function () {
                    localStorage.clear();  // Limpar o LocalStorage
                    atualizarResultados(); // Atualizar a exibição (zera tudo)
                });
            }
        }

        // Adicionar eventos de exclusão aos botões de delete
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {
                const ano = this.getAttribute('data-ano');
                const contagens = getData('contagens');
                delete contagens[ano];  // Remove a contagem do objeto
                saveData('contagens', contagens);  // Salva as contagens atualizadas
                atualizarResultados();  // Atualiza a exibição
            });
        });
    }

    // Função para obter a data atual e formatá-la
    const exibirDataAtual = () => {
        const dataAtual = new Date();
        
        // Obter dia, mês e ano
        const dia = String(dataAtual.getDate()).padStart(2, '0');  // Dia com dois dígitos
        const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');  // Mês (os meses são indexados a partir de 0)
        const ano = dataAtual.getFullYear();  // Ano completo
        
        // Montar a string da data no formato DD/MM/AAAA
        const dataFormatada = `${dia}/${mes}/${ano}`;
        
        // Exibir no elemento com o ID 'data-atual'
        document.getElementById('data-atual').textContent = dataFormatada;
    }

    // Inicializar exibindo a data atual e as contagens
    exibirDataAtual();
    atualizarResultados();

    // Menu Mobile
    const mobileMenu = document.getElementById('mobile-menu');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileMenu && sidebar) {
        // Função para abrir/fechar o menu no mobile
        mobileMenu.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}


document.getElementById('menu-toggle').addEventListener('click', function() {
    const aside = document.querySelector('aside');
    aside.classList.toggle('active'); // Alterna a classe 'active' no menu lateral
});

// Chamar a função init quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);

