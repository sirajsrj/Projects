
var services = {};
const request =  require("request");
var fs         = require("fs");
services.getAllDevices= function(options,userHid){
  request.get(options,function (err, response) {
                        if(!err){
                          if(response.statusCode==200){
                             console.log("====fetch devices data ok====");
                             console.log(JSON.parse(response.body));
                             var data = JSON.parse(response.body).data || [];
                             var devices = [];
                             data.forEach(function(obj){
                             let device =  {deviceHid:obj.hid};
                              devices.push(device);
                             });
                             try{
                              fs.writeFile('devices.json',JSON.stringify(devices));
                            }catch(err){
                              console.log("error while writing to file",err);
                            }
                            }
                        }
      });

  }

exports = module.exports = services;
