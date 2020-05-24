window.addEventListener('load', start);

var allPeople = null;
var peopleSubset = null;
var $;

function start() {
    $ = document.getElementById.bind(document);

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
                if (a.name > b.name) {
                    return 1;
                }
                if (a.name < b.name) {
                    return -1;
                }
                return 0;
            });

            console.log('Pessoas', allPeople);
            
            allPeople.forEach(person => createPerson(person));
            calculateStatistics(allPeople);

            foundData();
        })
        .catch(error => {
            console.log('Erro', error);
        });
}; 

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

    $('people-list').appendChild(li);
}

function calculateStatistics(subgroup) {
    const male = subgroup.filter(person => person.gender === 'male').length;
    const female = subgroup.filter(person => person.gender === 'female').length;
    const ageSum = subgroup.reduce((acc, person) => acc + person.age, 0);
    const ageAverage = (ageSum * 1.0) / (male + female);

    $('male').replaceChild(document.createTextNode(male), $('male').firstChild);
    $('female').replaceChild(document.createTextNode(female), $('female').firstChild);
    $('age-sum').replaceChild(document.createTextNode(ageSum), $('age-sum').firstChild);
    $('age-average').replaceChild(document.createTextNode(ageAverage), $('age-average').firstChild);
}

function foundData() {
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