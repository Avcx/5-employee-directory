/*

    This is the javascript code for this employee directory application.

*/

const profilesPerPage = 12

async function fetchData(url) {
   return await fetch(url)
    .then(res => res.json())
    .then(data => parseUsers(data.results))
    .catch(err => console.log(err));
}

fetchData('https://randomuser.me/api/?results=12');

let employees;

function parseUsers(users) {
    employees = users;
    createUsers();
}


function createUsers() {
    const gallery = document.querySelector('#gallery')
    employees.forEach(employee => {
        console.log(employee);
        let employeeCard = 
        `   <div class="card">
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
    })
}
