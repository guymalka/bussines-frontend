import React from "react";
import  ReactTable  from "react-table";
import { makeData, Logo, Tips } from "./Utils.js";
import InputText from "./common/Input.components.js"
import Uploader from "./common/Uploader.component.js"
import "react-table/react-table.css";


class RetailerloyaltySelected extends React.Component{
  state = { name: '',description: '', logo: null, level: 0  }
  handleName(val){
    this.setState({name: val});
  }
  handleDescription(e){
     this.setState({description : e.target.value}) 
  }
  componentWillReceiveProps(nextProp){
    
    let item = nextProp.selected;
    if (item)
      this.setState({
        description: item.description ,name: item.name
      });    
  }
  render(){
    return <div>
      <div className="form-row">
      <div className="form-group col-md-1" > שם </div>
          <div className="form-group col-md-2" > <InputText text="שם" onTextChange={this.handleName.bind(this)}     className="form-control" value={this.state.name} /> </div>          
          <div className="form-group col-md-9" ></div>
          
          
      </div>
      <div >      
        <div style={{ display: "block", width: "100%" }} >
              <textarea value={this.state.description}  placeholder="תיאור" onChange={this.handleDescription.bind(this)} style={{ width: "100%", border: "solid", backgroundColor: "#eaeaea" }} rows="2" ></textarea>
          </div>

      </div>
      <div className="btn-toolbar" >
                <button type="button" onClick={ (val) => this.props.getUpdated(this.state)}  className="btn btn-primary">שמור</button>
            </div>
    </div>

  }
  
}


class RetailerLoyaltyTable extends React.Component {
    constructor() {
      super();
      this.state = {
        data: [],
        editing: null,
        selectedRow: null,
        columns: [
            {
              Cell: this.buttonDeleteRow
            },
              {
                Header: "ראשי",
                accessor: "default_loyalty",
                Cell: this.renderyesnoCell
              },
              {
                Header: "תאריך יצירה",
                accessor: "created",
                Cell: this.renderdateDisplay
              },
              {
                Header: "שם",
				        accessor: "name"
              },
              {
                Header: "מספר לקוחות",
                accessor: "customers"
              },
              {
                Header: "תיאור",
                accessor: "description"
              }             
            ]
      };
      this.deleteRow = this.deleteRow.bind(this);
    }
    componentDidMount() {
        //todo: temp static param - fetch from user
      fetch(`${process.env.REACT_APP_NOT_SECRET_CODE}/api/retailerloyalty/3`)
        .then(response => response.json())
        .then(json => {          
          this.setState({ data: json });
        });        
    }
    buttonDeleteRow(cellInfo){
      if (cellInfo.row.created == undefined)
        return <div></div>
      else{
        return <div> <input disabled={cellInfo.row.default_loyalty} className="btn btn-success" onClick={ (e) => this.deleteRow(e, cellInfo.row)} value="מחק" type="button" /> </div>
      }
    }
    deleteRow(row){
      //todo: complete server side
      fetch(`${process.env.REACT_APP_NOT_SECRET_CODE}/api/retailerstores/${this.state.retailer_id}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "DELETE",
        body: JSON.stringify(row)
    })            
        .then(res => res.json())
        .then(data => {          
            console.dir(data);
        })

    }
    renderdateDisplay(cellInfo){
      if (cellInfo.row.created == undefined)
        return <div></div>
      else{
        let date = new Date(cellInfo.row.created);
        return <div>{ date.getDate() + '/' + date.getMonth() + 1 + '/' + date.getFullYear() }</div>
      }
    }
    renderyesnoCell(cellInfo){      
      return <div> {cellInfo.row.default_loyalty == true ? 'כן' : 'לא' } </div>
    }
    render() {
      const { data, columns } = this.state;
      return (<div>
        <div>
          <ReactTable
            getTrProps={(state, rowInfo, column, instance) => { 
              return {
                onClick:(e, handleOriginal) => {
                  console.dir(rowInfo);
                  //this.setState({ selectedRow: rowInfo.original });
                  this.props.setSelectedRow(rowInfo.original);
                }
              }
             } }
            data={data}
            columns={columns}
            defaultPageSize={10}
            className="-striped -highlight"
          />
          <br />          
        </div>
        </div>
      );
    }
  }


  class RetailerLoyalty extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        row: null
      }
      this.PassToForm = this.PassToForm.bind(this);
      this.saveData = this.saveData.bind(this);
    }
    saveData(data){
      fetch(`${process.env.REACT_APP_NOT_SECRET_CODE}/api/retailerloyalty/3`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(data)
    })            
        .then(res => res.json())
        .then(data => {          
            console.dir(data);
        })

    }
    PassToForm(row){
        console.dir(row);
        this.setState({ row: row });
    }
    render(){
      return <div style={{ textAlign: "center" }}>
        <div className="form-row">
           <h2>מועדוני לקוחות</h2>
        </div>
        <RetailerloyaltySelected selected={this.state.row}  getUpdated={this.saveData}  />
        <RetailerLoyaltyTable setSelectedRow={this.PassToForm} />
      </div>
    }
  }

  export default RetailerLoyalty;