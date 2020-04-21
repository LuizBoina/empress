const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const printSchema = new Schema({
    store: {type: Schema.Types.ObjectId, ref: 'Store'},
    costumer: {type: Schema.Types.ObjectId, ref: 'User'},
    options: [{type: String}],
    pages: {
        firstPage: {type: Number, required: true},
        lastPage: {type: Number, required: true}
    },
    orderTime: {type: Date, default: Date.now},
    total: {type: Number, required: true},
    file: {type: String/*Schema.Types.Mixed*/, required: true},
    alreadyPayed: {type: Boolean, required: true}
});

module.exports = mongoose.model('Print', printSchema);