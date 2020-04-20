const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Menu = new Schema({
    menuitem : {
        menu_item_name: {
            type: String
        },
        menu_item_price: {
            type: String
        },
        menu_item_availability: {
            type: String
        }
    },
    user : {
        name : {
            type: String
        }
    }
    
                   /*mongoose.model('','collection name')*/
});
module.exports = mongoose.model('menu', Menu, 'Menu');