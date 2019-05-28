import React from "react";
import ReactTable from "react-table";
import { makeData, Logo, Tips } from "./Utils.js";
import "react-table/react-table.css";
import InputText from "./common/Input.components.js"
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const Stores = (props) => {
    return <div>
    <ReactTable
      data={props.data}
      columns={[
        {
          Header: "עיר",
          accessor: "name"
        },
        {
          Header: "טלפון",
          accessor: "phone"
        },
        {
            Header: "מיקוד",
            accessor: "location.zipCode"
          },
          {
            Header: "כתובת",
            accessor: "location.address"
          }
      ]}
      defaultPageSize={10}
      className="-striped -highlight"
    />
    <br />    
  </div>
}

//פרטי עסק
export default class RetailerInfo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            register_id: '',
            name: '',
            phone: '',
            web: null,
            email:null,
            facebook:null,
            stores: [],
            categories: [ "one", "two", "three"]
        }
        this.handleweb = this.handleweb.bind(this);    
        this.handleemail = this.handleemail.bind(this);    
        this.handlefacebook = this.handlefacebook.bind(this);    
        this.selectCategory = this.selectCategory.bind(this);    
        this.handlephone = this.handlephone.bind(this);    
        this.handleSubmit = this.handleSubmit.bind(this);    
    }
    componentDidMount(){
        //get retailer details
        fetch(`http://localhost:5000/api/retailerinfo`)
            .then(res => res.json())
            .then(res => {                
                this.setState({ web: res.web, 
                    email: res.email, 
                    facebook: res.facebook,  
                    name: res.name,
                    phone: res.phone,
                    register_id: res.register_id

                })
            });

        fetch(`http://localhost:5000/api/retailerstores`)
            .then(res => res.json())
            .then(res => {
                this.setState({ stores: res });
                console.dir(res);
            });
    }
    handleemail(val){
        this.setState({email: val});
    }
    handlephone(val){
        this.setState({phone: val});
    }
    handleweb(val){
        this.setState({web: val});
    }
    handlefacebook(val){
        this.setState({facebook: val});
    }
    handleSubmit(e) {
        e.preventDefault();
        fetch(`http://localhost:5000/api/retailerinfo/id=${3}`, {
            'mode': 'no-cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(this.state)
        })            
            .then(res => res.json())
            .then(data => {          
                console.dir(data);
            })
    }
    selectCategory(e){
        console.dir(e);
    }
    render(){
        return <div>
            <form onSubmit={this.handleSubmit} >
                <h2>פרטי עסק</h2>
            <div className="form-row">
                <div className="form-group col-md-2" > <InputText text="שם" disabled={true}    class="form-control" value={this.state.name} /> </div>
                <div className="form-group col-md-1" > שם </div>
                <div className="form-group col-md-2" > <InputText text="מזהה" disabled={true}    class="form-control" value={this.state.register_id} /> </div>
                <div className="form-group col-md-1" > מזהה </div>
                <div className="form-group col-md-2" > <Dropdown options={this.state.categories} onChange={this.selectCategory}  /> </div>
                <div className="form-group col-md-1" > קטגוריה  </div>
                <div className="form-group col-md-2" > <InputText text=" טלפון  "   onTextChange={this.handlephone} class="form-control" value={this.state.phone} /> </div>
                <div className="form-group col-md-1" > טלפון  </div>
            </div>
            <div className="form-row">
                <div className="form-group col-md-3" > <InputText text="כתובת ברשת"   onTextChange={this.handleweb} class="form-control" value={this.state.web} /> </div>
                <div className="form-group col-md-1" > כתובת ברשת </div>
                <div className="form-group col-md-3" > <InputText text="דואל"   onTextChange={this.handleemail} class="form-control" value={this.state.email} /> </div>
                <div className="form-group col-md-1" > דואל </div>
                <div className="form-group col-md-3" > <InputText text=" facebookכתובת  "   onTextChange={this.handlefacebook} class="form-control" value={this.state.facebook} /> </div>
                <div className="form-group col-md-1" > facebook </div>
            </div>
            <div>
                <input className="btn btn-primary"  type="submit" value="עדכן" />
            </div>
            </form>
            <div>
                <Stores data={this.state.stores} />    
            </div>
            
        </div>
    }
}
