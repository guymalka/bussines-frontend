import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';


export default class InputText extends React.Component {
    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
    }
    update(evt) {        
        this.props.onTextChange(evt.target.value)
    }
    render() {
        if (this.props.label == undefined)
            return <div> <input value={this.props.value}
                required={this.props.required || false}
                type={this.props.type || "text"}
                className={this.props.class}
                disabled={this.props.disabled || false}
                placeholder={this.props.text}
                onChange={this.update} />                
                </div>
        else
            return <div>
                <label for="name" >{this.props.label}</label>
                <input value={this.props.value}
                    className={this.props.class}
                    required={this.props.required || false}
                    type={this.props.type || "text"}
                    disabled={this.props.disabled || false}
                    placeholder={this.props.text}
                    onChange={this.update}  />
                </div>
            
    }
}

InputText.propTypes = {
    text: PropTypes.string,
    value: PropTypes.string
}
