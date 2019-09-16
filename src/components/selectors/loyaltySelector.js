import React from 'react';  
import '../../popup.css';  

class Popup extends React.Component {
    componentDidMount(){
        fetch(`${process.env.REACT_APP_NOT_SECRET_CODE}/api/Customer/RetailerCustomers`)
        .then(response => response.json())
        .then(json => {          
          this.setState({ data: json });
          this.setMonthFields();
        });
    }  
  render() {  
return (  
<div className='popup'>  
<div className='popup\_inner'>  
<h1>בחר מועדון</h1>  
<button onClick={this.props.closePopup}>שייך מועדון נבחר</button>  
</div>  
</div>  
);  
}  
}  

export default Popup;