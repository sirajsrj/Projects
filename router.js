/*
 routing file for each api module
*/

var router = require('express').Router();
router.use('/auth',require('./api/auth/auth.router'));
router.use('/devices',require('./api/devices/devices.router'));
router.use('/gateways',require('./api/gateways/gateways.router'));
router.use('/telemetry', require('./api/telemetry/telemetry.router'));
router.use('/companies', require('./api/company/company.router'));
router.use('/applications', require('./api/application/application.router'));
router.use('/subscriptions', require('./api/subscription/subscription.router'));
exports = module.exports = router;
