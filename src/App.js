import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from './component/Dashboard/dashboard';
import Login from './component/Login/login';


export default class App extends Component{
    constructor(props){
        super(props);
        console.log(props);
        this.state={
            loggedIn: null,
            
        }
    }

    componentWillMount(){
        if (localStorage.getItem("EMAIL") != null)/*Check user*/ {
            console.log('user logged in')
            this.setState({loggedIn:true})
        }else{
            console.log('user logged out')
            this.setState({loggedIn:false})
        }
    }
    isLoggedIn(){
        console.log('onEnter called')
        if (localStorage.getItem("EMAIL") != null)/*Check user*/ {
            console.log('user logged in ')
            return true
        } else {
            console.log('user logged out')
            return false
        }
    }
    LoggedIn = () => {
        return(
            <Switch>
                <Route exact path='/' render={(props)=>this.isLoggedIn()?(<Dashboard {...props}/>):(this.LoggedOut())} />
            </Switch>
        );
    }
    LoggedOut = () => {
        return (
            <Switch>
                <Route exact path='/' render={(props) =>this.isLoggedIn() ? (this.LoggedIn()) : (<Login />)} />
            </Switch>
        );
    }
    render(){
        return(
            <div>
                {this.state.loggedIn?this.LoggedIn():this.LoggedOut()}
            </div>
        )
    }
}
