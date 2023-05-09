/*

    This is the javascript code for this employee directory application.

*/

// The following variables are here to allow pagination functionality

const profilesPerPage   = 12;
const profilesToLoad    = 24;

let currentPage = 1;
let currentList = []; // Holds the data of the search term or all the employees
let employees   = []; // Used to keep reference of the fetched api data


const animationLength = 150;

/*
    commonly referenced HTML elements
*/

const pageButtons = document.querySelector('.page-links');
const gallery           = document.querySelector('#gallery');
const searchContainer   = document.querySelector('.search-container');
const searchCounter     = document.querySelector('#search-counter');

/*
    Modal Window is created
*/

const modalContainer     = document.createElement('div');
let modalSelection       = 0;
modalContainer.classList.add('modal-container', 'close');
modalContainer.style.display = 'none';

gallery.insertAdjacentElement('afterend', modalContainer)

/*
    This method inserts the search field onto the page
*/

searchContainer.insertAdjacentHTML('beforeend', `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
`)

const searchBox     = document.querySelector('#search-input');
const searchSubmit  = document.querySelector('#search-submit');

// Listeners are added to the search elements

searchSubmit.addEventListener('click', search)
searchBox.addEventListener('input', search);

/*
    `search` function finds employees with parts of their name matching the value of the search box
*/

function search(e) {
    e.preventDefault();
    const searchFor = searchBox.value.toLowerCase();

    // This 'if' statement checks if the search box is empty

    if (searchFor.length > 0) {
        searchResults = employees.filter( employee => employee.name.first.toLowerCase().includes(searchFor) || employee.name.last.toLowerCase().includes(searchFor));
        currentList = searchResults;
        showPage(searchResults, 1);
        searchCounter.textContent = `There were ${searchResults.length} results found for "${searchFor}"`
        addPageButtons(searchResults);
    } else {
        currentList = employees;
        showPage(employees, 1);
        searchCounter.textContent = ``;
    }
}

/*
    Uses the fetch API to get the info of the employees
*/

fetch(`https://randomuser.me/api/?results=${profilesToLoad}&nat=us,ca`, {
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin':'*'
    }
  })
    .then(res => res.json())
    .then(data => parseEmployees(data.results))
    .catch(err => console.log(err));

/*
    `parseEmployees` function will add an id to each employee and add them to the global 'employees' array
*/

function parseEmployees(data) {

    // Interates through each object in the data parameter array
    for (let i=0; i < data.length; i++) {
        data[i].id = i;
        employees.push(data[i])
    }

    currentList = employees;
    showPage(employees, 1);
}

/*
   showPage function takes the provided data and the requested page number to display the correct employees
 */

function showPage(list, page) {

    // These 'Index' variables are here to help pagination feature know the range of the employee profiles to be displayed
    

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

    function createEmployee(employee, itemNumber) {


        const employeeCard = document.createElement('div');

        employeeCard.classList.add('card', 'loading');
        employeeCard.setAttribute('id', employee.id);
        employeeCard.setAttribute('data-item-number', itemNumber); // This attribute is used to identitfy card position

        // Add relevant employee info to the 'employeeCard' element

        employeeCard.insertAdjacentElement('beforeend', createDiv('img', employee));
        employeeCard.insertAdjacentElement('beforeend', createDiv('info', employee));

        gallery.insertAdjacentElement('beforeend', employeeCard);
        setTimeout(() => employeeCard.classList.remove('loading'), 50);

        // Adds an event listener to the 'employeeCard' element to open the modal

        employeeCard.addEventListener('click', _e => {
                showModal(employeeCard);
         });
    };

    if (list.length === 0) {
        return gallery.innerHTML = '<h4>Bummer... No results</h4>'
    }

    let itemNumber = 0;

    /* 
        This for statement loops through all the profiles that should appear on the page
        The condtional statement inside breaks the loop as soon as there is no
        more data to append to the page.
    */

    for (i = startIndex; i < endIndex; i++) {
        if (list[i]) {
            createEmployee(list[i], itemNumber);
            itemNumber++
        } else {
            break;
        }
    };

    addPageButtons();
}

function addPageButtons(list = currentList) {

    const numOfPages = Math.ceil(list.length / profilesPerPage);

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

/*
    `showModal` function creates and displays a modal with more info about a selected employee
*/

function showModal(input, animation) {

    modalContainer.innerHTML = '';
    let htmlReference;

    if (input.id) {
        htmlReference = input;
    } else {
        htmlReference = gallery.children[input];
    }

    const employeeNum = parseInt(htmlReference.id)
    const cardItemNumber = parseInt(htmlReference.getAttribute('data-item-number'));


    if (employeeNum === undefined) {return false};

    let employee = employees[employeeNum];
    let employeePhone;
    const phoneNumberRegEx = /([A-Z0-9]{3})[\D]*([A-Z0-9]{3})[\D]*([A-Z0-9]{4})[\D]*/i;
    let employeeBirthday = new Date(employee.dob.date)

    if (phoneNumberRegEx.test(employee.cell)) {
        if (!employee.cell.startsWith('(')) {
            employeePhone = employee.cell.replace(phoneNumberRegEx, "($1) $2-$3");
        } else {
            employeePhone = employee.cell;
        }
    }

    // modal variable holds all the mark up for the modal window

    let modal = `            
        <div class="modal ${animation}">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container" id="${htmlReference.id}-employee">
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
    const firstItem = parseInt(gallery.firstElementChild.getAttribute('data-item-number'));
    
    if (cardItemNumber !== firstItem) {
        modal += '<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>'
    }

    const lastItem = parseInt(gallery.lastElementChild.getAttribute('data-item-number'));

    if (cardItemNumber !== lastItem) {
        modal += '<button type="button" id="modal-next" class="modal-next btn">Next</button>'
    }

    modal += `
    </div>`;
    modalContainer.style.display = '';
    modalContainer.insertAdjacentHTML('afterbegin', modal);
    const modalElement = document.querySelector('.modal');

    setTimeout(() => {
        modalElement.classList.remove(animation)
        modalContainer.classList.remove('close');
    }, animationLength);

    modalSelection = cardItemNumber;
}

modalContainer.addEventListener('click', (event, cardItemNumber) => {

    const modal = document.querySelector('.modal');

    if (event.target.tagName === 'BUTTON' || event.target.tagName === 'STRONG') {

        if (event.target.id === 'modal-close-btn' || event.target.parentNode.id === 'modal-close-btn') {
            modalContainer.classList.add('close')
            setTimeout(() => {
                modalContainer.style.display = 'none';
                modalContainer.innerHTML = '';
            }, 400);
        } else {
            let action = event.target.textContent;
            if (action === 'Next') {
                modal.classList.add('next');
                setTimeout(showModal, animationLength, modalSelection + 1, 'prev')
            } else {
                modal.classList.add('prev');
                setTimeout(showModal, animationLength, modalSelection - 1, 'next')
            }
        }
    }
})
pageButtons.addEventListener('click', (e) => {

    if (e.target.tagName === 'BUTTON' && e.target.className !== 'active') {
       const page = parseInt(e.target.textContent);
       currentPage = page;
       showPage(currentList, page);
    }
 
 });