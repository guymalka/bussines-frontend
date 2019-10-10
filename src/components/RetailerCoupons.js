import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';


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

const Field = ({ valid, type, fieldId, fieldName, typeMismatch, formatErrorTxt, requiredTxt }) => {
    const renderErrorLabel = !valid ? <ErrorValidationLabel txtLbl={typeMismatch ? formatErrorTxt : requiredTxt} /> : "";

    return <div >
        <label className="margin" for={fieldId} > { fieldName }</label>
        <input type={type} id={fieldId} name={fieldId} placeholder={fieldName} required />
            <br/>
            {renderErrorLabel}
            <br/> </div>

    
}


class RetailerCoupons extends React.Component  {
    
    state = {
        displayForm: false,                
    }
    openForm(){
        this.setState({displayForm: true});
    }
    render(){
        return <div>
                 <div className={ this.state.displayForm ? " split right" : "" }> 
                 <h2 className="header" >קופונים</h2>
                <input  className="btn btn-success"
                    onClick={ () =>  this.openForm()} value="פתח טופס" type="button" />
                    <CouponsTable />
                </div>                           
                { this.state.displayForm ? 
                    <CouponsForm closeForm={ () => { this.setState({displayForm : false }) } } /> : 
                    <div></div>
                }
                </div>
    }

}

class CouponsForm extends React.Component  {
    state = {
        name:        { ...txtFieldState, fieldName: "שם", required: true, requiredTxt: "שם הוא שדה חובה", formatErrorTxt: "Incorrect email format", type: "text" },
        description: { ...txtFieldState, fieldName: "תיאור", required: true, requiredTxt: "תיאור הוא שדה חובה", type: "text" },
        oldPrice:    { ...txtFieldState, fieldName: "מחיר קודם", required: false, type: "number" },
        newPrice:    { ...txtFieldState, fieldName: "מחיר חדש", required: true, requiredTxt: "Last Name is required", type: "number" },
        item_id:    { ...txtFieldState, fieldName: "מספר מוצר", required: true, requiredTxt: "Last Name is required", type: "number" },
        restrictions: { ...txtFieldState, fieldName: "תנאי הקופון", required: true, requiredTxt: "תיאור הוא שדה חובה", type: "text" },
        duration:    { ...txtFieldState, fieldName: "מספר ימים", required: false, type: "number" },
        allFieldsValid: false
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


const changeCheckbox = (cell) => {
    console.log(cell);
    return 'kuku'
}

class CouponsTable extends React.Component  {
    constructor(props){
        super(props);
        this.getCouponsByLoyalty = this.getCouponsByLoyalty.bind(this);
        this.getCouponsByRetailer = this.getCouponsByRetailer.bind(this);
        this.selectQuery = this.selectQuery.bind(this);
        //this.checkbox = this.checkbox.bind(this);

        //this.changeCheckbox = this.changeCheckbox.bind(this);
    }

    state = {
        data: [],
        columns : [
            {
                Cell: this.checkbox.bind(this)
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
        queryTypes : [{"value":1,"label":"כל הקופונים"},{"value":2,"label":"לפי מועדון"}],
        selectedQuery:{"value":1,"label":"כל הקופונים"}

    }
    componentDidMount(){
        this.getCouponsByRetailer();
    }
    changeCheckbox(e){
        console.log(e);
    }
    checkbox(cellInfo){
        console.log('this');
      console.log(this);
        return (<div><input type="checkbox" onChange={ event => {   console.dir(this)} }  /></div>)
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
    getCouponsByLoyalty(){
        fetch(`${process.env.REACT_APP_NOT_SECRET_CODE}/api/coupons/retailer-loyalty-coupons`)
            .then(res => res.json())
            .then(res => {                
                this.setState({ data: res });
            });
    }
    render(){
        const { data, columns, queryTypes } = this.state;
        
        return <div>
                <div className="form-row"  > 
                    <div className="form-group col-md-2" >
                        <Dropdown options={queryTypes} value={ queryTypes[0] } onChange={this.selectQuery}  />
                    </div>
                    <div className="form-group col-md-10" ></div>
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

