import React from 'react';  
import '../../popup.css';  
import Dropdown from 'react-dropdown';

class WorkingDays extends React.Component {
    state = {
        hours: [ {value: '6', label: 'One'}
        ,{value: '7', label: 'two'}
        ,{value: '8', label: 'One'}
        ,{value: '9', label: 'One'}
        ,{value: '10', label: 'One'}
        ,{value: '11', label: 'One'}
        ,{value: '12', label: 'One'}
        ,{value: '14', label: 'One'}
        ,{value: '15', label: 'One'}
        ,{value: '16', label: 'One'}
        ,{value: '17', label: 'One'}
        ,{value: '18', label: 'One'}
        ,{value: '19', label: 'One'}
        ,{value: '20', label: 'One'}
        ,  ]
    }
    selecthours(e){
        console.log(e);
    }
  render() {  
    return (  
    <div className='popup'>  
        <div className='popup\_inner'>  
            <Dropdown options={this.state.hours}  onChange={this.selecthours}  />
        
        <button onClick={this.props.closePopup}>שמור </button>  
        </div>  
    </div>  
    );  
    }  
}  

export default WorkingDays;