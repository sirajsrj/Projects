/*
Here,add all api point for application api
*/

const router = require("express").Router();
var controller =  require("./devices.controller.js");
router.get('/:Hid/location',controller.getDeviceLocation);
exports=module.exports = router;
