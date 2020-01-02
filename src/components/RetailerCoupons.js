import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { CustomObject } from '../components/common.js'

const CheckBoxLiItem = ({ name, value, selectItem }) => {
    return <li key={value}  ><input onChange={ selectItem } value={value} type="checkbox" /><span> { name } </span></li>
}


const txtFieldState = {
    value: "",
    valid: true,
    typeMismatch: false,
    errMsg: "" //this is where our error message gets across
};

const ErrorValidationLabel = ({ txtLbl }) => (
    <label htmlFor="" style={{ color: "red" }}>
        {txtLbl}
    </label>
);

const Field = ({ valid, type, fieldId, fieldName, typeMismatch, formatErrorTxt, requiredTxt, onChange }) => {
    const renderErrorLabel = !valid ? <ErrorValidationLabel txtLbl={typeMismatch ? formatErrorTxt : requiredTxt} /> : "";

    return <div >
        <label className="margin" for={fieldId} > { fieldName }</label>
        <input type={type} id={fieldId} name={fieldId} placeholder={fieldName} onChange={onChange} required />
            <br/>
            {renderErrorLabel}
            <br/> </div>

    
}

/**
 * main class, holding components
 */
class RetailerCoupons extends React.Component  {
    constructor(props){
        super(props);
        this.openloyaltiesForm = this.openloyaltiesForm.bind(this);
        this.saveCouponLoyaltyRelations = this.saveCouponLoyaltyRelations.bind(this);
        this.getSelectedCoupons = this.getSelectedCoupons.bind(this);
    }
    state = {
        displayForm: false,                
        displayLoyaltiesForm: false,
        selectedCoupon: null,
        selectedCoupons: []
    }
    openForm(){
        this.setState({displayForm: true});
    }
    getSelectedCoupons(coupons){
        console.log(coupons);
        this.setState({displayLoyaltiesForm: false,
            selectedCoupons: coupons
        })
    }
    openloyaltiesForm(coupon){
        console.log(coupon)
        this.setState({displayLoyaltiesForm: true,
            selectedCoupon: coupon
        });
    }
    saveCouponLoyaltyRelations(selectedLoyalties, assign){        
        let data = {};
        data.selectedLoyalties = selectedLoyalties;
        data.SelectedCoupons = this.state.selectedCoupons;
        data.assign = assign;
        fetch(`${process.env.REACT_APP_NOT_SECRET_CODE}/api/coupons/manageloyaltyrelations`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(data)
        })

    }
    render(){
        let { displayForm, displayLoyaltiesForm, selectedCoupon } =  this.state;
        return <div>
                 <div className={ (displayForm || displayLoyaltiesForm ) ? " split right" : "" }> 
                 <h2 className="header" >קופונים</h2>
                <input  className="btn btn-success"
                    onClick={ () =>  this.openForm()} value="פתח טופס" type="button" />
                   <div >  <CouponsTable setSelectedCoupons={ this.getSelectedCoupons }  manageLoyalties={this.openloyaltiesForm} /></div>
                </div>                           
                    <div className={ (displayForm || displayLoyaltiesForm ) ?  " split2 left" : "" } >
                        <div className="centered" >
                            { displayForm ? <CouponsForm closeForm={ () => { this.setState({displayForm : false }) } } /> 
                            : displayLoyaltiesForm ?  <LoyaltiesForm sendRelationChanges={this.saveCouponLoyaltyRelations} coupon={selectedCoupon} /> : <div></div> }
                        </div>
                    </div>                
                </div>
    }

}

class LoyaltiesForm extends React.Component{
    constructor(props){
        super(props);
        this.onCheckboxChange = this.onCheckboxChange.bind(this);
    }

    state = {
        loyalties: [],
        selectedLoyalties: []
    }
    onCheckboxChange(item){
        if (item.target.checked)
            this.setState( { selectedLoyalties:  this.state.selectedLoyalties.concat(item.target.value) })
        else
            this.setState({ selectedLoyalties: this.state.selectedLoyalties.filter( m => m != item.target.value  )})    
    }
    componentDidMount(){
        //todo: change to dynamic

        fetch(`${process.env.REACT_APP_NOT_SECRET_CODE}/api/retailerloyalty/3`)
            .then(res => res.json())
            .then(res => {                                                               
                let loyaltiesList = res.map(m => <CheckBoxLiItem selectItem={this.onCheckboxChange} name={m.name}  value={m.loyalty_id}  /> )
                this.setState({ loyalties: loyaltiesList });
            });
    }
    render(){
        
        
        return  <form style={{ paddingTop: '200' }} >
            <ul>
                {this.state.loyalties}
            </ul>
            <div style={{ display: 'flex', flexDirection:"row" }} >
                <div>
                    <input type="button" value="שייך למועדונים מסומנים" onClick={ () => { this.props.sendRelationChanges(this.state.selectedLoyalties, true)  } } className="btn btn-info" />
                </div>
                <div>
                    <input type="button" value="בטל שיוך למועדונים" onClick={ () => { this.props.sendRelationChanges(this.state.selectedLoyalties, false)  } } className="btn btn-info" />
                </div>
            </div>
            </form>        
    }
}

