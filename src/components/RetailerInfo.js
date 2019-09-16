import React from "react";
import ReactTable from "react-table";
import { makeData, Logo, Tips } from "./Utils.js";
import "react-table/react-table.css";
import InputText from "./common/Input.components.js"
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import '../App.css';

class Stores extends React.Component {
    constructor(props){
        super(props);
        this.renderEditable = this.renderEditable.bind(this);
        this.buttonCell = this.buttonCell.bind(this);
        this.saveRow = this.saveRow.bind(this);
        this.addRow = this.addRow.bind(this);
        this.setRetailerId = this.setRetailerId.bind(this);
        this.state = {
            modified : null,
            add:null,
            retailer_id: null
        }
    }
    componentDidMount(){
        this.setRetailerId();
    }
    setRetailerId(){
        let userDetails = JSON.parse( localStorage.user )
        this.setState({ retailer_id: userDetails.retailer_id })
    }
    addRow(e, row){
        this.state.add = row._original;     
        fetch(`${process.env.REACT_APP_NOT_SECRET_CODE}/api/retailerstores/${this.state.retailer_id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(this.state.add)
        })            
            .then(res => res.json())
            .then(data => {          
                console.dir(data);
            })
    }
    saveRow(e, row){
        this.state.modified = row._original;     
        fetch(`${process.env.REACT_APP_NOT_SECRET_CODE}/api/retailerstores/${this.state.retailer_id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "PATCH",
            body: JSON.stringify(this.state.modified)
        })            
            .then(res => res.json())
            .then(data => {          
                console.dir(data);
            })
        
    }
    buttonCell(cellInfo){        
        if (cellInfo.row.name == "")
            return <div> <input className="btn btn-success" onClick={ (e) => this.addRow(e, cellInfo.row)} value="שמור" type="button" /> </div>            
        else    
            return <div> <input className="btn btn-secondary" onClick={ (e) => this.saveRow(e, cellInfo.row)} value="עדכן שורה" type="button" /> </div>
    }
    renderEditable(cellInfo) {
        return (
          <div
            style={{ backgroundColor: "#fafafa" }}
            contentEditable
            suppressContentEditableWarning
            onBlur={e => {
              const data = [...this.props.data];
              data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;              
            }}
            dangerouslySetInnerHTML={{
              __html: cellInfo.column.id.indexOf('.') == -1 ? this.props.data[cellInfo.index][cellInfo.column.id]
              : this.props.data[cellInfo.index][cellInfo.column.id.split('.')[0]][cellInfo.column.id.split('.')[1]]
            }}
          />
        );
      }
    render(){
        return <div>
            <ReactTable
            data={this.props.data}
            columns={[
                {
                    Cell: this.buttonCell
                },
                {
                Header: "עיר",
                accessor: "name",
                Cell: this.renderEditable

                },
                {
                    Header: "טלפון",
                    accessor: "phone",
                    Cell: this.renderEditable
                },
                {
                    Header: "מיקוד",
                    accessor: "location.zipCode",
                    Cell: this.renderEditable
                },
                {
                    Header: "כתובת",
                    accessor: "location.address"//,
                    //Cell: this.renderEditable
                }
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
            />
            <br />    
        </div>
    }
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
            categories: [ ],
            selectedCategory: null,
            retailer_id: null
        }
        this.handleweb = this.handleweb.bind(this);    
        this.handleemail = this.handleemail.bind(this);    
        this.handlefacebook = this.handlefacebook.bind(this);    
        this.selectCategory = this.selectCategory.bind(this);    
        this.handlephone = this.handlephone.bind(this);    
        this.handleSubmit = this.handleSubmit.bind(this);    
        this.addRow = this.addRow.bind(this);    
        this.setRetailerId = this.setRetailerId.bind(this);    
    }
    setRetailerId(){
        let userDetails = JSON.parse( localStorage.user )
        this.setState({ retailer_id: userDetails.retailer_id })
    }
    saveEditChnges(row){
        let userDetails = JSON.parse( localStorage.user )
        fetch(`${process.env.REACT_APP_NOT_SECRET_CODE}/api/retailerinfo/${userDetails.retailer_id}`, {
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
    addRow(){
        console.dir(this.state.stores);
        let arr = this.state.stores;
        arr.push({ name: '',phone:'',location:{ address:'', city:'', zipcode:'' } });
        this.setState({ stores: arr });
    }
    componentDidMount(){
        this.setRetailerId();
        //get retailer details
        fetch(`${process.env.REACT_APP_NOT_SECRET_CODE}/api/retailerinfo`)
            .then(res => res.json())
            .then(res => {                
                this.setState({ web: res[0].web, 
                    email: res[0].email, 
                    facebook: res[0].facebook,  
                    name: res[0].name,
                    phone: res[0].phone,
                    register_id: res[0].register_id,
                    selectedCategory: { value: res[0].categorydetails[0]._id, label: res[0].categorydetails[0].heb }

                })
            });
        
        fetch(`${process.env.REACT_APP_NOT_SECRET_CODE}/api/category`)
            .then(res => res.json())
            .then(res => {                
                this.setState({
                    categories: res

                });
            });    

        fetch(`${process.env.REACT_APP_NOT_SECRET_CODE}/api/retailerstores`)
            .then(res => res.json())
            .then(res => {
                this.setState({ stores: res });                
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
        fetch(`${process.env.REACT_APP_NOT_SECRET_CODE}/api/retailerinfo/${this.state.retailer_id}`, {
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
        //console.dir(e);
        this.setState({
            selectedCategory: e
        });
    }
    render(){
        return <div>
            <form className="border" onSubmit={this.handleSubmit} >
                <div className="form-row" >
                    <div className="form-group col-md-9" ></div>
                    <div className="form-group col-md-2" >
                        <h2 className="header" >פרטי עסק</h2>
                    </div>
                    <div className="form-group col-md-1" ></div>
                </div>
            <div className="form-row">
                <div className="form-group col-md-2" > <InputText text="שם" disabled={true}     class="form-control" value={this.state.name} /> </div>
                <div className="form-group col-md-1" > שם </div>
                <div className="form-group col-md-2" > <InputText text="מזהה" disabled={true}    class="form-control" value={this.state.register_id} /> </div>
                <div className="form-group col-md-1" > מזהה </div>
                <div className="form-group col-md-2" > <Dropdown options={this.state.categories} value={this.state.selectedCategory} onChange={this.selectCategory}  /> </div>
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
            <input className="btn btn-info "  type="button" onClick={this.addRow}  value="הוסף שורה" />
                <Stores data={this.state.stores} editRow={this.saveEditChnges} />    
            </div>
            
        </div>
    }
}
