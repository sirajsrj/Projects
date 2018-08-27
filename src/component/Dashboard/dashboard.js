/* please dont delete these
/* jshint undef: true, unused: true */
/* globals io */

import React, { Component } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import ReactTable from "react-table";
import "react-table/react-table.css";
import moment from 'moment';

import APIs from '../../constants/constants';
import Telemetry from './telemetry';

class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
      uid: null,
      gateways:[],
      devices:[],
      telemetry:[],
      companyData:{},
      applicationData:{},
      subscriptionData:{},
      isGatewaysLoading:false,
      isProfileDetailsLoading: false,
      isDevicesLoading: false,
      isTelemetryLoading: false,
      selectedGatewayHid:null,
      selectedDeviceHid:null,
      selectedTelemetryName:null,
      socket:null
      
    }
  }
  componentWillMount(){
    console.log(localStorage.getItem("HID"), this.props)
    this.setState({ socket: this.createSocketConnection(),uid: localStorage.getItem("HID")},()=>{
      this.getGateways(this.state.uid);
      this.getApplication(localStorage.getItem("APPLICATIONHID"));
      this.getCompany(localStorage.getItem("COMPANYHID"));
      })

  }
  componentDidMount(){
  }
  createSocketConnection = () => {
    var socket = io.connect();
    console.log('socket stream started on :', APIs.url, socket)
    return socket;
  }
  disconnectSocket = () =>{
    const { socket } = this.state;
    if (socket.connected) {
      console.log('socket disconncted')
      socket.disconnect();
    }
  }
  getCompany(CompanyHid){
    axios.get(APIs.getCompany + CompanyHid)
      .then((response) => {
        if (response.status === 200) {
          console.log("Company data : ",response.data)/*Company details*/
          this.setState({ companyData: response.data })
        } else {
          console.log(response)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  getSubscription(SubscriptionHid){
    axios.get(APIs.getSubscription + SubscriptionHid)
      .then((response) => {
        if (response.status === 200) {
          console.log("Subscription data : ", response.data)/*Company details*/
          this.setState({ subscriptionData: response.data })
          this.setState({ isProfileDetailsLoading: false })
        } else {
          console.log(response)
          this.setState({ isProfileDetailsLoading: false })
        }
      })
      .catch((error) => {
        console.log(error)
        this.setState({ isProfileDetailsLoading: false })
      })
  }
  getApplication(ApplicationHid){
    this.setState({ isProfileDetailsLoading:true})
    axios.get(APIs.getApplication + ApplicationHid)
    .then((response) => {
      if (response.status === 200) {
        console.log("Application data : ",response.data)/*Application details*/
        this.setState({ applicationData: response.data},()=>{
          this.getSubscription(this.state.applicationData.subscriptionHid)
        })
      } else {
        console.log(response)
      }
    })
    .catch((error) => {
      console.log(error)
    })
  }
  getGateways(uid) {
    this.disconnectSocket();
    const { selectedDeviceHid,selectedGatewayHid, socket } = this.state;
    console.log('gateways under uid', uid)
    this.setState({ isGatewaysLoading:true})
    axios.get(APIs.getGateways+uid)
    .then((response)=>{
      if (response.status === 200 && response.data.data.length){
        console.log(response.data.data)/*Gateway details*/
        this.setState({ gateways: response.data.data, isGatewaysLoading: false},()=>{
          this.getDevices(this.state.gateways[0].hid)

        })
      }else{
        console.log(response)
        this.setState({ gateways:[], selectedGatewayHid:null, devices:[],selectedDeviceHid:null, telemetry:[], isGatewaysLoading:false})
        this.refs.telemtryFunc.modifySocketEvents(null, null, socket, 0)
      }
    })
    .catch((error)=>{
      this.setState({ gateways: [], selectedGatewayHid: null, devices: [], selectedDeviceHid: null, telemetry: [], isGatewaysLoading: false })
      this.refs.telemtryFunc.modifySocketEvents(null, null, socket, 0)
    })
  }
   
  getDevices(id) {
    this.disconnectSocket();
    const { selectedDeviceHid, selectedGatewayHid, socket } = this.state;
    console.log('devices under uid:' , id);
    this.setState({ isDevicesLoading: true, selectedGatewayHid:id })
    axios.get(APIs.getDevices+id+'/devices')
    .then((response)=>{
      if (response.status === 200&&response.data.data.length ){
        console.log(response.data)
        /*Device details*/
        this.setState({ devices: response.data.data, isDevicesLoading: false},()=>{
        this.getTelemetics(this.state.devices[0].hid)
        })
      }else{
        console.log(response)
        this.setState({ devices:[], selectedDeviceHid:null,telemetry:[],selectedTelemetryName:null, isDevicesLoading: false })
        this.refs.telemtryFunc.modifySocketEvents(null, null, socket, 0)
      }
    })
    .catch((error)=>{
      console.log(error)
      this.setState({ devices: [], selectedDeviceHid: null, telemetry: [],selectedTelemetryName:null, isDevicesLoading: false })
      this.refs.telemtryFunc.modifySocketEvents(null, null, socket, 0)
    })
  }
  getTelemetics(id) {
    const { socket } = this.state;
    this.disconnectSocket();
    console.log('telemtery under device uid:', id, APIs.getTelemetry );
    this.setState({ isTelemetryLoading: true, selectedDeviceHid:id })
    axios.get(APIs.getTelemetry + id)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data.data)
          /*telemetric datas*/
          if (response.data.data.length) {
            const validTelemetryType = response.data.data.filter(telemetry => telemetry.type.toUpperCase() === 'FLOAT');
            const lastValidTelemetry = validTelemetryType[(validTelemetryType.length)-1]
            this.setState({ telemetry: response.data.data, isTelemetryLoading: false, selectedTelemetryName: lastValidTelemetry.name },()=>{
              this.refs.telemtryFunc.modifySocketEvents(lastValidTelemetry.deviceHid, lastValidTelemetry.name, lastValidTelemetry.type, socket, response.data.data.length)
            })
          } else {
            this.setState({ telemetry: [], isTelemetryLoading: false, selectedTelemetryName:null })
            this.refs.telemtryFunc.modifySocketEvents(null, null, null, socket, 0)
          }

        } else {
          console.log(response)
          this.setState({ telemetry: [], isTelemetryLoading: false, selectedTelemetryName:null })
          this.refs.telemtryFunc.modifySocketEvents(null, null, null, socket, 0)
        }
    })
    .catch((error)=>{
      this.setState({ telemetry: [], isTelemetryLoading: false, selectedTelemetryName:null })
      this.refs.telemtryFunc.modifySocketEvents(null, null, null, socket, 0)
    })
  }
  logout = () => {
    console.log('logging out')
    localStorage.clear();
    this.state.socket.disconnect();
    this.props.history.push({ pathname: '/' });
  }
  render() {
    const {
      uid, 
      gateways, 
      devices, 
      telemetry, 
      isDevicesLoading, 
      isGatewaysLoading, 
      isTelemetryLoading,
      selectedDeviceHid,
      selectedGatewayHid,
      socket,
      subscriptionData,
      applicationData,
      companyData,
      isProfileDetailsLoading,
      selectedTelemetryName
    } = this.state;
    return (
      <div className="body_bg1">
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false"
                  aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="#">
                <img src="images/arrow_logo.png" alt="Arrow Connect" />
              </a>
            </div>
            <div id="navbar" className="navbar-collapse collapse">
              <ul className="nav noPadd navbar-nav  navbar-right">
                <li className="active signout-li" onClick={this.logout}>
                  <h3>Sign Out</h3>
                </li>
              </ul>
            </div>
          </div>
	      </nav>
        <div className="container">
          <div className="row">
            <div className="col-md-4 bg_first4 cont_top">
              <div className="box-body first_box">
                <div className="well">
                  <p>
                    <span className="lab_blue tenant"><span>T</span>enant : </span>
                    <abbr id="curr-time" className="timeago tip">{isProfileDetailsLoading ? null :companyData.name}</abbr>
                  </p>
                  <p>
                    <span className="lab_blue tenant"><span>S</span>ubscription : </span>
                    <abbr id="curr-time" className="timeago tip">{isProfileDetailsLoading ? null : moment(subscriptionData.startDate).format("YYYY/MM/DD") + ' - ' + moment(subscriptionData.endDate).format("YYYY/MM/DD")}</abbr>
                  </p>
                  <p>
                    <span className="lab_blue tenant"><span>A</span>pplication : </span>
                    <abbr id="curr-time" className="timeago tip">{isProfileDetailsLoading ? null : applicationData.name + ' - ' + applicationData.zoneSystemName}</abbr>
                  </p>
                  <p>
                    <span className="lab_blue tenant"><span>U</span>ser : </span>
                    <abbr id="curr-time" className="timeago tip">{localStorage.getItem("FIRSTNAME")+' '+localStorage.getItem("LASTNAME")}</abbr>
                  </p>
                  <p>
                    <span className="lab_blue tenant"><span>E</span>mail : </span>
                    <abbr id="curr-time" className="timeago tip">{localStorage.getItem("EMAIL")}</abbr>
                  </p>
                </div>
              </div>
              <div className="box border grey">
                <div className="box-title">
                  <h3>
                    <b>Gateways</b>
                  </h3>
                  <div className="tools">
                    <a onClick={() => this.getGateways(uid)} className="reload">
                      <i className={isGatewaysLoading ? "fa fa-refresh fa-spin" : "fa fa-refresh"}></i>
                    </a>
                  </div>
                </div>
                <div className="box-body">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>UID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!isGatewaysLoading ?
                        gateways.length ?
                          gateways.map((gateway, index) => {
                            return (
                              <tr key={index} className={gateway.hid.includes(selectedGatewayHid) ?'selected-items':''}>
                                <td style={{ 'color': '#00A19B', 'cursor': 'pointer' }} onClick={() => this.getDevices(gateway.hid)}>{gateway.name}</td>
                                <td>{gateway.uid}</td>

                            </tr>
                          )
                        })
                        :
                        <tr>
                          <td>No data</td>
                          <td>No data</td>
                        </tr>
                      :
                      <tr>
                        <td>Loading</td>
                        <td>Loading</td>
                      </tr>
                    }
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="box border grey">
                <div className="box-title">
                  <h3>
                    <b>Devices
                    </b>
                  </h3>
                  <div className="tools">
                  {!!selectedGatewayHid ?
                    <a onClick={() => this.getDevices(selectedGatewayHid)} className="reload">
                      <i className={isDevicesLoading ? "fa fa-refresh fa-spin" : "fa fa-refresh"}></i>
                    </a>
                    :
                    null
                  }
                  </div>
                </div>
                <div className="box-body">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>UID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!isDevicesLoading ?
                        devices.length ?
                          devices.map((device, index) => {
                            return (
                              <tr key={index} className={device.hid.includes(selectedDeviceHid) ? 'selected-items' : ''}>
                                <td style={{ 'color': '#00A19B', 'cursor': 'pointer' }} onClick={() => this.getTelemetics(device.hid)} >{device.info.name}</td>
                                <td>{device.uid}</td>
                              </tr>
                            )
                          })
                          :
                          <tr>
                            <td>No data</td>
                            <td>No data</td>
                          </tr>
                        :
                        <tr>
                          <td>Loading</td>
                          <td>Loading</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
                 
              </div>
            </div>
            <Telemetry getTelemetry={()=>{
              console.log(socket.connected)
              if(socket.connected){
                console.log('socket disconncted')
                socket.disconnect();
                this.setState({socket:this.createSocketConnection()})
              }
              this.getTelemetics(selectedDeviceHid)
              }} 
              selectedDeviceHid={selectedDeviceHid}
              telemetry={telemetry}
              onClickTelemetry={()=>{
                if (socket.connected) {
                  console.log('socket disconncted')
                  socket.disconnect();
                  this.setState({ socket: this.createSocketConnection() })
                }else{
                  this.setState({ socket: this.createSocketConnection() })
                }
              }}
              socket = {socket}
              isTelemetryLoading={isTelemetryLoading}
              ref="telemtryFunc"
              changeSelectedTelemetryName={(name) => this.setState({ selectedTelemetryName:name})}
              selectedTelemetryName={selectedTelemetryName}
            />
          </div>
        </div>
	      <div className="navbar navbar-footer ">
          <div className="container">
            <p className="navbar-text footer pull-left">© 2018 Arrow Electronics, Inc. All Rights Reserved.</p>
            <a href="#" className="footer_logo pull-right">
              <img src="images/footer_logo.png" alt="Arrow Connect" />
            </a>
          </div>
	      </div>
      </div>
    );
  }
}
export default withRouter(Dashboard);
