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


function fetchNotas() {
    const login = document.getElementById('login').value;
    const semestre = document.getElementById('semestre').value;

    const data = { login: login, semestre: semestre };

    fetch('https://webservicespredictapp-production.up.railway.app/service3/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.erro) {
            console.error('Erro nos dados recebidos:', data);
        } else {
            console.log('Dados recebidos para notas:', data);
            // Renderize os dados no HTML conforme necessário
        }
    })
    .catch(error => {
        console.error('Erro ao buscar notas:', error);
    });
}

});
