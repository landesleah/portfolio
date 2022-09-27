const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const AppError = require('./AppError')

const listRoutes = require('./routes/shoppingList');

const session = require('express-session');
const MongoStore = require('connect-mongo');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/shoppingList'
mongoose.connect(dbUrl)
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

// DATABASE AND SESSION

const secret = process.env.SECRET || 'thisisasecret'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret
    }
});

store.on("error", function (e) {
    console.log('session store error', e)
})

const sessionConfig = {
    store,
    name: 'session', // rename from default (connect.sid) so people don't know what to look for 
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // provides some security, cookies not accessible via javascript
        // secure: true, // only works over https:// (http secure - local host is not https so we can't run this line, want this when you deploy)
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // date.now is in milliseconds, so you calculate how many milliseconds in a week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

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

app.get('/career', (req, res) => {
    res.render('pages/career')
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




const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})