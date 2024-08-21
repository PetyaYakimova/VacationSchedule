window.addEventListener("load", solve);

function solve(){
    let loadButtonElement = document.getElementById('load-vacations');
    loadButtonElement.addEventListener('click',  e=> loadVacations());

    let vacationsListElement = document.getElementById('list');

    let addButtonElement = document.getElementById('add-vacation');
    addButtonElement.addEventListener('click', e=>addVacation(e));
    let nameField = document.getElementById('name');
    let daysField = document.getElementById('num-days');
    let fromDateField = document.getElementById('from-date');
    let allinputFields = [];
    allinputFields.push(nameField);
    allinputFields.push(daysField);
    allinputFields.push(fromDateField);

    let editButtonElement = document.getElementById('edit-vacation');
    editButtonElement.addEventListener('click', e=>editVacation(e));

    let currentElementId = '';
    let vacations = [];

    async function loadVacations(){
        vacationsListElement.innerHTML='';

        vacations = await (await fetch('http://localhost:3030/jsonstore/tasks/')).json();
        vacations = Object.values(vacations);
        for (let vacationInfo of vacations){
            let divElement = document.createElement('div');
            divElement.classList.add('container');
            divElement.setAttribute('id', vacationInfo._id);

            let h2Element = document.createElement('h2');
            h2Element.textContent = vacationInfo.name;
            divElement.appendChild(h2Element);

            let h3Element = document.createElement('h3');
            h3Element.textContent = vacationInfo.date;
            divElement.appendChild(h3Element);

            let h32Element = document.createElement('h3');
            h32Element.textContent = vacationInfo.days;
            divElement.appendChild(h32Element);

            let changeButtonElement = document.createElement('button');
            changeButtonElement.classList.add('change-btn');
            changeButtonElement.textContent = 'Change';
            divElement.appendChild(changeButtonElement);
            changeButtonElement.addEventListener('click', e=>changeVacation(e));

            let doneButtonElement = document.createElement('button');
            doneButtonElement.classList.add('done-btn');
            doneButtonElement.textContent = 'Done';
            divElement.appendChild(doneButtonElement);
            doneButtonElement.addEventListener('click', e=>doneVacation(e));

            vacationsListElement.appendChild(divElement);
        }
    }

    async function addVacation(e){
        e.preventDefault();
        if (allinputFields.find(f=>!f.value)){
            return;
        }

        let newRecord = {
            name: nameField.value,
            days: daysField.value,
            date: fromDateField.value
        };

        await fetch('http://localhost:3030/jsonstore/tasks/', {
            method: 'POST',
            body: JSON.stringify(newRecord)
        });

        allinputFields.forEach(f=>f.value=null);
        loadVacations();
    }

    function changeVacation(e){
        let parentNode = e.target.parentNode;
        currentElementId = parentNode.getAttribute('id');
        nameField.value = parentNode.getElementsByTagName('h2')[0].textContent;
        let date =parentNode.getElementsByTagName('h3')[0].textContent;
        daysField.value = parentNode.getElementsByTagName('h3')[1].textContent;
        fromDateField.value = date;

        parentNode.remove();

        editButtonElement.disabled = false;
        addButtonElement.disabled = true;
    }

    async function editVacation(e){
        e.preventDefault();
        let updatedRecords = {
            _id: currentElementId,
            name: nameField.value,
            days: daysField.value,
            date: fromDateField.value
        };

        await fetch(`http://localhost:3030/jsonstore/tasks/${currentElementId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedRecords)
        });

        loadVacations();
        editButtonElement.disabled = true;
        addButtonElement.disabled = false;

        allinputFields.forEach(f=>f.value=null);
    }

    async function doneVacation(e){
        let parentNode = e.target.parentNode;
        currentElementId = parentNode.getAttribute('id');

        await fetch(`http://localhost:3030/jsonstore/tasks/${currentElementId}`, {
            method: 'DELETE'
        });

        loadVacations();
    }
}