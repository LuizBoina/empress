const userResolver = require('../resolvers/user');
/*const Resolver = require('');
const Resolver = require('');*/

const rootResolver = {
    ...userResolver,

};

module.exports = rootResolver;