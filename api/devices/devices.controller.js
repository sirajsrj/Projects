var controller =  {};
/*
 request module to make htpp calls
*/
const request =  require("request");
const endpoints =  require("../endPoints");
const config =    require("../../config/readConfig.js");
/**
    This controller function fetch the device location

**/
controller.getDeviceLocation=  function(req,res){
 let deviceHid    =  req.params.Hid || "";
 console.log("deviceHid to get location",deviceHid);
 let headers =  {"x-auth-token":config.API_KEY};
 let url     =  endpoints.devices.getAll+"/"+deviceHid +"/location"
         request.get({
             uri: url,
             headers:headers
            }, function (err, response) {
                 if(!err){
                       console.log("status code::",response.statusCode);
                      if(response.statusCode==200){
                         console.log("====fetch device location ok====");
                         res.status(200).json(JSON.parse(response.body));
                         console.log("device location data",JSON.parse(response.body));

                      }
                      else {
                        res.status(response.statusCode).json(JSON.parse(response.body));
                        console.log("====Error while location data=====");
                     }
                  }

               else {
                     res.status(500).json({message:"error while fecthing data","Error":err});
                     console.log(err);
                 }
          });
}

 exports = module.exports = controller;
