const router = require("express").Router();
var authController =  require("./auth.controller.js");
router.post('/login',authController.login);
exports=module.exports = router;
