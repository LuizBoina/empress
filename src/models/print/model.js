const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const printSchema = new Schema({
        store: { type: Schema.Types.ObjectId, ref: 'Store' },
        costumer: { type: Schema.Types.ObjectId, ref: 'User' },
        options: [{ type: String }],
        orderTime: { type: Date, default: Date.now },
        total: { type: Number, required: true },
        file: { type: String/*Schema.Types.Mixed*/, required: true },
        alreadyPayied: { type: Boolean, required: true }, //that means payment realized with PicPay
});

module.exports = mongoose.model('Print', printSchema);