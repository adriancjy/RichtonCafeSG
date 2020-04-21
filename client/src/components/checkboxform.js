import React, { Component } from 'react';
var CheckboxList = require('react-checkbox-list');

export default class CheckboxForm extends Component {
    constructor(props) {
        super(props);
        
    }

    handleCheckboxListChange(values) {
        // values is array of selected item. e.g. ['apple', 'banana']
        console.log(values);
    }


    render() {
        // supply initial data
        var data = [
            {value: 'apple', label: 'Apple'},
            {value: 'orange', label: 'Orange'},
            {value: 'banana', label: 'Banana', checked: true} // check by default
        ];
     
        return(
            <div>
                {/* <CheckboxList ref="chkboxList" defaultData={data} onChange={this.handleCheckboxListChange} /> */}
            </div>
        );
    }
}
  