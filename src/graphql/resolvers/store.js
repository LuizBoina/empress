const Store = require('../../models/store');
const {transformStore} = require('./merge');
const storeResolver = {
    stores: async () => {
        try {
            const stores = await Store.find();
            return stores.map(store => {
                return transformStore(store);
            });
        } catch (err) {
            throw err;
        }
    },
    store: async (root, args, context) => {
        try {
            const store = await Store.findOne({latLng: args.latLngInput});
            return {
                ...transformStore(store),
                ...context
            }
        } catch (err) {
            throw err;
        }
    },
    createStore: async (root, args, context) => {
        try {
            const result = Store.create(args.storeInput);
            return {
                ...result,
                ...context
            };
        } catch (err) {
            throw err;
        }
    },
};

module.exports = storeResolver;