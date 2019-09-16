import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Dropdown from 'react-dropdown';
import Popup from './selectors/loyaltySelector.js';




const TimeFrameSelect = (props) =>{

  return <Dropdown
  value={ props.selectedCategory } 
  options={props.categories}  
  onChange={props.selectCategory} 
   />
}

export default class RetailerCustomers extends React.Component {
    constructor(props){
        super(props);

           

        this.redefineCols = this.redefineCols.bind(this);
        this.setMonthFields = this.setMonthFields.bind(this);
        this.setQuoterFields = this.setQuoterFields.bind(this);
        this.toggleRow = this.toggleRow.bind(this);
        this.toggleSelectAll = this.toggleSelectAll.bind(this);
        this.clearSelections = this.clearSelections.bind(this);
    }
    state = {
      displayLoyaltySelector: false,
      selected: {},
      selectAll: 0,      
      data: [],
      columns: [
                       
          ]
  }
    
    clearSelections(){
      this.setState({ displayLoyaltySelector: false
        ,selected : {}
        , selectAll: 0 }) 
    }  
    setMonthFields(){
      this.setState({
        columns: [
          {
						id: "checkbox",
						accessor: "",
						Cell: ({ original }) => {
							return (
								<input
									type="checkbox"
									className="checkbox"
									checked={this.state.selected[original.customer_id] === true}
									onChange={() => this.toggleRow(original.customer_id)}
								/>
							);
						},
						Header: x => {
							return (
								<input
									type="checkbox"
									className="checkbox"
									checked={this.state.selectAll === 1}
									ref={input => {
										if (input) {
											input.indeterminate = this.state.selectAll === 2;
										}
									}}
									onChange={() => this.toggleSelectAll()}
								/>
							);
						},
						sortable: false,
						width: 45
					},
          {
            Header: "מזהה",
            accessor: "customer_id",
            width: 250
          },
            {
              Header: "ממוצע לקניה",
              accessor: "avg_payments"
            },
            {
              Header: "ביקורים 5 שבועות",
              accessor: "5w_sum_visits"                
            },
            {
              Header: <div> <p>ממוצע לקניה</p><p>5 שבועות</p></div> ,
              accessor: "5w_avg_payment"
            },
            {
              Header: " ממוצע ביקורים בשבוע",
              accessor: "weekly_avg_visits_5w"
            },
            {
              Header: "מועדונים",
              accessor: "loyalties"
            }
        ]
      });
    }
    setQuoterFields(){
      this.setState({
        columns: [
          {
            Header: "מזהה",
            accessor: "customer_id",
            width: 250
          },
            {
              Header: "ממוצע לקניה",
              accessor: "avg_payments"
            },
            {
              Header: "ביקורים 4 חודשים",
              accessor: "4m_sum_visits"
            },
            {
              Header: "ממוצע לקניה 4 חודשים",
              accessor: "4m_avg_payment"
            },
            {
              Header: <div><p>ממוצע ביקורים</p><p> בשבוע לפי 4 חודשים</p> </div> ,
              accessor: "weekly_avg_visits_4m"
            },
            {
              Header: "ממוצע ביקורים בחודש",
              accessor: "monthly_avg_visits_4m"
            },
            {
              Header: "מועדונים",
              accessor: "loyalties"
            }
        ]
      });
    }
    redefineCols(e){
      if (e.value =='חודשי'){
        this.setMonthFields();
      }
      else{
        this.setQuoterFields()
      }
    }
    toggleSelectAll() {
      let newSelected = {};
  
      if (this.state.selectAll === 0) {
        this.state.data.forEach(x => {
          newSelected[x.customer_id] = true;
        });
      }
  
      this.setState({
        selected: newSelected,
        selectAll: this.state.selectAll === 0 ? 1 : 0
      });
    }
    toggleRow(customer_id) {
      console.dir(customer_id)
      const newSelected = Object.assign({}, this.state.selected);
      newSelected[customer_id] = !this.state.selected[customer_id];
      this.setState({
        selected: newSelected,
        selectAll: 2
      });
    }
    
    componentDidMount() {
        //todo: temp static param - fetch from user
      fetch(`${process.env.REACT_APP_NOT_SECRET_CODE}/api/Customer/RetailerCustomers`)
        .then(response => response.json())
        .then(json => {          
          this.setState({ data: json });
          this.setMonthFields();
        });        
    }
    render(){
        const { data, columns } = this.state;
        return <div> 
            <h2 className="sub-header" >הרגלי לקוחות</h2>
            <div className="row" >
              <div className="col-4" >
                <TimeFrameSelect selectCategory={this.redefineCols} 
                categories={ ['חודשי', 'רבעוני'] } selectedCategory={ 'חודשי' } />
              </div>
              <div className="col-3" >
                <input onClick={ () => this.setState({ displayLoyaltySelector : true }) }  value="שייך לקוחות מסומנים למועדון" type="button" />
              </div>
            </div>
            <p className="smallNote" >*שבועות וחודשיים קלנדריים</p>
            { this.state.displayLoyaltySelector ? <Popup closePopup={ this.clearSelections } /> : <div></div>  }              
            
            <ReactTable            
            data={data}
            columns={columns}
            defaultPageSize={10}
            className="-striped -highlight" 
          />

        </div>

    }
}