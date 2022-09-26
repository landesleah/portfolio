const mongoose = require('mongoose');

const Item = require('./models/list_item');

mongoose.connect('mongodb://localhost:27017/shoppingList')
    .then(() => {
        console.log('mongo connection open!');
    }).catch(err => {
        console.log('oh no! mongo connection error!');
        console.log(err);
    });


const seedItems = [
    {
        name: 'Bananas',
    },
    {
        name: 'Stain Remover',
        store: 'Target',
        priority: 'high'
    },
    {
        name: 'Coconut Milk',
        qty: 3,
        store: 'Asian Market'
    },
    {
        name: 'Halloween Costume',
        store: 'Target'
    },
    {
        name: 'Canned Tomatoes',
        qty: 4
    }
]

Item.insertMany(seedItems)
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    })