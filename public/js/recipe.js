const amounts = document.querySelectorAll('.amount');
const form = document.querySelector('#numberForm')
const input = document.querySelector('#numberCookies')
const singleButton = document.querySelector('#single')
const doubleButton = document.querySelector('#double')
const tripleButton = document.querySelector('#triple')
const units = document.querySelectorAll('.unit');

const originalAmounts = [];
for (let i = 0; i < amounts.length; i++) {
    originalAmounts.push({ amount: amounts[i].innerText, unit: units[i].innerText })
}

const multiply = (num) => {
    for (let i = 0; i < amounts.length; i++) {
        const newAmount = Math.round((parseFloat(originalAmounts[i].amount) * num) * 10) / 10;
        if (newAmount >= 3 && originalAmounts[i].unit === "tsp") {
            amounts[i].innerText = Math.floor(newAmount / 3);
            if (newAmount % 3 !== 0) {
                units[i].innerText = `Tbsp and ${Math.round(newAmount % 3)} tsp`
            } else {
                units[i].innerText = 'Tbsp'
            }
        } else {
            amounts[i].innerText = newAmount;
            units[i].innerText = originalAmounts[i].unit
        }
    }
}


form.addEventListener('submit', function (e) {
    e.preventDefault();
    const numberCookies = input.value;
    multiply(numberCookies / 36);
    input.value = ''
})


singleButton.addEventListener('click', () => {
    multiply(1)
});
doubleButton.addEventListener('click', () => {
    multiply(2)
});
tripleButton.addEventListener('click', () => {
    multiply(3)
})



