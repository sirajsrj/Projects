/*
Here,add all api point for application api
*/

const router = require("express").Router();
var controller =  require("./application.controller.js");
router.get('/get/:AHid',controller.getApplicationByAHid);
exports=module.exports = router;
