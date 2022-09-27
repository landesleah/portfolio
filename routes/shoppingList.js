const express = require('express');
const router = express.Router();
const { validateItem } = require('../middleware');

const Item = require('../models/list_item.js');

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}

router.get('/', wrapAsync(async (req, res) => {
    const { store } = req.query;
    let items = await Item.find({});
    if (store) {
        items = await Item.find({ store: store });
    }
    res.render('pages/list/index', { items, stores, store })
}))

router.get('/new', (req, res) => {
    res.render('pages/list/new', { stores, priorities });
})

router.post('/', validateItem, wrapAsync(async (req, res) => {
    const newItem = new Item(req.body);
    await newItem.save();
    res.redirect('/shopping_list')
}))

router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const item = await Item.findById(id);
    res.render('pages/list/show', { item })
}))

router.get('/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const item = await Item.findById(id);
    res.render('pages/list/edit', { item })
}))

router.put('/:id', validateItem, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const item = await Item.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true });
    res.redirect(`/shopping_list/${id}`)
}))

router.delete('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const item = await Item.findByIdAndDelete(id);
    res.redirect('/shopping_list')
}))

module.exports = router;