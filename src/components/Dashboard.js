import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
                retailer: false,
                retailerloyalty: false,
                retailerInfo: false
        }
        
        this.clickloyalty = this.clickloyalty.bind(this);
        this.clickretailer = this.clickretailer.bind(this);
        this.sendPDF = this.sendPDF.bind(this);
        this.retailerInfo = this.retailerInfo.bind(this);
    }
    clickretailer(){ this.setState({ retailer: true});}
    clickloyalty(){ this.setState({ retailerloyalty: true}); }
    retailerInfo(){ this.setState({ retailerInfo: true}); }
    sendPDF(){ console.info('send pdf'); }
    render(){
        const {retailer, retailerloyalty, retailerInfo} = this.state;
        if (retailer)
            return <Redirect to={{ pathname: '/RetailerTable' }} />;
        else if (retailerloyalty)            
            return <Redirect to={{ pathname: '/RetailerLoyaltyTable' }} />;
        else if (retailerInfo)            
            return <Redirect to={{ pathname: '/RetailerInfo' }} />;
        return <div>
            <h2>you are in Dashboard</h2>
            <input className="btn btn-primary"  onClick={this.clickretailer} value="בית עסק" type="button" />
            <input className="btn btn-primary"  onClick={this.clickloyalty} value="מועדוני לקוחות" type="button" />
            <input className="btn btn-primary"  onClick={this.sendPDF} value="שלח PDF" type="button" />
        </div>
    }
}

export default Dashboard;
