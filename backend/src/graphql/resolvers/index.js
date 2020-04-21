const userResolver = require('../resolvers/user');
const storeResolver = require('../resolvers/store');
const printResolver = require('../resolvers/print');

const rootResolver = {
    ...userResolver,
    ...storeResolver,
    ...printResolver,
};

module.exports = rootResolver;