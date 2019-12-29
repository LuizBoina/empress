const Store = require('../../models/store');
const {transformStore} = require('./merge');
const storeResolver = {
    stores: async () => {
        try {
            const stores = await Store.find();
            return stores.map( store => {
                return transformStore(store);
            });
        } catch (err) {
            throw err;
        }
    },
    store: async args => {

    },
    createStore: async (root, args, context) => {

    },
};

module.exports = storeResolver;