import React, { Component } from 'react';
import { Link, Match, BrowserRouter as Router, Route, Switch, IndexRoute, Redirect } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import  LoginForm  from  './components/LoginForm.js';
import  Dashboard  from  './components/Dashboard.js';
import  RetailerTable  from  './components/RetailerTable.js';
import  RetailerLoyaltyTable  from  './components/RetailerLoyaltyTable.js';
import  RetailerInfo  from  './components/RetailerInfo.js';
import  RetailerCustomers  from  './components/RetailerCustomers';

class App extends Component {
  constructor() {
    super();
    this.state = { 
      message: '',
      login: false
   };
   this.renderPage = this.renderPage.bind(this);
  }

  componentDidMount() {
    fetch(process.env.REACT_APP_NOT_SECRET_CODE +  '/api/message', {'mode': 'no-cors'})
      //.then(response => response.json())                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
      .then(json => {
        console.log(json);
        this.setState({ message: json })
      }
        );

  }  
  renderPage(){    
    if (this.state.login){
      return <Redirect to={{ pathname:  '/login' } } />
    }
    
  }
  render() {    
    
      return <Router>
              <div>                
              {this.renderPage()}
              <Switch>
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/RetailerTable" component={RetailerTable} />
                <Route path="/RetailerInfo" component={RetailerInfo} />
                <Route path="/RetailerLoyaltyTable" component={RetailerLoyaltyTable} />
                <Route path="/RetailerCustomersTable" component={RetailerCustomers} />
                <Route path="/login" component={LoginForm} />
              </Switch>
              </div>
            </Router> 

            //              <Route path="/login" component={Login} />
    
  }
}

export default App;
