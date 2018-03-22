const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
    res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', {title: 'Add Store'});
};

exports.createStore = async (req, res) => {
    const store = await (new Store(req.body)).save();
    await store.save();
    req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
    res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
    // 1. Query the db for a list of all stores
    const stores = await Store.find(); //returns a promise, hence you await it
    res.render('stores', {title:'stores', stores});
};

exports.editStore = async(req, res) => {
    // 1. Find the store given the ID
    // res.json(req.params);
    const store = await Store.findOne({_id: req.params.id});
    // 2. confirm they are the owner of the store
    // 3. Render out the edit form so the user can update their store
    res.render('editStore', {title: `Edit ${store.name}`, store});
};

exports.updateStore = async(req, res) => {
    // Find and update the store
    const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, {
        new: true, // return new store instead of the old store
        runValidators: true
    }).exec();
    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store &#x2192;
</a> `);
    // redirect them the store and tell them it worked
    res.redirect(`/stores/${store._id}/edit`);
};