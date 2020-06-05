const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Order = new Schema({
    OrderID: {type: String}
}, {strict: false});
module.exports = mongoose.model('order', Order, 'Order');