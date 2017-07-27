var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var ContactsSchema = new Schema({
    content : String,
    create_at : {
        type : Date,
        default : Date.now()
    },
    contact_id : Number
});

ContactsSchema.plugin(autoIncrement.plugin,
    {
        model : "contacts",
        field : "id",
        startAt : 1
    }
);
module.exports = mongoose.model("contacts", ContactsSchema);
