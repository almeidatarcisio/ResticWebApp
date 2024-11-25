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
                    data.data.forEach(item => {
                        console.log('Adicionando semestre:', item.descricao);
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

    function fetchNotas(cpf, semestre) {
        progressBar.style.display = 'block';
        fetch('https://webservicespredictapp-production.up.railway.app/service3/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login: cpf, semestre: semestre })
        })
        .then(response => {
            console.log('Resposta recebida:', response);
            return response.json();
        })
        .then(data => {
            console.log('Dados recebidos para notas:', data);
            if (data.erro === false) {
                recyclerView.innerHTML = '';
                if (Array.isArray(data.data) && data.data.length > 0) {
                    txtNomeAluno.textContent = `Nome: ${data.data[0].aluno}`;
                    data.data.forEach(item => {
                        const div = document.createElement('div');
                        div.className = 'notas';
                        div.innerHTML = `
                            <p>Disciplina: ${item.disciplina}</p>
                            <p>Turma: ${item.turma}</p>
                            <p>A1: ${item.a1}</p>
                            <p>A2: ${item.a2}</p>
                            <p>Sub: ${item.sub}</p>
                            <p>A3: ${item.a3}</p>
                            <p>Faltas A1: ${item.faltasA1}</p>
                            <p>Faltas A2: ${item.faltasA2}</p>
                        `;
                        recyclerView.appendChild(div);
                    });
                } else {
                    recyclerView.innerHTML = '<p>Nenhuma nota encontrada.</p>';
                }
            } else {
                console.error('Erro nos dados recebidos:', data);
                recyclerView.innerHTML = '<p>Nenhuma nota encontrada.</p>';
            }
            progressBar.style.display = 'none';
        })
        .catch(error => {
            console.error('Erro ao buscar notas:', error);
            progressBar.style.display = 'none';
        });
    }
});
