var controller =  {};

const request =  require("request");
const endpoints =  require("../endPoints");
const config =    require("../../config/readConfig.js");


/** controller  :  subscription
     function   : fecth subscription details by subscription HID
    description : This controller function fetch subscription details by subscription HID
    api endpoint : /api/v1/pegasus/subscriptions/{shid}
**/


controller.getSubscriptionBySHid =  function(req,res){
 let SHid    =  req.params.SHid || "";
 let headers =  {"x-auth-token":config.TENANT_KEY};
 let url     =  endpoints.subscription.getById+"/"+SHid
         request.get({
             uri: url,
             headers:headers
          }, function (err, response) {
              if(!err){
                   console.log("status code::",response.statusCode);
                 if(response.statusCode==200){
                     console.log("====fetch subscription data ok====");
                     res.status(200).json(JSON.parse(response.body));
                     console.log("subscription data",JSON.parse(response.body));

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
