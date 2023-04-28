/*

    This is the javascript code for this employee directory application.

*/
console.log('helloo')

async function fetchData(url) {
   return await fetch(url)
    .then(res => res.json())
    .catch(err => console.log(err));
}

let users = fetchData('https://randomuser.me/api/?results=12');
console.log(users);
