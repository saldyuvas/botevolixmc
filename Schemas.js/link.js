const {model, Schema} - require(moongose)

let linkSchema = new Schema{{
    Guild: String,
    Perms: String
}};

module.exports = model("linkS", linkSchema);
