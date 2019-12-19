const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
    code : { type: Number, required: true },
    cnpj: { type:String, match: /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/ },
    latLng : {
        lat: { type: String, required: true },
        lng: { type: String, required: true }
    },
    options: {
        name: { type: String, required: true, unique: true },
        price: { type: Number, required: true, unique: true }
    },
    query: [{ type: Schema.ObjectId, ref: 'Print' }],
    fineshedPrints: [{
        print: { type: Schema.ObjectId, ref: 'Print' },
        printTime: { type: Date, default: Date.now }
    }],
    acceptPicPay: { type: Boolean, default: false },
    picPayaccount: { type: String },
    printNumber: { type: Number },
    Earning: { type: Number }

}, {
    timestamp: true
});

module.exports = mongoose.model('Store', storeSchema);