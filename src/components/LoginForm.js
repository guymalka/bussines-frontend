
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'

class LoginForm extends Component {
  constructor() {
      super()
      this.state = {
          email: '',
          password: '',
          redirectTo: null
      }
      this.handleSubmit = this.handleSubmit.bind(this)
      this.handleChange = this.handleChange.bind(this)

  }

  handleChange(event) {      
      this.setState({
          [event.target.name]: event.target.value
      })
  }

  handleSubmit(event) {
      event.preventDefault()      

      fetch(`${process.env.REACT_APP_NOT_SECRET_CODE}/api/user/login`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",            
            body: JSON.stringify({ email: this.state.email, password: this.state.password  })
        })            
            .then(res => res.json())
            .then(response => {
                  // update App.js state
                  localStorage.setItem('user', JSON.stringify( response ));
                  // update the state to redirect to home
                  this.setState({
                      redirectTo: '/RetailerInfo'
                  })              
          }).catch(error => {
              alert('משתמש לא קיים')
            
              console.log('login error: ')
              console.log(error);
              
          })
        
     
  }

  render() {
      if (this.state.redirectTo) {
          return <Redirect to={{ pathname: this.state.redirectTo }} />
      } else {
          return (
              <div  >                  
                  <form style={{  marginRight:'auto', marginLeft:'auto', display:'block', textAlign: 'right' }} className="form-horizontal">
                  <div className="form-group">
                      
                      <div className="col-3 ">
                          <h4>
                  כניסה 
                  </h4>
                      </div>
                      <div className="col-9" ></div>
                      </div>
                  
                      <div className="form-group">
                          <div className="col-3 col-ml-auto">
                              <label className="form-label" htmlFor="email">דואר אלקטרוני</label>
                          </div>
                          <div className="col-3 col-mr-auto">
                              <input className="form-input"
                                  type="text"
                                  id="email"
                                  name="email"
                                  placeholder="כתובת דואר"
                                  value={this.state.email}
                                  onChange={this.handleChange}
                              />
                          </div>
                      </div>
                      <div className="form-group">
                          <div className="col-3 col-ml-auto">
                              <label className="form-label" htmlFor="password">סיסמה: </label>
                          </div>
                          <div className="col-3 col-mr-auto">
                              <input className="form-input"
                                  placeholder="סיסמה"
                                  type="password"
                                  name="password"
                                  value={this.state.password}
                                  onChange={this.handleChange}
                              />
                          </div>
                      </div>
                      <div className="form-group ">
                      <div className="col-3 col-ml-auto">
                          <button
                              className="btn btn-primary "
                             
                              onClick={this.handleSubmit}
                              type="submit">כניסה</button>
                      </div>
                      </div>
                  </form>
              </div>
          )
      }
  }
}

export default LoginForm
