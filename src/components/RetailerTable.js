import React from "react";
import ReactTable from "react-table";
import { makeData, Logo, Tips } from "./Utils.js";
import "react-table/react-table.css";

class RetailerTable extends React.Component {
    constructor() {
      super();
      this.state = {
        data: []
      };
    }
    componentDidMount() {
      
      fetch('https://playhelloworld.azurewebsites.net/api/retailer')
        .then(response => response.json())
        .then(json => {
          console.log(json);
          this.setState({ data: json });
        });        
      
    }
    render() {
      const { data } = this.state;
      return (
        <div>
          <ReactTable
            data={data}
            columns={[
              {
                Header: "Name",
				        accessor: "name"                                
              },
              {
                Header: "Web",
                accessor: "web"
              },
              {
                Header: "Register Id",
                accessor: "register_id"
              },
              {
                Header: "Category",
                accessor: "register_id"
              }              
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
          />
          <br />
          <Tips />
          <Logo />
        </div>
      );
    }
  }

  export default RetailerTable;
