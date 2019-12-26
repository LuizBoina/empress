const userResolver = require('../resolvers/user');
const storeResolver = require('../resolvers/store');
/*const Resolver = require('');*/

const rootResolver = {
    ...userResolver,
    ...storeResolver,
};

module.exports = rootResolver;