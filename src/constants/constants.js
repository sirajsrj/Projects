import config from './ipconfig.json';
const ip = config.value[0].IP;
const port = config.value[0].PORT;
const url = 'http://' + ip + ':' + port;


export default {
   config: config.value[0],
   url : url,
   login: url + '/api/v1/arrowconnect/auth/login',
   getGateways: url +'/api/v1/arrowconnect/gateways/getall/',/*$UID*/
   getDevices: url + '/api/v1/arrowconnect/gateways/', /*id/devises*/
   getTelemetry: url + '/api/v1/arrowconnect/telemetry/devices/',/*$deviceHid/fromTimestamp?/toTimestamp?*/
   getApplication: url + '/api/v1/arrowconnect/applications/get/',/*$ApplicationHid*/
   getCompany: url + '/api/v1/arrowconnect/companies/get/',/*$CompanyHid*/
   getSubscription: url + '/api/v1/arrowconnect/subscriptions/get/',/*$SubscriptionHid*/
   getLocation: url + '/api/v1/arrowconnect/devices/'/*$deviceHid/location */

}
