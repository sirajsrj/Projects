const fs = require("fs");
var contents = fs.readFileSync("./config/config.json");
var config = JSON.parse(contents);
exports= module.exports = config.value[0];
