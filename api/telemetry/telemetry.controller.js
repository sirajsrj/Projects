var controller =  {};
const request =  require("request");
const endpoints =  require("../endPoints");
const config =    require("../../config/readConfig.js");
//const functions = require ("../location/location.controller.js");

/** controller  : telemetry
     function   : fecth telemetry details by deviceHid
    description : This controller function fetch device telemetry data for device using deviceHid
    api endpoint : /api/v1/kronos/telemetries/devices/{deviceHid}
**/




controller.getAllTelmetryByDeviceHId =  function(req,res){
  let headers =  {"x-auth-token":config.API_KEY};
  let deviceHid = req.params.hid;
  console.log(deviceHid);

         request.get({
             uri: endpoints.telemetry.getTelemetryByDeviceHid+"/"+deviceHid+"/latest",
             headers:headers
          }, function (err, response) {
              if(!err){
                   console.log("status code::",response.statusCode);
                 if(response.statusCode==200){
                     console.log("====telemetry data list ok====");
                     //console.log("devices",response.body);
                     var checkLatLong = JSON.parse(response.body).data.filter(telemetry => telemetry.name.toUpperCase() === 'LATLONG');
                     if (checkLatLong.length){
                        console.log('saving latlong to azure SQL table');
                        var table_datas = [];
                        var latlong = checkLatLong[0].floatSqrValue.split('|')
                        table_datas.push("'"+checkLatLong[0].deviceHid+"'")
                        table_datas.push(latlong[0])
                        table_datas.push(latlong[1]) 
                        //functions.addDataToTable({ table_name: 'ApiData2', table_data: table_datas });
                     }
                     res.status(200).json(JSON.parse(response.body));

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
