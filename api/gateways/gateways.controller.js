var controller =  {};
const services = require("./gateways.service");
const endpoints =  require("../endPoints");
const config =    require("../../config/readConfig.js");

/** controller  : gateway
     function   : fecth gateway details by userHID
    description : This controller function fetch gateway details by userHID HID
    api endpoint : /api/v1/kronos/gateways?userHids=
**/


controller.getAllGatewaysByUHid =  function(req,res){
  let _page =  req.query.page || 1;
  let _size =  req.query.size  || 100;
  let uhid =   req.params.uhid;
  let headers =  {"x-auth-token":config.API_KEY};
  let url =   endpoints.gateways.getAll+"?userHids="+uhid+"&_size="+_size+"&_page"+_page;
  console.log(url);
  let options = {
    uri:url,
    headers:headers
  }
  services.getAllGateways(options,function(err,response){

     if(!err){

       if(response.statusCode==200){
           console.log("====fetch gatewaysdata  ok====");
           res.status(200).json(JSON.parse(response.body));

         }
        else {
          res.status(response.statusCode).json(JSON.parse(response.body));
          console.log("====error while fetching  gateways====");
         }

      }
     else {

            res.status(500).json({message:"failed","Error":err});
            console.log(err);

      }
   });


}

/** controller  : gateway
     function   : fecth devices under gateway
    description : This controller function fetch devices detail by gateway HID
    api endpoint : /api/v1/kronos/gateways/{gatewayHid}/devices
**/
controller.getAllDevicesbyGateway= function(req,res){

  let gid =   req.params.gid;
  let headers =  {"x-auth-token":config.API_KEY};
  let url =   endpoints.gateways.getAll+"/"+gid+"/devices"
 let options = {
  uri:url,
  headers:headers
 }
  services.getAllGateways(options,function(err,response){

     if(!err){

        if(response.statusCode==200){
           console.log("====fetch devices by gateway id  ok====");
           res.status(200).json(JSON.parse(response.body));
           console.log("device",JSON.parse(response.body));

         }
        else {
          res.status(response.statusCode).json(JSON.parse(response.body));
          console.log("====error while fetching  devices====");
         }

       }
     else {

            res.status(500).json({message:"failed","Error":err});
            console.log(err);
      }
   });

}

 exports = module.exports = controller;
