/* please dont delete these
/* jshint undef: true, unused: true */
/* globals io */
import React, { Component } from 'react';
import APIs from '../../constants/constants';

export default class TelemetryChart extends Component {
   constructor(props) {
      super(props);
      this.state = {
         socket: null,
         socketDeviceID: null,
         socketTelemetryname: null,
         telemetryType:null,
         telemtrySize: null,
         chartState: false,
         isChartLoading: null

      }
   }
   componentDidMount() {
      const { socketDeviceID, socketTelemetryname, socket } = this.props;
      const { telemetryChartData } = this.state;

      this.setState({ socket: socket, socketDeviceID: socketDeviceID, socketTelemetryname: socketTelemetryname })
   }
   componentWillReceiveProps(nextProps) {
      const { socketDeviceID, socketTelemetryname, socket } = nextProps;
      this.setState({ socket: socket, socketDeviceID: socketDeviceID, socketTelemetryname: socketTelemetryname })
   }


   startSocketStream = (deviceHid, telemetryName, telemetryType, socket, telemtrySize) => {
      console.log(deviceHid, telemetryName, telemetryType, socket, telemtrySize)
      var chart = '';
      if (telemtrySize) {
         if (telemetryType.toUpperCase()==='FLOAT') {
            console.log(deviceHid, telemetryName, socket)
            this.setState({ chartState: true, socketDeviceID: deviceHid, telemetryType: telemetryType, socketTelemetryname: telemetryName, telemtrySize: telemtrySize }, () => {
               var telemetryChartData = []
               chart = new window.CanvasJS.Chart("chartContainer", {
                  exportEnabled: true,
                  title: {
                     text: telemetryName
                  },
                  axisY: {
                     title: "Value",
                     includeZero: false
                  },
                  data: [{
                     type: "spline",
                     color: "rgb(0, 164, 155)",
                     markerSize: 0,
                     dataPoints: telemetryChartData
                  }]
               });

               socket.emit("createNewTelemetryStream", { deviceHid: deviceHid, telemetryType: telemetryName }, (data) => {
                  console.log('callback check')
               });
               socket.on("data", (data) => {
                  this.setState({ isChartLoading: false })
                  if (data.data.length) {
                     //console.log(JSON.parse(data.data[0]),data.data[0].timestamp, data.data[0].floatValue)
                     console.log("telemetry data", telemetryChartData, 'incoming data : ', data.data);
                     var tempObj = {};
                     tempObj.name = JSON.parse(data.data[0]).name
                     tempObj.x = new Date(JSON.parse(data.data[0]).timestamp);
                     tempObj.y = JSON.parse(data.data[0]).floatValue;
                     telemetryChartData.push(tempObj);
                     if (telemetryChartData.length > 20) {
                        telemetryChartData.shift();
                     }
                     chart.render();
                  } else {

                     console.log("empty telemetry data", data.data);
                  }
               })
            })
         }

      } else {
         console.log('no data', chart)
         if (chart != '') { chart.destroy(); console.log(' chart destroyed') }
         this.setState({ chartState: false })

      }

   }
   render() {
      const {
         chartState,
         socketDeviceID,
         socketTelemetryname,
         telemtrySize,
         isChartLoading,
         telemetryType } = this.state;
         const { socket, telemetry, selectedTelemetryName } = this.props;
      return (
         <div className="first_box">
            <div className="box border grey">
               <div className="box-title">
                  <h3>
                     <b>Chart</b>
                  </h3>
                  <div className="tools">
                  {!!selectedTelemetryName?
                     <a onClick={() => {
                           this.setState({ isChartLoading: true }, () => this.startSocketStream(socketDeviceID, socketTelemetryname, telemetryType, socket, telemtrySize))
                     }} className="reload">
                        <i className={isChartLoading ? "fa fa-refresh fa-spin" : "fa fa-refresh"}></i>
                     </a>
                     :null
                  }
                  </div>
               </div>
               {chartState ?
                  <div className="box-body patch_mas">
                     <div className="patch"></div>
                     <div id="chartContainer">
                     </div>

                  </div>
                  :
                  <div id="chartNullContainer" >
                     <h3>No telemetry data found</h3>
                  </div>
               }
            </div>
            <div className="box-body first_box">
               <div className="well">
                  <h3 id="tag_style"><b>Development Resources :</b></h3>
                  <ul className="dev_res">
                     <li>
                        <a href="https://developer.arrowconnect.io/" target="_blank" id="link_style">Developer HUB</a>
                     </li>
                     <li>
                        <a href="https://github.com/arrow-acs"  target="_blank" id="link_style">Arrow Connect SDKs</a>
                        <ul>
                           <li id="sdk_style">Java</li>
                           <li id="sdk_style">C/C++</li>
                           <li id="sdk_style">iOS</li>
                           <li id="sdk_style">Android</li>
                        </ul>
                     </li>
                     <li>
                        <a href="https://api.arrowconnect.io/swagger-ui.html" target="_blank" id="link_style">Arrow Connect APIs</a>
                     </li>


                  </ul>
               </div>
            </div>
         </div>
      )
   }
}


