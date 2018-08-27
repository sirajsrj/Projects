const router = require("express").Router();
var controller =  require("./gateways.controller.js");
router.get('/getall/:uhid',controller.getAllGatewaysByUHid);
//router.get('/getall/:aphid',controller.getAllGatewaysByGAppHid);
router.get('/:gid/devices',controller.getAllDevicesbyGateway);
exports=module.exports = router;
