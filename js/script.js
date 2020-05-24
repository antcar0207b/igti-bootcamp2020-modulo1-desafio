window.addEventListener('load', start);

var allPeople = null;
var $;

function start() {
    $ = document.getElementById.bind(document);

    $('search-button').addEventListener('click', (event) => {
        search();
    })

    $('search').addEventListener('keyup', (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('search-button').click();
      }
    });

    fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo')
        .then(result => result.json())
        .then(({results}) => {
            
            allPeople = results.map(({name, dob, gender, picture}) => ({
                name: name.first + ' ' + name.last,
                picture: picture.thumbnail,
                age: dob.age,
                gender: gender
            }));

            allPeople.sort(function (a, b) {
                const aname = replaceSpecialCharacters(a.name.toLowerCase());
                const bname = replaceSpecialCharacters(b.name.toLowerCase());
                if (aname > bname) {
                    return 1;
                }
                if (aname < bname) {
                    return -1;
                }
                return 0;
            });

            console.log('Pessoas', allPeople);
            
            updateList(allPeople);
            calculateStatistics(allPeople);

            retrievedData();
        })
        .catch(error => {
            console.log('Erro', error);
        });
}; 

function search() {
    let filter = $('search').value.toLowerCase();
    filter = replaceSpecialCharacters(filter);

    filteredPeople = allPeople.filter(person => replaceSpecialCharacters(person.name.toLowerCase()).indexOf(filter) > -1);

    updateList(filteredPeople);
    calculateStatistics(filteredPeople);
}

function replaceSpecialCharacters(texto) {
    texto = texto.replace('ã', 'a'); 
    texto = texto.replace('á', 'a'); 
    texto = texto.replace('é', 'e');
    texto = texto.replace('ê', 'e');
    texto = texto.replace('ó', 'o');
    texto = texto.replace('ô', 'o');
    texto = texto.replace('ú', 'u');

    return texto;
}

function updateList(people) {
    const list = $('people-list');

    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    people.forEach(person => list.appendChild(createPerson(person)));
}

function createPerson(person) {
    const li = document.createElement('div');
    li.classList.add('person')

    const image = document.createElement('img');
    image.src = person.picture;
    image.classList.add('person-image')
    li.appendChild(image);

    const texto = document.createElement('span');
    texto.classList.add('person-text');
    texto.appendChild(document.createTextNode(`${person.name}, ${person.age} anos`));
    li.appendChild(texto);  

    return li;
}

function calculateStatistics(subgroup) {
    const male = subgroup.filter(person => person.gender === 'male').length;
    const female = subgroup.filter(person => person.gender === 'female').length;
    const ageSum = subgroup.reduce((acc, person) => acc + person.age, 0);
    const ageAverage = (ageSum * 1.0) / (male + female);

    $('male').replaceChild(document.createTextNode(male), $('male').firstChild);
    $('female').replaceChild(document.createTextNode(female), $('female').firstChild);
    $('age-sum').replaceChild(document.createTextNode(ageSum), $('age-sum').firstChild);
    $('age-average').replaceChild(document.createTextNode(('' + ageAverage.toFixed(2).replace('.', ','))), $('age-average').firstChild);
}

function retrievedData() {
    setTimeout(() => {
        toggleVisibility($('search-row'), $('loading'));
        toggleVisibility($('found-user'), $('no-user'));
        toggleVisibility($('found-statistic'), $('no-statistic'));
    }, 1000);
}

function toggleVisibility(elementOn, elementOf) {
    if (elementOn.classList.contains('visible')) {

        elementOn.classList.replace('visible', 'invisible');
        elementOf.classList.replace('invisible', 'visible');
    } else {
        elementOn.classList.replace('invisible', 'visible');
        elementOf.classList.replace('visible', 'invisible');
    }
}