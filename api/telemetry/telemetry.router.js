const router = require("express").Router();
var controller =  require("./telemetry.controller.js");
router.get('/devices/:hid',controller.getAllTelmetryByDeviceHId);
exports=module.exports = router;
