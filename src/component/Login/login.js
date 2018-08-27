import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios'
import APIs from '../../constants/constants';
class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      email:{value:''},
      password:{value:''},
      loginLoading:null,
      loginError:false,
      error:''
    }
  }
  componentDidMount(){
    console.log(APIs)
    
  }
  onChange(e){
        console.log(e.target.name,"::", e.target.value)
        var state = this.state;
        state[e.target.name].value = e.target.value;
        this.setState(state);

    }
  login = () =>{
    console.log(this.state)
    if(this.state.email.value!=''&&this.state.password.value!=''){
      console.log('api call')
      this.setState({ loginLoading:true})
      axios.post(APIs.login,{
        'email':this.state.email.value,
        'password':this.state.password.value
      })
      .then((response)=>{
        if(response.status===200){
          console.log(response.data)
          localStorage.setItem('EMAIL', response.data.contact.email);
          localStorage.setItem('USER', response.data.login);
          localStorage.setItem('FIRSTNAME', response.data.contact.firstName);
          localStorage.setItem('LASTNAME', response.data.contact.lastName);
          localStorage.setItem('HID', response.data.userHid); 
          localStorage.setItem('APPLICATIONHID', response.data.applicationHid);
          localStorage.setItem('COMPANYHID', response.data.companyHid);
          localStorage.setItem('ZONENAME', response.data.zoneName);
          localStorage.setItem('REGIONNAME', response.data.regionName);
          console.log('user stored')
          this.setState({ loginLoading: false })
          this.props.history.push({ pathname: '/', data: response.data });
        }else{
          this.setState({ loginLoading: false, loginError: true})
          console.log(response);

        }
      })
      .catch((error)=>{
        this.setState({ loginLoading: false, loginError: true})
        console.log(error)
      })
    }else{
      alert('fields cannot be empty');
    }

  }
  render() {
    const { email, password, loginLoading, loginError } = this.state;
    return (
      <div>
        <section id="page">
          <header>
            <div className="container">
              <div className="row">
                  <div className="">
                    <div id="logo">
                    <a href="#">
                      <img src="images/arrow_logo.png"   alt="Arrow Connect" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <section id="login" className="visible">
            <div className="container">
              <div className="row">
                <div className="warning-msg">
                  <h2>{loginError ? this.state.error+'Either your username or password was misspelled or incorrect' : null}</h2>
                </div>
                <div className="col-md-4 col-md-offset-4">
                  <div className="login-box-plain">
                    <h1 className="bigintro">Sign In</h1>
                    <form role="form">
                      <div className="form-group">
                        <input type="email" name="email" placeholder="Email address" className="form-control" value={email.value} onChange={this.onChange.bind(this)}/>
                      </div>
                      <div className="form-group">
                        <input type="password" name="password" placeholder="Password"  className="form-control" value={password.value} onChange={this.onChange.bind(this)}/>
                      </div>

                      <a href="javascript:void(0)" className="btn btn_wid_align btn-info margin-top-10 " onClick={this.login}>{loginLoading ?'Sign In..': 'Sign In'}</a>
                      <div className="divide-20"></div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
        <div className="navbar navbar-footer footer_align1 ">
          <div className="container">
            <p className="navbar-text footer pull-left">© 2018 Arrow Electronics, Inc. All Rights Reserved.</p>
            <a href="#" className="footer_logo pull-right">
              <img src="images/footer_logo.png" alt="Arrow Connect" />
            </a>
          </div>
	      </div>
      </div>
    )
  }
}
export default withRouter(Login);
