var controller =  {};

const request =  require("request");
const endpoints =  require("../endPoints");
const config =    require("../../config/readConfig.js");

/** controller  : company
     function   : fecth company details by company HID
    description : This controller function fetch company details by company HID
    api endpoint : /api/v1/pegasus/companies/{companyHid}
**/

controller.getCompanyByCHid =  function(req,res){
 let CHid    =  req.params.CHid || "";
 let headers =  {"x-auth-token":config.TENANT_KEY};
 let url     =  endpoints.company.getById+"/"+CHid;

              request.get({
               uri: url,
               headers:headers
            }, function (err, response) {
                  if(!err){
                         console.log("status code::",response.statusCode);
                         if(response.statusCode==200){
                           console.log("====fetch company details ok====");
                           res.status(200).json(JSON.parse(response.body));
                           console.log("company data",JSON.parse(response.body));
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
