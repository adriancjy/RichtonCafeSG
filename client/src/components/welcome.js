import React, { Component } from 'react';
import { Spinner } from "react-bootstrap";
import { Alert } from 'reactstrap';

const alertStyle = {
    display: 'none'
};



export default class Payment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            retrieved: false,
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangePhoneNum = this.onChangePhoneNum.bind(this);
    }

    componentDidMount(){
        this.setState({retrieved: true});
        localStorage.clear();
    }

    onChangePhoneNum(e){
        if(e.target.value != ''){
            document.getElementById("totalAlert").style["display"] = "none";
        }
    }

    onSubmit(e){
        e.preventDefault();
        const re = /^[0-9\b]+$/;
        var x = document.getElementById("tbPhone");
        if(x.value == ''){
            document.getElementById("totalAlert").style["display"] = "block";
        }else{
            if(re.test(x.value)){
                document.getElementById("totalAlert").style["display"] = "none";
                if(x.value.length !== 8){
                    document.getElementById("invalidAlert").style["display"] = "block";
                }else{
                    document.getElementById("totalAlert").style["display"] = "none";
                    this.props.history.push({
                        pathname: '/menu',
                        state: {phoneNo: x.value}
                      });
                }
            }else{
                document.getElementById("invalidAlert").style["display"] = "block";
            }
        }
    }

    render() {
    return (
    <div>
        {this.state.retrieved ? (
        <form onSubmit={this.onSubmit}>
        <div className="form-group">
            <h3>Welcome to Richton Cafe ordering website.</h3>
            <h5>Please enter your mobile number and press next to continue:</h5>
        <br/>
        <a id="totalAlert" style={alertStyle}>
        <Alert  display={this.state.alertHidden} color="danger">
        Please type in your mobile number!
        </Alert >
        </a>
        <a id="invalidAlert" style={alertStyle}>
        <Alert  display={this.state.alertHidden} color="danger">
        You did not enter a valid mobile number. Please enter a valid 8-digit mobile number!
        </Alert >
        </a>
        <input type="text"
        id="tbPhone"
            className="form-control"
            placeholder="Please enter your 8-digit mobile number here!"
            onChange={this.onChangePhoneNum}
            />
            <br/>
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