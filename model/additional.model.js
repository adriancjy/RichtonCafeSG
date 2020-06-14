const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Additional = new Schema({
    menuitem : {
        menu_item_name: {
            type: String
        },
        menu_item_price: {
            type: String
        }
    }
    
                   /*mongoose.model('','collection name')*/
});
module.exports = mongoose.model('additional', Additional, 'Additional');