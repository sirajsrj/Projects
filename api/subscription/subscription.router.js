const router = require("express").Router();
const controller = require("./subscription.controller");
router.get('/get/:SHid',controller.getSubscriptionBySHid);
exports=module.exports = router;