class CouponsForm extends React.Component  {
    state = {
        name:        { ...txtFieldState, fieldName: "שם", required: true, requiredTxt: "שם הוא שדה חובה", formatErrorTxt: "Incorrect email format", type: "text" },
        description: { ...txtFieldState, fieldName: "תיאור", required: true, requiredTxt: "תיאור הוא שדה חובה", type: "text" },
        oldPrice:    { ...txtFieldState, fieldName: "מחיר קודם", required: false, type: "number" },
        newPrice:    { ...txtFieldState, fieldName: "מחיר חדש", required: true, requiredTxt: "Last Name is required", type: "number" },
        item_id:     { ...txtFieldState, fieldName: "מספר מוצר", required: true, requiredTxt: "Last Name is required", type: "number" },
        restrictions: { ...txtFieldState, fieldName: "תנאי הקופון", required: true, requiredTxt: "תיאור הוא שדה חובה", type: "text" },
        duration:    { ...txtFieldState, fieldName: "מספר ימים", required: false, type: "number" },
        file:        { ...txtFieldState, fieldName: "קובץ", required: false, type: "file", onChange:  this.loadFile }  ,
        allFieldsValid: false
    }
    loadFile = (e) => {
        console.log('load file');
        console.log(e);
    }
    reduceFormValues = formElements => {
        const arrElements = Array.prototype.slice.call(formElements); //we convert elements/inputs into an array found inside form element

        //we need to extract specific properties in Constraint Validation API using this code snippet
        const formValues = arrElements
            .filter(elem => elem.name.length > 0)
            .map(x => {
                const { typeMismatch } = x.validity;
                const { name, type, value } = x;

                return {
                    name,
                    type,
                    typeMismatch, //we use typeMismatch when format is incorrect(e.g. incorrect email)
                    value,
                    valid: x.checkValidity()
                };
            })
            .reduce((acc, currVal) => { //then we finally use reduce, ready to put it in our state
                const { value, valid, typeMismatch, type } = currVal;
                const {
                    fieldName,
                    requiredTxt,
                    formatErrorTxt
                } = this.state[currVal.name]; //get the rest of properties inside the state object
                
                //we'll need to map these properties back to state so we use reducer...
                acc[currVal.name] = {
                    value,
                    valid,
                    typeMismatch,
                    fieldName,
                    requiredTxt,
                    formatErrorTxt
                };

                return acc;
            }, {});

        return formValues;
    }

    checkAllFieldsValid = (formValues) => {
        return !Object.keys(formValues)
            .map(x => formValues[x])
            .some(field => !field.valid);
    };

    onSubmit = e => {
        e.preventDefault();
        const form = e.target;

        //we need to extract specific properties in Constraint Validation API using this code snippet
        const formValues = this.reduceFormValues(form.elements);
        const allFieldsValid = this.checkAllFieldsValid(formValues);
        //note: put ajax calls here to persist the form inputs in the database.

        //END

        this.setState({ ...formValues, allFieldsValid }); //we set the state based on the extracted values from Constraint Validation API
        let formData = {};
        if (allFieldsValid){
           
           //TODO: get retailerid
        fetch(`${process.env.REACT_APP_NOT_SECRET_CODE}/api/coupons/add-coupon/`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify( formValues )
        })            
            .then(res => res.json())
            .then(data => {          
                console.dir(data);
            })    
        //this.props.closeForm();
        }
        
    };

    mapFieldInputs = () =>{
        //we filter out `allFieldsValid` property as this is not included state for our input fields
        return Object.keys(this.state).filter(x => x !== "allFieldsValid").map(field => {
            return {
                fieldId: field,
                ...this.state[field]
            };
        });
    }

    render(){
        const { allFieldsValid } = this.state;
        const successFormDisplay = allFieldsValid ? "block" : "none";
        const inputFormDisplay = !allFieldsValid ? "block" : "none";
        const fields = this.mapFieldInputs();
        const renderFields = fields.map(x => <Field {...x} />);
        console.log('rendrt coupon form');    
        return <div className="left" >
                <form
                        className="form-inside-input"
                        onSubmit={this.onSubmit}
                        noValidate >
                        {renderFields}

                        <input type="submit" value="Submit" />
                    </form>
             </div>
    }
}




