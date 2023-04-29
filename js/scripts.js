/*

    This is the javascript code for this employee directory application.

*/

const profilesPerPage = 12;
const profilesToLoad = 48
let currentPage = 1;
const pageButtons = document.querySelector('.page-links');
const gallery = document.querySelector('#gallery')


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

    function createEmployee(employee, id) {
        console.log(employee);
        let employeeCard = 
        `   <div class="card" id=${id}>
                <div class="card-img-container">
                    <img class="card-img" src="${employee.picture.large}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p class="card-text">${employee.email}</p>
                    <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
                </div>
            </div> `

        gallery.insertAdjacentHTML('beforeend', employeeCard);

        const card = document.getElementById(id)

        card.addEventListener('click', event => {
                showModal(card)
         })
    }

    for (i = startIndex; i < endIndex; i++) {
        createEmployee(list[i], i);
    }

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
          `)
       } else {
          pageButtons.insertAdjacentHTML('beforeend', `
          <li>
             <button type="button">${i}</button>
          </li>
       `)
       }
    }
}

function showModal(input) {
    let employeeNum;
    if (input.id) {
        employeeNum = input.id;
    } else {
        employeeNum = input;
    }

        let employeePhone;
        const phoneNumberRegEx = /([A-Z0-9]{3})[\D]*([A-Z0-9]{3})[\D]*([A-Z0-9]{4})[\D]*/i;
        console.log(event);
        let employee = employees[parseInt(employeeNum)];
        console.log(employee.phone);
        if (phoneNumberRegEx.test(employee.phone)) {
            if (!employee.phone.startsWith('(')) {
                employeePhone = employee.phone.replace(phoneNumberRegEx, "($1) $2-$3");
            } else {
                employeePhone = employee.phone;
            }
            console.log(employeePhone);
        }

        const modal = `            
        <div class="modal-container">
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
                    <p class="modal-text">Birthday: 10/21/2015</p>
                </div>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>`
        gallery.insertAdjacentHTML('afterend', modal);

        document.querySelector('.modal-container').addEventListener('click', event => {
            console.log(event);
            if (event.target.tagName === 'BUTTON' || event.target.tagName === 'STRONG') {
                if (event.target.id === 'modal-close-btn' || event.target.parentNode.id === 'modal-close-btn') {
                    const modalContainer = document.querySelector('.modal-container');
                    modalContainer.remove();
                } else {
                    
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