import React from "react";
import  ReactTable  from "react-table";
import { makeData, Logo, Tips } from "./Utils.js";
import InputText from "./common/Input.components.js"
import Uploader from "./common/Uploader.component.js"
import "react-table/react-table.css";


class RetailerloyaltySelected extends React.Component{
  state = { name: '',description: '', logo: null, level: 0  }
  componentWillReceiveProps(nextProp){
    
    let item = nextProp.selected;
    this.setState({
      description: item.description,name: item.name
    });    
  }
  render(){
    return <div>
      <div className="form-row">
          <div className="form-group col-md-2" > <InputText text="שם"     class="form-control" value={this.state.name} /> </div>
          <div className="form-group col-md-1" > שם </div>          
          <div className="form-group col-md-2" > <Uploader uploadFunc={ (base, name, type) =>  console.dir(base)}  /> </div>
          <div className="form-group col-md-1" > לוגו  </div>
          <div className="form-group col-md-2" > <InputText text=" שלב  "   onTextChange={this.handlephone} class="form-control" value={this.state.level} /> </div>
          <div className="form-group col-md-1" > שלב  </div>
      </div>
      <div >      
        <div style={{ display: "block", width: "100%" }} >
              <textarea value={this.state.description}  placeholder="תיאור" onChange={this.save} style={{ width: "100%", border: "solid", backgroundColor: "#eaeaea" }} rows="2" ></textarea>            
          </div>

      </div>
      <div className="btn-toolbar" >
                <button type="button" onClick={ (val) => this.props.getUpdated(val)}  className="btn btn-primary">שמור</button>
            </div>
    </div>

  }
  
}


class RetailerLoyaltyTable extends React.Component {
    constructor() {
      super();
      this.state = {
        data: makeData(),
        editing: null,
        selectedRow: null,
        columns: [
              {
                Header: "Name",
				        accessor: "name"                                
              },
              {
                Header: "logo",
                accessor: "logo"
              },
              {
                Header: "description",
                accessor: "description"
              }             
            ]
      };
    }
    componentDidMount() {
        //todo: temp static param - fetch from user
      fetch('http://localhost:5000/api/retailerloyalty/3')
        .then(response => response.json())
        .then(json => {
          console.log(json);
          this.setState({ data: json });
        });        
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
      console.info('save data');
      console.dir(data);

    }
    PassToForm(row){
        console.dir(row);
        this.setState({ row: row });
    }
    render(){
      return <div>
        <h2>מועדוני לקוחות</h2>
        <RetailerloyaltySelected selected={this.state.row}  getUpdated={this.saveData}  />
        <RetailerLoyaltyTable setSelectedRow={this.PassToForm} />
      </div>
    }
  }

  export default RetailerLoyalty;