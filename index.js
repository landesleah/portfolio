const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const AppError = require('./AppError')

const listRoutes = require('./routes/shoppingList');


mongoose.connect('mongodb://localhost:27017/shoppingList')
    .then(() => {
        console.log('mongo connection open!');
    }).catch(err => {
        console.log('oh no! mongo connection error!');
        console.log(err);
    });


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))); // serve static files on every single requres

stores = ['Aldi', 'Target', 'Kroger', 'Asian Market'];
priorities = ['low', 'medium', 'high'];

// ERROR FUNCTION

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}

// GET INDIVIDUAL PAGES

app.get('/', (req, res) => {
    res.render('pages/index')
})

app.get('/recipe', (req, res) => {
    res.render('pages/recipe')
})

app.get('/weather', (req, res) => {
    res.render('pages/weather')
})

app.get('/brewery', (req, res) => {
    res.render('pages/brewery')
})

app.get('/not_found', (req, res) => {
    res.render('pages/not_found')
})


// ROUTES SHOPPING LIST:


app.use('/shopping_list', listRoutes);



// ERROR HANDLERS?????

const handleValidationErr = err => {
    return new AppError(`Validation Failed... ${err.message}`, 400) // not actually very good, just to show structure of function
}

app.use((err, req, res, next) => {
    console.log(err.name);
    if (err.name === 'ValidationError') {
        err = handleValidationErr(err)
    }
    next(err);
})

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something Went Wrong' } = err;
    res.status(status).send(message)
})



app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000")
})