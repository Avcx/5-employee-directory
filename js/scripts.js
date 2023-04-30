/*

    This is the javascript code for this employee directory application.

*/

const profilesPerPage = 12;
const profilesToLoad = 12;
let currentPage = 1;
const pageButtons = document.querySelector('.page-links');
const gallery = document.querySelector('#gallery');
const searchContainer = document.querySelector('.search-container');
let modalContainer;

searchContainer.insertAdjacentHTML('beforeend', `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
`)

const searchBox = document.querySelector('#search-input');
const searchSubmit = document.querySelector('#search-submit');

searchSubmit.addEventListener('click', search)
searchBox.addEventListener('input', search);

function search(e) {
    e.preventDefault();
    const searchFor = searchBox.value.toLowerCase();

    if (/\w+/ig.test(searchFor)) {
        searchResults = employees.filter( employee => employee.name.first.toLowerCase().includes(searchFor) || employee.name.last.toLowerCase().includes(searchFor))
        showPage(searchResults, 1);
    } else {
        showPage(employees, 1);
    }
    if (searchFor )
    gallery.insertAdjacentHTML('afterbegin', `<h4>There were ${searchResults.length} results found for "${searchFor}"</h4>`);
}

/*
    Uses the fetch API to get the info of the users
*/

fetch(`https://randomuser.me/api/?results=${profilesToLoad}&nat=us,ca`)
    .then(res => res.json())
    .then(data => parseUsers(data.results))
    .catch(err => console.log(err));

let employees;

function parseUsers(users) {
    employees = (users);
    showPage(employees, 1);
}

/**
 * showPage function
 * @param {Array} list - The is the data to be displayed on the page, when searching the list will change to the search results
 * @param {number} page -  The page that should be displayed from the list
 */

function showPage(list, page) {

    const startIndex = (page * profilesPerPage) - profilesPerPage; 
    const endIndex = page * profilesPerPage;

    gallery.innerHTML = '';

    function createDiv(type, data) {
        if (type === 'img') {

            const imgDiv = document.createElement('div');
            imgDiv.setAttribute('class', 'card-img-container');

            const img = document.createElement('img');
            img.setAttribute('class', 'card-img')
            img.setAttribute('src', data['picture']['large'])
            img.setAttribute('alt', `profile picture of ${data['name']['first']} ${data['name']['last']}`)

            imgDiv.appendChild(img);

            return imgDiv;

        } else if (type === 'info') {

            const infoDiv = document.createElement('div');
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

        // Add relevant employee info to the 'employeeCard' element

        employeeCard.insertAdjacentElement('beforeend', createDiv('img', employee));
        employeeCard.insertAdjacentElement('beforeend', createDiv('info', employee));

        gallery.insertAdjacentElement('beforeend', employeeCard);

        // Adds an event listener to the 'employeeCard' element to open the modal

        employeeCard.addEventListener('click', event => {
                showModal(employeeCard);
         });
    };

    /* 
        This for statement loops through all the profiles that should appear on the page
        The condtional statement inside breaks the loop as soon as there is no
        more data to append to the page.
    */

    if (list.length === 0) {
        return gallery.innerHTML = '<h4>Bummer... No results found.</h4>'
    }

    for (i = startIndex; i < endIndex; i++) {
        if (list[i]) {
            createEmployee(list[i], i);
        } else {
            break;
        }
    };

    // addPageButtons();
}

// function addPageButtons() {

//     const numOfPages = Math.ceil(employees.length / profilesPerPage);

//     pageButtons.innerHTML = '';

//     for (let i = 1; i <= numOfPages; i++) {
//        if (i === currentPage) {
//           pageButtons.insertAdjacentHTML('beforeend', `
//              <li>
//                 <button type="button" class="active">${i}</button>
//              </li>
//           `);
//        } else {
//           pageButtons.insertAdjacentHTML('beforeend', `
//           <li>
//              <button type="button">${i}</button>
//           </li>
//         `);
//        };
//     };
// }

function showModal(input) {
    let employeeNum;

    // This ternary statment checks to see if an element or an id number was passed through.

    input.id ? employeeNum = parseInt(input.id) : employeeNum = parseInt(input);

    // This if statement 

    if (employeeNum === undefined) return false;

        let employeePhone;
        const phoneNumberRegEx = /([A-Z0-9]{3})[\D]*([A-Z0-9]{3})[\D]*([A-Z0-9]{4})[\D]*/i;
        let employee = employees[employeeNum];
        let employeeBirthday = new Date(employee.dob.date)

        if (phoneNumberRegEx.test(employee.cell)) {
            if (!employee.cell.startsWith('(')) {
                employeePhone = employee.cell.replace(phoneNumberRegEx, "($1) $2-$3");
            } else {
                employeePhone = employee.cell;
            }
        }

        modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        gallery.insertAdjacentElement('afterend', modalContainer)

        // modal variable holds all the mark up for the modal window

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

// pageButtons.addEventListener('click', (e) => {

//     if (e.target.tagName === 'BUTTON' && e.target.className !== 'active') {
//        const page = parseInt(e.target.textContent);
//        currentPage = page;
//        showPage(employees, page);
//     }
 
//  });