document.addEventListener('DOMContentLoaded', function () {
    const spinner = document.getElementById('spnSemestres');
    const progressBar = document.getElementById('progressBar');
    const txtNomeAluno = document.getElementById('txtNomeAluno');
    const recyclerView = document.getElementById('recyclerView');
    const cpf = "12345678901"; // Substituir pelo CPF real

    // Carrega os semestres ao carregar a página
    fetchSemestres();

    spinner.addEventListener('change', function () {
        const selectedSemestre = spinner.value;
        fetchNotas(cpf, selectedSemestre);
    });

function fetchSemestres() {
    progressBar.style.display = 'block';
    fetch('https://webservicespredictapp-production.up.railway.app/service2/', {
        method: 'POST'
    })
    .then(response => {
        console.log('Resposta recebida:', response);
        return response.json();
    })
    .then(data => {
        console.log('Dados recebidos para semestres:', data);
        if (data.erro === false) {
            if (Array.isArray(data.data) && data.data.length > 0) {
                // Limpa as opções existentes no spinner
                spinner.innerHTML = '';
                
                // Adiciona uma opção em branco como padrão
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Selecione um semestre';
                spinner.appendChild(defaultOption);

                // Adiciona as opções de semestre
                data.data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.descricao;
                    option.textContent = item.descricao;
                    spinner.appendChild(option);
                });
            } else {
                console.error('Nenhum semestre encontrado nos dados recebidos.');
            }
        } else {
            console.error('Erro nos dados recebidos:', data);
        }
        progressBar.style.display = 'none';
    })
    .catch(error => {
        console.error('Erro ao buscar semestres:', error);
        progressBar.style.display = 'none';
    });
}


function fetchNotas(login, selected) {
    console.log("Login: " + login + " | Semestre: " + selected);

    // Mostrando o indicador de carregamento
    document.getElementById('progressBar').style.display = 'block';

    fetch('https://webservicespredictapp-production.up.railway.app/service3/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'login': login,
            'semestre': selected
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        // Verificando se houve erro na resposta
        if (data.erro === false) {
            const notasList = document.getElementById('notasList');
            notasList.innerHTML = ''; // Limpa a lista antes de adicionar novos elementos

            const aluno = data.data[0].aluno;
            document.getElementById('txtNomeAluno').innerText = "NOME: " + aluno;

            data.data.forEach(nota => {
                const disciplina = nota.disciplina;
                const turma = nota.turma;
                const a1 = nota.a1;
                const a2 = nota.a2;
                const sub = nota.sub;
                const a3 = nota.a3;
                const faltasA1 = nota.faltasA1;
                const faltasA2 = nota.faltasA2;

                const notaItem = document.createElement('li');
                notaItem.textContent = `Disciplina: ${disciplina}, Turma: ${turma}, A1: ${a1}, A2: ${a2}, Sub: ${sub}, A3: ${a3}, Faltas A1: ${faltasA1}, Faltas A2: ${faltasA2}`;
                notasList.appendChild(notaItem);
            });

        } else {
            document.getElementById('notasList').innerHTML = '';
            alert(data.mensagem);
        }

        // Ocultando o indicador de carregamento
        document.getElementById('progressBar').style.display = 'none';
    })
    .catch(error => {
        console.error('Erro ao buscar notas:', error);
        alert('Erro ao buscar notas: ' + error.message);
        // Ocultando o indicador de carregamento
        document.getElementById('progressBar').style.display = 'none';
    });
}


});
