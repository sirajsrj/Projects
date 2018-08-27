
var services = {};
const request =  require("request");
services.getAllGateways= function(options,cb){
  request.get(options,function (err, response) {
           cb(err,response);
      });

  }

exports = module.exports = services;
