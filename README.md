# Arrow Connect

Arrow Connect is a comprehensive software platform for secure development, implementation and management of IoT devices, connectivity, applications, and analytics. The software platform helps developers and customers accelerate the time to solution development by abstracting and removing complexity thus, enabling the rapid, secure, and scalable flow of data from sensor to the cloud.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites

System must be installed with latest stable version of node, to check node version

```
node -v
```

### Installing

Clone this repository 

Install all the dependencies
```
npm install
```

To run the production build & make running the server side javascript in the port [http://localhost:3002/]
```
npm start
```

For development purpose, run the following command. This will make running the client side javascript in the port [http://localhost:3000/]
```
npm run client
```
### Folder Structure
```
Arrow-Connect
├── api                                      # API logic
│   └── application
│   └── auth
│   └── company
│   └── gateways
│   └── subscription
│   └── telemtry
│   └── endpoint.js                          # All api endpoints listed here
├── bin
├── build                                    # Production Build
├── config                                   # development tools configuration ie building and running webpack dev server
├── Documents                             
│   └── ArrowPScript
│       └── AccountNew.csv
│       └── arrowPS.ps1
│       └── arrowPS2.ps1
│       └── CSVFileBlobToLocal(Step1).txt
│       └── CustomizationScript(Step2).txt
│       └── CSVFileLocalToBlob(Step3).txt
│       └── jobDefinition.json
├── node_modules
├── public
│   └── css
│   └── fonts
│   └── images
│   └──js
│   └── favicon.ico
│   └── index.html
│   └── manifest.json
├── services
├── src
│   └── components                           # Views seprated by Components
│   └── constants                            # Constants (APIs, url)
│   └── App.js
│   └── index.css
│   └── index.js
│   └── registerServiceWorker.js
├── .gitignore
├── app.js                                   
├── package.json
├── README.md
├── router.js                                
├── yarn.lock
```

## API Details
ACS 

* [Base URL](http://pgsdev01.arrowconnect.io:11003): http://pgsdev01.arrowconnect.io:11003 

| API           | Custom APP API                               | Arrow API
| --- | ---  | -----
| Application   | /api/v1/arrowconnect/applications/get/{ahid} | /api/v1/pegasus/applications/{ahid}
| Company       | /api/v1/arrowconnect/companies/get/{cHid}    | /api/v1/pegasus/companies/{cHid} 
| Subcription   | /api/v1/arrowconnect/subscriptions/get/{sHid}| /api/v1/pegasus/subscriptions/{sHid} 
| User (Login)  | /api/v1/arrowconnect/auth/login              | /api/v1/pegasus/users/auth2 

ACN 

* [Base URL](http://pgsdev02.arrowconnect.io:12001): http://pgsdev02.arrowconnect.io:12001 

| API            | Custom APP API                                    | Arrow API
| ---  | ---  | ---
| Devices        | /api/v1/arrowconnect/gateways/{ghid}/devices      | /api/v1/kronos/gateways/{ghid}/devices 
| Gateway        | /api/v1/arrowconnect/gateways/getall/{userHid}    | /api/v1/kronos/gateways?userHid=userHid  
| Telemetry      | /api/v1/arrowconnect/telemetry/devices/{deviceHid}| /api/v1/kronos//api/v1/kronos/telemetries/devices/{deviceHid}/latest  
| Live telemetry | Socket.io client                                  | /api/v1/kronos/devices/{deviceHid}/telemetry/{telemetryType}  

## Documents 
 
### Power Shell Script(PS1, PS2, PS3)
Go to Documents/ArrowPScript/AccountNew.csv - file in which user credentials and application related information is placed.

Fetch the CSV File came from PS2 and it will be saved in D:/CSVUpload/AccountNew.csv - Here all the details of Event Hub Name, Event Hub Key ,Storage Account Name and Storage Account Key, Stream Analytics Name and JSON file(JobDefinition.JSON) which would contain the Input and Output of the Stram Analytics Job, SQl Table Name , SQL Server, SQL User Name, SQL Password information are placed

1. PS1 - Script to create 10 VMs reading the CSV file AccountNew.csv and store their respective IP
2. PS2 - Downloading Node Environment, gitlab Environment etc. on the VM connected. Cloning the Custom application , changing the required api key and code in accordance to the vm and running the application on localhost. 
3. PS3 - Fetch the CSV File came from PS2 and it will be saved in D:/CSVUpload/AccountNew.csv
   1. Here all the details of Event Hub Name, Event Hub Key ,Storage Account Name and Storage Account Key, Stream Analytics Name and JSON file(JobDefinition.JSON) which would contain the Input and Output of the Stream Analytics Job, SQl Table Name , SQL Server, SQL User Name, SQL Password
   2. Then Event Hub will contain all the data coming from API which is passed as an Input to Stream Analytics and further passed to SQL Server as an Output 
   3. After creation all the details are being stored in same CSV File under D:\CSVUpload\AccountNew.csv  and sent to Blob Storage.
   4. Then we can view it in PowerBI



## Built With

* [React](https://github.com/facebook/react) - The web framework used
* [npm](https://www.npmjs.com/) - For managing packages and for runnning tasks
* [node.js](https://nodejs.org/en/) - For server side js framewok


"# Projects" 