class CouponsTable extends React.Component  {
    constructor(props){
        super(props);
        this.getCouponsByLoyalty = this.getCouponsByLoyalty.bind(this);
        this.getCouponsByRetailer = this.getCouponsByRetailer.bind(this);
        this.selectQuery = this.selectQuery.bind(this);
        this.manageCoupons = this.manageCoupons.bind(this);
    }

    state = {
        data: [],
        columns : [
            {
                Cell: ({ original }) => {
                    return (
                        <input
                            type="checkbox"
                            className="checkbox"
                            checked={  this.state.selected[original.coupon_id] && this.state.selected[original.coupon_id].value == true }
                            onChange={() => this.toggleRow(original.coupon_id)}
                        />
                    );
                }
            },
            {
            Header: "מספר קופון",
            accessor: "coupon_id"
            },
            {
                Header: "שם",
                accessor: "name"
            },
            {
                Header: "תיאור",
                accessor: "description"
            },
            {
                Header: "תמונה",
                accessor: "image"
            },
            {
                Header: "מחיר",
                accessor: "price"
            },
            {
                Header: "מחיר חדש",
                accessor: "new_price"
            },
            {
                Header: "תוקף ברירת מחדל",
                accessor: "default_duration"
            },
            {
                Header: "הגבלות",
                accessor: "restrictions"
            },
            {
                Header: "מספר לקוחות משוייכים",
                accessor: "restrictions"
            }, 
            /** relevat only for loyalties */
            {
                Header: "מועדונים",
                accessor: "restrictions"
            }

        ],
        selected: [] , // new CustomObject(), 
        selectAll: 0,
        queryTypes : [{"value":1,"label":"כל הקופונים"},{"value":2,"label":"לפי מועדון"}],
        selectedQuery:{"value":1,"label":"כל הקופונים"}

    }
    componentDidMount(){
        this.getCouponsByRetailer();
    }
    toggleRow(coupon_id) {        
        let newSelected = [...this.state.selected];  //Object.assign({}, this.state.selected);
        if (!this.state.selected[coupon_id])
            newSelected.push({ coupon: coupon_id, value: true}); // = !this.state.selected[coupon_id];
        else
            newSelected = newSelected.filter((val) => {
                return val != coupon_id;
            });
        

        this.props.setSelectedCoupons(newSelected);
		this.setState({
			selected: [...newSelected],
			selectAll: 2
		});
	}
  
    selectQuery(e){
        this.setState({})
        switch(e.value){
            case 1:
                this.getCouponsByRetailer();
                break;
            case 2:
                this.getCouponsByLoyalty();
                break;    
            default:
                this.getCouponsByRetailer();    
                break;
        }
    }
    getCouponsByRetailer(){
        fetch(`${process.env.REACT_APP_NOT_SECRET_CODE}/api/coupons/retailer-coupons`)
            .then(res => res.json())
            .then(res => {                
                this.setState({ data: res });
            });
    }
    getCouponId(value){
        console.dir(value);
        var items = Object.keys(value);
        return items;
    }
    manageCoupons(){
        this.props.manageLoyalties(this.state.selected);
        /*
        let items =this.getCouponId(this.state.selected)
        console.dir ( items  );
        fetch(`${process.env.REACT_APP_NOT_SECRET_CODE}/api/coupons/remove`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "DELETE",
            body: JSON.stringify(items)
        })
        */
    }
    /*
    assignCoupon(){
        fetch(`${process.env.REACT_APP_NOT_SECRET_CODE}/api/coupons/assign`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(this.state.selected)
        })
    }
    */
    getCouponsByLoyalty(){
        fetch(`${process.env.REACT_APP_NOT_SECRET_CODE}/api/coupons/retailer-loyalty-coupons`)
            .then(res => res.json())
            .then(res => {                
                this.setState({ data: res });
            });
    }
    render(){        
        const { data, columns, queryTypes, selected } = this.state;
        console.log(this.state.selected);
        return <div>
                <div className="form-row"  > 
                    <div className="form-group col-md-2" >
                        <Dropdown options={queryTypes} value={ queryTypes[0] } onChange={this.selectQuery}  />
                    </div>
                    <div className="form-group col-md-2" >
                        <input disabled={ selected == {} } className="btn btn-success"
                        onClick={ () =>  this.manageCoupons()} value=" שיוך קופונים למועדון" type="button" />
                        </div>
                    <div className="form-group col-md-2" ></div>
                    <div className="form-group col-md-6" ></div>
                 </div>                 
                 <div className="form-row" >
                 <div className="form-group col-md-12" >
                    <ReactTable
                    data={data}
                    columns={ columns }
                    defaultPageSize={10}
                    className="-striped -highlight"  />
                    </div>
                    </div>
        </div>
    }
}

export default RetailerCoupons;

