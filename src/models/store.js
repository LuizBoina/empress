const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
    storeAdmin: {type: Schema.ObjectId, ref: 'User'},
    code: {type: Number, required: true},
    cnpj: {type: String},
    latLng: {
        lat: {type: String, required: true},
        lng: {type: String, required: true}
    },
    options: {
        name: {type: String, required: true, unique: true},
        price: {type: Number, required: true, unique: true}
    },
    query: [{type: Schema.ObjectId, ref: 'Print'}],
    finishedPrints: [{
        print: {type: Schema.ObjectId, ref: 'Print'},
        printTime: {type: Date, default: Date.now}
    }],
    acceptPicPay: {type: Boolean, default: false},
    picPayAccount: {type: String},
    printNumber: {type: Number},
    Earning: {type: Number},
    monthlyAccess: {type: Number}

}, {
    timestamp: true
});

module.exports = mongoose.model('Store', storeSchema);