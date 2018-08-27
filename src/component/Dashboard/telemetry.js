
import React, { Component } from 'react';
import ReactTable from "react-table";
import moment from 'moment';
import APIs from '../../constants/constants';
import TelemetryChart from './telemetryChart';
const $ = window.jQuery;

export default class Telemetry extends Component {
   constructor(props) {
      super(props);
      this.state = {
        socket: null,
        socketDeviceID: null,
        socketTelemetryname: null,
        selected:null

      }
   }
   modifySocketEvents(deviceHID, deviceName, deviceType, socket, telemtrySize) {
        this.props.onClickTelemetry();
        this.setState({ socketDeviceID: deviceHID, socketTelemetryname: deviceName }, () => {
            this.refs.chartFunc.startSocketStream(deviceHID, deviceName, deviceType, this.props.socket, telemtrySize)
        })
   }
   
   handleOriginal(deviceHID, deviceName){
      
   }
    
   render() {
       const { telemetry, isTelemetryLoading, socket, selectedDeviceHid, selectedTelemetryName } = this.props;
      const {
          socketDeviceID,
          socketTelemetryname
      } = this.state;
      return (
         <div>
            <div className="col-md-4 cont_top">
               <div className="first_box">
                  <div className="box border grey">
                    <div className="box-title">
                    <h3>
                        <b>Most Recent Telemetry</b>
                    </h3>
                    <div className="tools">
                    {!!selectedDeviceHid?
                        <a onClick={() => this.props.getTelemetry()} className="reload">
                            <i className={isTelemetryLoading ? "fa fa-refresh fa-spin" : "fa fa-refresh"}></i>
                        </a>
                        :
                        null
                    }
                    </div>
                    </div>
                    <div className="box-body">
                    <ReactTable
                        data={telemetry}
                        loading={isTelemetryLoading}
                        showPagination= {false}
                        loadingText= {'Loading...'}
                        noDataText= {'No telemetry data found'}
                        
                        getTdProps={(state, rowInfo, column) => {
                            return {
                                onClick: (e) => {
                                    console.log(rowInfo.row.name.props.children, rowInfo, column)
                                    if (rowInfo.original.type.toUpperCase() === 'FLOAT' && column.id === 'name'){
                                        console.log($('#temp-click-id').attr('id'))
                                        /*removing class name and adding temp class and id*/
                                        if ($('#temp-click-id').attr('id')){
                                            $('#temp-click-id').attr('class', 'clickable-row')
                                        }
                                        e.target.classList.remove('clickable-row')
                                        e.target.setAttribute("id", "temp-click-id");
                                        e.target.setAttribute("class", "temp-click-class");
                                        /*start socket */
                                        this.props.changeSelectedTelemetryName(rowInfo.original.name);
                                        this.modifySocketEvents(rowInfo.original.deviceHid, rowInfo.original.name, rowInfo.original.type, socket, telemetry.length)
                                        console.log($('#temp-click-id').attr('id'))
                                        console.log($('.temp-click-class').attr('class'))
                                        
                                    }
                                },
                                style: {

                                    /*border: rowInfo.original.name === selectedTelemetryName ?'rgb(80, 80, 80) 3px solid':null*/
                                    backgroundColor: rowInfo.original.name === selectedTelemetryName ? '#00A19B' : null,
                                    color: rowInfo.original.name === selectedTelemetryName ? '#f1f1f1' : null 
                                }
                            }
                        }}
                        columns={[
                            {
                                header:"Name",
                                columns: [
                                {
                                    Header: "Telemetry",
                                    id: "name",
                                    accessor: d => 
                                        d.type.toUpperCase() === 'FLOAT' ? 
                                        <p className={d.name === selectedTelemetryName?null:"clickable-row"} >{d.name}</p>
                                        :
                                        <p>{d.name}</p>                                                                         
                                }
                                ]
                            },
                            {
                                header: "Value",
                                columns: [
                                {
                                    Header: "Value",
                                    id:"floatValue"||"floatCubeValue",
                                    accessor: d => 
                                    {   switch(d.type){
                                            case 'Float':
                                                return (<p>{d.floatValue}</p>);
                                            case 'FloatCube':
                                                return (d.floatCubeValue.split('|').map((value, index) => <p key={index}>{value}</p>))
                                            case 'FloatSquare':
                                                return (d.floatSqrValue.split('|').map((value, index) => <p key={index}>{value}</p>))
                                            default :
                                                return (<p>{"Invalid type"}</p>);
                                        }
                                    }
                                }
                                ]
                            },
                            {
                                columns: [
                                {
                                    Header: "Timestamp",
                                    id: "timestamp",
                                    accessor: d => moment(d.timestamp).format("YYYY-MM-DDThh:mm:ssTZD")
                                }
                                ]
                            }
                        ]}
                        defaultSorted={[
                            {
                                id: "age",
                                desc: true
                            }
                        ]}
                        minRows={telemetry.length}
                        style={{  minHeight:"180px",maxHeight: "600px" }}
                        className="-striped -highlight"
                    />
                    </div>
                  </div>
               </div>
            </div>
            <div className="col-md-4 cont_top">
                <TelemetryChart ref="chartFunc" 
                socketDeviceID={socketDeviceID} 
                socketTelemetryname={socketTelemetryname} 
                onClickTelemetry={()=>this.props.onClickTelemetry()}
                socket={this.props.socket}
                telemetry={this.props.telemetry}
                selectedTelemetryName={selectedTelemetryName}
                />
            </div>
         </div>
      )
   }
}


