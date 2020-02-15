const {buildSchema} = require('graphql');

module.exports = buildSchema(`
    type Print {
        _id: ID!
        costumer: User!
        store: Store!
        options: [String!]!
        orderTime: String!
        total: Float!
        file: String!
        alreadyPaid: Boolean!
    }
    
    type User {
        _id: ID!
        email: String!
        name: String!
        phoneNumber: String
        password: String
        role: String!
        photo: String
    }
    
    type AuthData {
        userId: ID!
        role: String!
        token: String!
        tokenExpiration: Int!
    }
    
    type Store {
        _id: ID!
        storeAdmin: User!
        code: Int!
        cnpj: String
        latLng: LatLng!
        options: [Option!]!
        query: [Print]
        finishedPrints: [FinishedPrint]
        acceptPicPay: Boolean!
        picPayAccount: String
        printNumber: Int!
        Earning: Float!
        createdAt: String
        updateAt: String
        isActivated: Boolean!
    }
    
    type FinishedPrint {
        print: Print!
        printTime: String!
    }
    
    type LatLng {
        lat: String!
        lng: String!
    }
    
    type Option {
        name: String!
        price: Float!
    }
    
    input PrintInput {
        costumer: UserInput!
        store: StoreInput!
        options: [String!]!
        orderTime: String!
        total: Float!
        file: String!
        alreadyPaid: Boolean!
    }
    
    input UserInput {
        email: String!
        name: String!
        phoneNumber: String
        password: String!
        role: String!
        photo: String
    }
    
    input StoreInput {
        storeAdmin: String!
        code: Int
        cnpj: String
        latLng: LatLngInput!
        acceptPicPay: Boolean!
        picPayAccount: String
    }
    
    input OptionInput {
        name: String!
        price: Float!
    }
    
    input LatLngInput {
        lat: String!
        lng: String!
    }
    
    type RootQuery {
        stores: [Store!]
        store(id: ID!): Store
        prints: [Print!]
        finishedPrints: [FinishedPrint!]
        login(userName: String!, password: String!): AuthData!
        logout(id: String!, token:String!): Boolean
    }
    
    type RootMutation {
        createUser(userInput: UserInput): User
        updateUser(userId: ID!, userInput: UserInput): User
        deleteUser(userId: ID!): String
        createStore(storeInput: StoreInput): Store
        updateStore(userID: ID!, storeInput: StoreInput): Store
        deleteStore(storeId: ID!): String
        createPrint(printInput: PrintInput): Print
        deletePrint(printId: ID!): String
    }
    
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);