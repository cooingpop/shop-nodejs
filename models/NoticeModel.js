var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var NoticeSchema = new Schema({
    subject : String,
    contents : String,
    create_at : {
        type : Date,
        default : Date.now()
    },
    contact_id : Number
});

NoticeSchema.plugin(autoIncrement.plugin,
    {
        model : "boards",
        field : "id",
        startAt : 1
    }
);
module.exports = mongoose.model("boards", NoticeSchema);
