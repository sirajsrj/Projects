
const router = require("express").Router();
var controller =  require("./company.controller.js");
router.get('/get/:CHid',controller.getCompanyByCHid);
exports=module.exports = router;
