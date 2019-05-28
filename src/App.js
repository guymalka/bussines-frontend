import React, { Component } from 'react';
import { Link, Match, BrowserRouter as Router, Route, Switch, IndexRoute, Redirect } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
//import  Login  from  './components/Login.js';
import  Dashboard  from  './components/Dashboard.js';
import  RetailerTable  from  './components/RetailerTable.js';
import  RetailerLoyaltyTable  from  './components/RetailerLoyaltyTable.js';
import  RetailerInfo  from  './components/RetailerInfo.js';

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
    fetch('http://localhost:5000/api/message')
      .then(response => response.json())                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
      .then(json => {
        console.log(json);
        this.setState({ message: json })
      }
        );
/*
      fetch('/api/needlogin')
      .then(response => response.json())
      .then(json => this.setState({ login: json.value }));
      */
  }  
  renderPage(){    
    if (this.state.login){
      return <Redirect to={{ pathname:  '/login' } } />
    }
    /*
    else{
      return <Redirect to={{ pathname:  '/table' } } />;
    }
    */
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
              </Switch>
              </div>
            </Router> 

            //              <Route path="/login" component={Login} />
    
  }
}

export default App;
