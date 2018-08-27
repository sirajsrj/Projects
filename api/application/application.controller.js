var controller =  {};
/*
 request module to make htpp calls
*/
const request =  require("request");
const endpoints =  require("../endPoints");
const config =    require("../../config/readConfig.js");
/**
    This controller function fetch the Application By Application HID
    api endpoint : /api/v1/pegasus/applications/{ApplicationHid}

**/
controller.getApplicationByAHid =  function(req,res){
 let AHid    =  req.params.AHid || "";
 let headers =  {"x-auth-token":config.TENANT_KEY};
 let url     =  endpoints.application.getById+"/"+AHid
         request.get({
             uri: url,
             headers:headers
            }, function (err, response) {
                 if(!err){
                       console.log("status code::",response.statusCode);
                      if(response.statusCode==200){
                         console.log("====fetch application ok====");
                         res.status(200).json(JSON.parse(response.body));
                         console.log("appication data",JSON.parse(response.body));

                      }
                      else {
                        res.status(response.statusCode).json(JSON.parse(response.body));
                        console.log("====Error while feching data=====");
                     }
                  }

               else {
                     res.status(500).json({message:"error while fecthing data","Error":err});
                     console.log(err);
                 }
          });
}

 exports = module.exports = controller;
