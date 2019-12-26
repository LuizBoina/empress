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
        password: String!
        role: String!
        store: Store
        photo: String
    }
    
    type AuthData {
        userId: ID!
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
        store: Store!
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
        store: StoreInput
        photo: String
    }
    
    input StoreInput {
        storeAdmin: UserInput!
        code: Int!
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
        store(latLng: LatLng!): Store
        prints: [Print!]
        finishedPrints: [FinishedPrint!]
        login(userName: String!, password: String!): AuthData!
        logout(id: String!, token:String!)
    }
    
    type RootMutation {
        createUser(userInput: UserInput): User
        createStore(storeInput: StoreInput): Store
        createOption(optionInput: OptionInput): Option
        createPrint(printInput: PrintInput): Print
    }
    
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);