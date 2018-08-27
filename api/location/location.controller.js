
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var config = require('../../config/sqlDBconfig.js');
// Create connection to database

   var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function (err) {
   if (err) {
      console.log(err)
      connection.close()
   }
   else {
      console.log('Connection to azure started')
      //addDataToTable({ table_name: 'ApiData2', table_data: ['1', '2', '3'] });
   }
});
connection.on('end', function (err) {
   if (err) {
      console.log(err)
   }
   else {
      console.log('Connection to azure closed')
      //addDataToTable({ table_name: 'ApiData2', table_data: ['1', '2', '3'] });
   }
});
exports.addDataToTable = function(table){
   console.log('Adding data to table : ', table.table_name);
   var data = '';
   table.table_data.map(value=>data=data+value+',');
   var CHECK_QUERY = 'SELECT * FROM ' + table.table_name + ' WHERE hid = '+table.table_data[0];
   var INSERT_QUERY = 'INSERT INTO ' + table.table_name + ' VALUES (' + data.slice(0, -1) +') ';
   var UPDATE_QUERY = 'UPDATE ' + table.table_name + ' SET latitude = ' + table.table_data[1] + ', longitude = ' + table.table_data[2] + ' WHERE hid = ' + table.table_data[0];
   /*QUERY FOR UPDATE OR INSERT IN THW TABLE*/
   var QUERY = 'begin tran '+
   ' if exists(' + CHECK_QUERY+') '+
   ' begin '+
   UPDATE_QUERY+
   ' end '+
   ' else '+
   ' begin '+
   INSERT_QUERY+
   ' end'+
   ' commit tran ';

   //console.log(QUERY);
   var request = new Request(
      QUERY,
      function (err) {
         if (err) {
            console.log('error while creatin request',err, err.RequestError);
            connection = new Connection(config);
         }else{
            console.log('successfully inserted')
         }
      }
   );
   try{
   connection.execSql(request);
   }
   catch(error){
      connection.close()
      console.log("exec sql error ",error);
   }
}


