/*

    This is the javascript code for this employee directory application.

*/

const profilesPerPage = 12;
const profilesToLoad = 48;
let currentPage = 1;
const pageButtons = document.querySelector('.page-links');
const gallery = document.querySelector('#gallery');
let modalContainer;


fetch(`https://randomuser.me/api/?results=${profilesToLoad}&nat=us,ca`)
    .then(res => res.json())
    .then(data => parseUsers(data.results))
    .catch(err => console.log(err));

let employees;

function parseUsers(users) {
    employees = (users);
    showPage(employees, 1);
}


function showPage(list, page) {

    const startIndex = (page * profilesPerPage) - profilesPerPage; 
    const endIndex = page * profilesPerPage;

    gallery.innerHTML = '';

    function createDiv(type, data) {
        if (type === 'img') {

            let imgDiv = document.createElement('div');
            imgDiv.setAttribute('class', 'card-img-container');

            let img = document.createElement('img');
            img.setAttribute('class', 'card-img')
            img.setAttribute('src', data['picture']['large'])
            img.setAttribute('alt', `profile picture of ${data['name']['first']} ${data['name']['last']}`)

            imgDiv.appendChild(img);

            return imgDiv;

        } else if (type === 'info') {

            let infoDiv = document.createElement('div');
            infoDiv.setAttribute('class', 'card-info-container')

            infoDiv.insertAdjacentHTML('beforeend', `
                <h3 id="name" class="card-name cap">${data['name']['first']} ${data['name']['last']}</h3>
                <p class="card-text">${data['email']}</p>
                <p class="card-text cap">${data['location']['city']}, ${data['location']['state']}</p>
            `)
            return infoDiv;
        }
    }

    function createEmployee(employee, id) {


        const employeeCard = document.createElement('div');

        employeeCard.setAttribute('class', 'card');
        employeeCard.setAttribute('id', id);

        employeeCard.insertAdjacentElement('beforeend', createDiv('img', employee));
        employeeCard.insertAdjacentElement('beforeend', createDiv('info', employee));


    gallery.insertAdjacentElement('beforeend', employeeCard);
        const card = document.getElementById(id);

        // Adds an event listener to the card to open the modal

        card.addEventListener('click', event => {
                showModal(card);
         });
    };

    /* 
        This for statement loops through all the profiles that should appear on the page
        The condtional statement inside breaks the loop as soon as there is no
        more data to append to the page.
    */

    for (i = startIndex; i < endIndex; i++) {
        if (list[i]) {
            createEmployee(list[i], i);
        } else {
            break;
        }
    };

    addPageButtons();
}

function addPageButtons() {

    const numOfPages = Math.ceil(employees.length / profilesPerPage);

    pageButtons.innerHTML = '';

    for (let i = 1; i <= numOfPages; i++) {
       if (i === currentPage) {
          pageButtons.insertAdjacentHTML('beforeend', `
             <li>
                <button type="button" class="active">${i}</button>
             </li>
          `);
       } else {
          pageButtons.insertAdjacentHTML('beforeend', `
          <li>
             <button type="button">${i}</button>
          </li>
        `);
       };
    };
}

function showModal(input) {
    let employeeNum = 0;
    if (input.id) {
        employeeNum = parseInt(input.id);
    } else {
        employeeNum = parseInt(input);
    }

        let employeePhone;
        const phoneNumberRegEx = /([A-Z0-9]{3})[\D]*([A-Z0-9]{3})[\D]*([A-Z0-9]{4})[\D]*/i;
        let employee = employees[employeeNum];
        console.log(employee);

        let employeeBirthday = new Date(employee.dob.date)

        console.log(employeeBirthday);

        if (phoneNumberRegEx.test(employee.cell)) {
            if (!employee.cell.startsWith('(')) {
                employeePhone = employee.cell.replace(phoneNumberRegEx, "($1) $2-$3");
            } else {
                employeePhone = employee.cell;
            }
            console.log(employeePhone);
        }

        modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        gallery.insertAdjacentElement('afterend', modalContainer)

        let modal = `            
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p class="modal-text">${employee.email}</p>
                    <p class="modal-text cap">${employee.location.city}</p>
                    <hr>
                    <p class="modal-text">${employeePhone}</p>
                    <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
                    <p class="modal-text">Birthday: ${employeeBirthday.getDate()}/${employeeBirthday.getMonth() + 1}/${employeeBirthday.getFullYear()}</p>
                </div>
            </div>
            <div class="modal-btn-container">`;

        // These conditional statements append `Next` or `Prev` buttons as needed.
        
        if (employeeNum !== 0) {
            modal += '<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>'
        }
        if (employeeNum !== employees.length - 1) {
            modal += '<button type="button" id="modal-next" class="modal-next btn">Next</button>'
        }

        modal += `
        </div>`;

        modalContainer.insertAdjacentHTML('afterbegin', modal);

        function scrollUsers(direction) {
            if (direction === 'Next') {
                showModal(employeeNum + 1);
            } else {
                showModal(employeeNum - 1);
            }
        }

        document.querySelector('.modal-container').addEventListener('click', event => {
            console.log(event);
            if (event.target.tagName === 'BUTTON' || event.target.tagName === 'STRONG') {
                if (event.target.id === 'modal-close-btn' || event.target.parentNode.id === 'modal-close-btn') {
                    modalContainer.remove();
                } else {
                    let action = event.target.textContent;
                    modalContainer.remove();
                    scrollUsers(action);
                }
            }
        })
}

pageButtons.addEventListener('click', (e) => {

    if (e.target.tagName === 'BUTTON' && e.target.className !== 'active') {
       const page = parseInt(e.target.textContent);
       currentPage = page;
       showPage(employees, page);
    }
 
 });