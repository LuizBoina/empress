const Store = require('../../models/store');

const storeResolver = {
    stores: async () => {
        try {
            const stores = await Store.find();
            return stores.map( store => {
                return
            })
        } catch (err) {
            throw err;
        }
    },
    store: async args => {

    }
};

module.exports = storeResolver;