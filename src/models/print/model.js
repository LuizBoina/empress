const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const printSchema = new Schema({
        costumer: { type: Schema.Types.ObjectId, ref: 'User' },
        options: [{ type: String }],
        orderTime: { type: Date, default: Date.now },
        total: { type: Number, required: true },
        file: { type: Schema.Types.Mixed, required: true },
        alreadyPayied: { type: Boolean, required: true }, //that means payment realized with PicPay
});

module.exports = mongoose.model('Print', printSchema);