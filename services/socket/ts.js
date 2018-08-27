const ws = require('ws');
var socketServices = {};

const config =    require("../../config/readConfig.js");
/*
 createSocket: create socket connection for the specific telemetryType
*/
socketServices.createSocket=function(options){
 let url = options.url;
 let headers =   {'x-arrow-apikey':config.API_KEY}
 var socket = new ws(url, {headers:headers });
 return socket;
}

/*
 createStream : this function listen for socket event for telemetry data and send it to client browser
*/
socketServices.createStream = function(socket){
     var that = this;
     socket.on("createNewTelemetryStream",function(config){
     let deviceHid = config.deviceHid;
     console.log("deviceHid",deviceHid);
     let telemetryType = config.telemetryType;
     let options = {};
     options.url ="http://pgsdev02.arrowconnect.io:12001/api/v1/kronos/devices/"+deviceHid+"/telemetry/"+telemetryType;
     var arrowSocket= that.createSocket(options);

     arrowSocket.on('open',function() {
       console.log("connected to telemetry socket");
     });

     arrowSocket.on('close',function() {
          console.log("arrow socket stream closed");

     });
     arrowSocket.on('message',function(data,flags) {
       try {
         var tempdata = [];
         tempdata.push(data);
        // console.log("live data",data);

         socket.emit("data", { data: tempdata});
       }
       catch(err){
         console.log("===something error===",err);
       }
     });

       arrowSocket.on('error', function(err) {
        console.log("err");
       });

      socket.on('close',function(){
       arrowSocket.close();
      })
      socket.on("disconnect",function(){
        if(arrowSocket){
          try {
          arrowSocket.close();
       } catch(err){
         console.log("error while closing arrow socket");
        }
       }
     })
 })

}



module.exports = socketServices;
