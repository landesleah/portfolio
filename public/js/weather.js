const form = document.querySelector('#searchForm');
const currentTemp = document.querySelector('#currentTemp')
const feelsLike = document.querySelector('#feelsLike');
const humidity = document.querySelector('#humidity');
const conditions = document.querySelector('#conditions');

const zipRe = /^[0-9]{5}(?:-[0-9]{4})?$/

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    clear();
    try {
        const zipCode = form.elements.zipCode.value;
        if (zipRe.test(zipCode)) {
            const zip = await axios.get(`http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=538d00dd69024ce1cc67c53bd3f0112a`);
            // check if this is successful
            let lat = zip.data.lat;
            let lon = zip.data.lon;
            const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=538d00dd69024ce1cc67c53bd3f0112a
        `);
            currentTemp.innerText += ` ${kelvinToFahren(res.data.main.temp)} degrees Fahrenheit`;
            feelsLike.innerText += ` ${kelvinToFahren(res.data.main.feels_like)} degrees Fahrenheit`;
            humidity.innerText += ` ${res.data.main.humidity} %`;
            conditions.innerText += ` ${res.data.weather[0].main}`
        } else {
            Toastify({
                text: 'Invalid zipcode. Please enter a valid zipcode.',
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

const kelvinToFahren = (k) => {
    const f = Math.round(1.8 * (k - 273) + 32);
    return f
}

const clear = function () {
    currentTemp.innerText = '';
    feelsLike.innerText = '';
    humidity.innerText = '';
    conditions.innerText = '';
}

// const validZip = function (zip) {
//     if (zip.length() === 5 && zip > 0 && zip <= 99950) {
//         return true
//     }
// }


// zipCode.length === 5 && zipCode >= 501 && zipCode <= 99950