
var controller =  {};
/*
 request module to make http call
*/
const request =  require("request");
const endpoints =  require("../endPoints");
const config =    require("../../config/readConfig.js");
const services = require("./devices.util");
/** controller  : auth
     function   : login
    description : This controller function validate the user calling below api endpoint
    api endpoint : /api/v1/pegasus/users/auth2
**/


controller.login =  function(req,res){

 let email    = req.body.email;
 let password = req.body.password;
 console.log("email",email);
 let data =     {
                "applicationCode" : config.APP_CODE,
                "username" :email,
                "password":password
               }

 let headers =  {"x-auth-token":config.API_KEY};
 let body    =  JSON.stringify(data);
                console.log(body);

   if(email!='undefined' && password!='undefined') {
         request.post({
             uri: endpoints.account.login,
             headers:headers,
             body:body
          }, function (err, response) {
              if(!err){
                        console.log("status code::",response.statusCode);
                       if(response.statusCode==200){
                          console.log("====login ok====");
                          res.status(200).json(JSON.parse(response.body));
                          let userHid = JSON.parse(response.body).userHid;
                          console.log("userHid",userHid);
                          let url = endpoints.devices.getAll+"?userHid="+userHid;
                          let options = {
                            uri:url,
                            headers:headers
                          }
                          services.getAllDevices(options,userHid);
                        }
                else {
                     res.status(response.statusCode).json(JSON.parse(response.body));
                     console.log("====login failed====");
                   }
               }

              else {
                   res.status(500).json({message:"login failed","Error":err});
                   console.log(err);
              }
          });
 }
 else {
    res.status(400).json({"message":"username and password required"});
 }

}

 exports = module.exports = controller;
