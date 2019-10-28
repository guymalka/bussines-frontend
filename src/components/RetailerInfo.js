import React from "react";
import ReactTable from "react-table";
import { makeData, Logo, Tips } from "./Utils.js";
import "react-table/react-table.css";
import InputText from "./common/Input.components.js"
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import '../App.css';


class UpdateDayOpenHours extends React.Component{
    constructor(props){
        super(props)
        this.selecthours = this.selecthours.bind(this)
        this.selecttime = this.selecttime.bind(this)
    }
    state = {
        hoursSelected: 6,
        timeSelected: 0,
        userPickedHour: false,
        userPickedTime: false, 
        hours: [ {value: 6, label: '6'}
        ,{value: 7, label: '7'}
        ,{value: 8, label: '8'}
        ,{value: 9, label: '9'}
        ,{value: 10, label: '10'}
        ,{value: 11, label: '11'}
        ,{value: 12, label: '12'}
        ,{value: 13, label: '13'}
        ,{value: 14, label: '14'}
        ,{value: 15, label: '15'}
        ,{value: 16, label: '16'}
        ,{value: 17, label: '17'}
        ,{value: 18, label: '18'}
        ,{value: 19, label: '19'}
        ,  ],
        time: [ {value: 0, label: '00'}
        ,{value: 30, label: '30'}  
        ,  ]
    }
    selecthours(val){
        let { userPickedTime, hoursSelected, timeSelected } = this.state;
        this.setState({ userPickedHour: true, hoursSelected: val.value });
        if (userPickedTime)
           this.props.userPickTimeFrame(val.value, timeSelected) 
        console.log(val);
    }
    selecttime(val){
        let { userPickedHour, hoursSelected, timeSelected } = this.state;
        this.setState({ userPickedTime: true, timeSelected: val.value });
        if (userPickedHour)
           this.props.userPickTimeFrame(hoursSelected, val.value)
        console.log(val);    
    }
    render(){
        let { edit, from, to } =  this.props;
        return edit ? <div className="form-row" >
            <div className="col-3" >
                <Dropdown value={this.state.timeSelected} 
                            options={this.state.time} 
                            onChange={this.selecttime}  />
            </div>
            <div className="col-3" >
                <Dropdown 
                value={ this.state.hoursSelected } 
                options={this.state.hours}  
                onChange={this.selecthours}  />         
            </div>
            <div className="col-6" ></div>
        </div>
        : <span> { from } - { to }   </span>  

    }
}


class OpenHours extends React.Component{
    constructor(props){
        super(props);
        this.updateDays = this.updateDays.bind(this);
        this.saveTimeFrame = this.saveTimeFrame.bind(this);
    }
    state = {
        dayUserUpdate: 0,
        edit: false
    }
    updateDays(item){
        this.setState({edit : true, dayUserUpdate : item});
    }
    saveTimeFrame(hour ,day){
        console.info(hour + "" + day);
        this.setState({edit : false, dayUserUpdate: 0});
        //TODO: call server, update data
    }
    render(){
        let { edit, dayUserUpdate } = this.state;
        return <div> 
            <div className="form-row"  >
                <div className="col-4" >ראשון</div>
                    <div className="col-4" > 
                        <UpdateDayOpenHours userPickTimeFrame={  this.saveTimeFrame } day={1} from={ "8:00"  } to={ "16:00" } edit={edit && dayUserUpdate == 1 }  /> 
                    </div>
                <div className="col-4" > <input onClick={ (item) => this.updateDays(1) } type="button" value={ edit && dayUserUpdate == 1  ? 'שמור' : 'עדכן' } /> </div>
                </div>
                <div className="form-row"  >
                    <div className="col-4" >שני</div>
                        <div className="col-4" > 
                            <UpdateDayOpenHours userPickTimeFrame={  this.saveTimeFrame } day={2} from={ "8:00"  } to={ "16:00" } edit={edit && dayUserUpdate == 2 }  />
                        </div>
                    <div className="col-4" > <input onClick={ (item) => this.updateDays(2) } type="button" value={ edit && dayUserUpdate == 2 ? 'שמור' : 'עדכן' } /> </div>
                </div>
                <div className="form-row"  >
                    <div className="col-4" >שלישי</div>
                        <div className="col-4" > 
                            <UpdateDayOpenHours userPickTimeFrame={  this.saveTimeFrame } day={3} from={ "8:00"  } to={ "16:00" } edit={edit && dayUserUpdate == 3 }  />
                        </div>
                    <div className="col-4" > <input onClick={ (item) => this.updateDays(3) } type="button" value={ edit && dayUserUpdate == 3 ? 'שמור' : 'עדכן' } /> </div>
                </div>
                <div className="form-row"  >
                    <div className="col-4" >רביעי</div>
                        <div className="col-4" > 
                            <UpdateDayOpenHours userPickTimeFrame={  this.saveTimeFrame } day={4} from={ "8:00"  } to={ "16:00" } edit={edit && dayUserUpdate == 4  }  />
                        </div>
                    <div className="col-4" > <input onClick={ (item) => this.updateDays(4) } type="button" value={ edit && dayUserUpdate == 4 ? 'שמור' : 'עדכן' } /> </div>
                </div>
        </div>

    }
}


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
                    //Header: "שעות פתיחה",
                    columns: [
                      {
                        expander: true,
                        Header: () => <strong>שעות פתיחה</strong>,
                        width: 65,
                        Expander: ({ isExpanded, ...rest }) =>
                          <div>
                            {isExpanded
                              ? <span>&#x2299;</span>
                              : <span>&#x2295;</span>}
                          </div>,
                        style: {
                          cursor: "pointer",
                          fontSize: 25,
                          padding: "0",
                          textAlign: "center",
                          userSelect: "none"
                        },
                        Footer: () => <span>&hearts;</span>
                      }
                    ]
                  },
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
            SubComponent={() => <OpenHours /> }
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
