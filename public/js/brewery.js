const zipForm = document.querySelector('#zipForm');
const breweries = document.querySelectorAll('.brewery');
const h3s = document.querySelectorAll('h3');
const phones = document.querySelectorAll('.phone');
const sites = document.querySelectorAll('.site');
const addresses = document.querySelectorAll('.address');
const links = document.querySelectorAll('.link');
const none = document.querySelector('.none');
const searchForm = document.querySelector('#searchForm')

const zipRe = /^[0-9]{5}(?:-[0-9]{4})?$/

zipForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    clear();
    searchForm.elements.search.value = ''
    try {
        const zipCode = zipForm.elements.zipCode.value;
        if (zipRe.test(zipCode)) {
            const res = await axios.get(`https://api.openbrewerydb.org/breweries?by_postal=${zipCode}&per_page=5`);
            postBreweries(res.data)
        } else {
            Toastify({
                text: 'Please enter a valid zip code',
                className: "info",
                style: {
                    background: "#E26D5C",
                }
            }).showToast();
        }

    } catch (e) {
        Toastify({
            text: e,
            className: "info",
            style: {
                background: "#E26D5C",
            }
        }).showToast();
    }

})

searchForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    clear();
    zipForm.elements.zipCode.value = ''
    try {
        const search = searchForm.elements.search.value;
        const res = await axios.get(`https://api.openbrewerydb.org/breweries/search?query=${search}&per_page=5`);
        postBreweries(res.data)
    }
    catch (e) {
        Toastify({
            text: e,
            className: "info",
            style: {
                background: "#E26D5C",
            }
        }).showToast();
    }
})




const clear = function () {
    // for (let site of sites) {
    //     site.innerText = 'Website: '
    // }
    for (let h3 of h3s) {
        h3.innerText = ''
    }
    for (let phone of phones) {
        phone.innerText = 'Phone: '
    }
    for (let address of addresses) {
        address.innerText = 'Street Address: '
    }
    for (let brewery of breweries) {
        brewery.classList.add('hide')
    }
    none.classList.add('hide')
}

const postBreweries = function (data) {
    if (data.length === 0) {
        none.classList.remove('hide');
    }
    for (let i = 0; i < data.length; i++) {
        const r = data[i];
        h3s[i].innerText = r.name;
        if (r.phone !== null) {
            phones[i].innerText += r.phone;
        }
        addresses[i].innerText += `${r.street}, ${r.city}, ${r.state}, ${r.postal_code}`;
        if (r.website_url !== null) {
            links[i].setAttribute('href', r.website_url);
            links[i].innerText = r.website_url;
        }
        breweries[i].classList.remove('hide');
    }
}