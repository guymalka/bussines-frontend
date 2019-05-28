import React from 'react';

export default class Uploader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fileReader: null,
            data: {}, //base 64 data      
            fileType: '',
            fileName: ''
        }
        this.handleFileRead = this.handleFileRead.bind(this);    
        this.handleFileChosen = this.handleFileChosen.bind(this);
    }

    handleFileRead(e) {
        let content = this.state.fileReader.result;
        let data = {};
        data.base64 = content.replace(content.substring(0, content.indexOf(',') + 1), '');
        //callback - upload directly insted uf using save button
        this.setState({ data: data.base64 });
        if (this.props.uploadFunc)
            this.props.uploadFunc({ base64: data.base64, Name: this.state.fileName, Type: this.state.fileType });
    }
    
    
    handleFileChosen(file) {

        this.setState({ fileName: file.name, fileType: file.type });
        this.state.fileReader = new FileReader();
        this.state.fileReader.onloadend = this.handleFileRead;
        this.state.fileReader.readAsDataURL(file);
    }

    render() {
        return <div >                
                <div >
                    <input className="form-control-file" onChange={e => this.handleFileChosen(e.target.files[0])} type="file" />
                </div>
        </div>;
    }


}