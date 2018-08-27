//const ACN = "http://pgsdev01.arrowconnect.io:12001";
const ACN = "http://pgsdev02.arrowconnect.io:12001"; //ACN API
const ACS = "http://pgsdev01.arrowconnect.io:11003"; // ACS API
const endPoints = {
account: {
          login:ACS+"/api/v1/pegasus/users/auth2"
},
gateways: {
getAll : ACN+"/api/v1/kronos/gateways"
},
devices: {
 getAll: ACN+"/api/v1/kronos/devices"

},
telemetry:{
 getTelemetryByDeviceHid:ACN+"/api/v1/kronos/telemetries/devices"
},
subscription:{ getById:ACS+"/api/v1/pegasus/subscriptions"

},
application:{getById:ACS+"/api/v1/pegasus/applications"
},
company:{getById:ACS+"/api/v1/pegasus/companies"
}

}

exports = module.exports = endPoints;
