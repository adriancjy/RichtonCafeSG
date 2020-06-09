import React, { Component } from 'react';
import { Spinner } from "react-bootstrap";



export default class Payment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            retrieved: false,
            phoneNum: ''
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangePhoneNum = this.onChangePhoneNum.bind(this);
    }

    componentDidMount(){
        this.setState({retrieved: true});
    }

    onChangePhoneNum(e){
        this.setState({phoneNum: e.target.value});
    }

    onSubmit(e){
        e.preventDefault();
        this.props.history.push({
            pathname: '/menu',
            state: {phoneNo: this.state.phoneNum}
          });
        this.setState({phoneNum: ''});

    }

    render() {
    return (
    <div>
        {this.state.retrieved ? (
        <form onSubmit={this.onSubmit}>
        <div className="form-group">
            <h3>welcome to Richton Cafe ordering website. Please enter your mobile number and press next to continue:</h3>
        <br/>
        <input  type="text"
            className="form-control"
            value={this.state.phoneNum}
            onChange={this.onChangePhoneNum}
            />
        <div className="form-group">
                        <input type="submit" value="i am ready to order!" className="btn btn-primary" />
        </div>
        
        </div></form>):(<div class="row h-100 page-container">
            <div class="col-sm-12 my-auto">
              <h3>Loading</h3>
              <Spinner class="" animation="grow" />
            </div>
          </div>)}
    </div>)
    }
    
}