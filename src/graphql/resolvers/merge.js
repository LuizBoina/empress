const DataLoader = require('dataloader');
const User = require('../../models/user');
const Print = require('../../models/print');
const Store = require('../../models/store');

const dateToString = date => new Date(date).toISOString();

const printLoader = new DataLoader(printIds => {
    return prints(printIds);
});

const prints = async printIds => {
    try {
        const prints = await Print.find({_id: {$in: printIds}});
        prints.sort((a, b) => {
            return a._doc.orderTime > b._doc.orderTime ? 1 : a._doc.orderTime < b._doc.orderTime ? -1 : 0;
        });
        return prints.map(print => {
            return transformPrint(print);
        })
    } catch (err) {
        throw err;
    }
};

const transformPrint = print => {
    try {
        return {
            ...print._doc,
            store: store.bind(this, print._doc.store),
            costumer: user.bind(this, print._doc.storeAdmin),
            orderTime: dateToString(print._doc.orderTime)
        };
    } catch (err) {
        throw err;
    }
};

const fPrintLoader = new DataLoader(fPrintIds => {
    return fPrints(fPrintIds);
});

const fPrints = async fPrintIds => {
    try {
        const fPrints = await Print.find({_id: {$in: fPrintIds}});
        fPrints.sort((a, b) => {
            return a._doc.printTime > b._doc.printTime ? 1 : a._doc.printTime < b._doc.printTime ? -1 : 0;
        });
        return fPrints.map(fPrint => {
            return transformFPrint(fPrint);
        });
    } catch (err) {
        throw err;
    }
};

const transformFPrint = fPrint => {
    try {
        return {
            ...fPrint._doc,
            store: store.bind(this, fPrint._doc.store),
            costumer: user.bind(this, fPrint._doc.storeAdmin),
            orderTime: dateToString(fPrint._doc.orderTime),
            printTime: dateToString(fPrint._doc.printTime)
        };
    } catch (err) {
        throw err;
    }
};

const userLoader = new DataLoader(userIds => {
    return User.find({_id: {$in: userIds}});
});

const user = async userId => {
    try {
        const user = /*await User.findById(userId);*/await userLoader.load(userId);
        return {
            ...user._doc,
            _id: user.id,
        };
    } catch (err) {
        throw err;
    }
};

const storeLoader = storeIds => {
    return stores(storeIds);
};

const store = async storeId => {
    try {
        return await storeLoader.load(storeId.toString());
    } catch (err) {
        throw err;
    }
};

const stores = async storeIds => {
    try {
        const stores = await Store.find({_id: {$in: storeIds}});
        return stores.map(store => {
            return transformStore(store);
        });
    } catch (err) {
        throw err;
    }
};

const transformStore = store => {
    try {
        return {
            ...store._doc,
            _id: store.id,
            storeAdmin: user(store._doc.storeAdmin),
            query: () => printLoader.loadMany(store._doc.query),
            finishedPrints: () => fPrintLoader.loadMany(store._doc.finishedPrints),
            createdAt: dateToString(store.createdAt),
            updateAt: dateToString(store.updatedAt)
        }
    } catch (err) {
        throw err;
    }
};

exports.transformStore = transformStore;
exports.transformPrint = transformPrint;
exports.transformFPrint = transformFPrint;