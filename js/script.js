window.addEventListener('load', () => {
    fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo')
        .then(result => result.json())
        .then(json => {
            console.log('Dados', json.results);
        })
        .catch(error => {
            console.log('Erro: ', error);
        });
}); 