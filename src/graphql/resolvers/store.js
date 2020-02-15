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
    store: async args => {
        try {
            const store = await Store.findById(args.id);
            return transformStore(store);
        } catch (err) {
            throw err;
        }
    },
    createStore: async args => {
        try {
            if(!/[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2}/g.test(args.storeInput.cnpj))
                throw new Error('CNPJ inválido');
            const stores = await Store.find();
            args.storeInput.code = stores.length + 1;
            args.storeInput.cnpj = args.storeInput.cnpj.replace(/\D/g,'');
            const result = await Store.create(args.storeInput);
            return {...result._doc, _id: result.id};
        } catch (err) {
            throw err;
        }
    },
    updateStore: async args => {
        try {
            if(!/[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2}/g.test(args.storeInput.cnpj))
                throw new Error('CNPJ inválido');
            args.storeInput.cnpj = args.storeInput.cnpj.replace(/\D/g,'');
            const result = await Store.findOneAndUpdate({_id: args.storeId}, args.storeInput,{new: true});
            return {...result._doc, _id: result.id};
        } catch (err) {
            throw err;
        }
    },
    deleteStore: async args => {
        try {
            await Store.findByIdAndDelete(args.storeId);
            return "store deleted!";
        } catch (err) {
            throw err;
        }
    }
};

module.exports = storeResolver;