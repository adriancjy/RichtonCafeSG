import React, { Component } from 'react';

const cartStyle ={
    width: 400
}

const tableBorder ={
    border: 'solid',
    marginLeft: 150

}

const priceBorder ={
    marginLeft: 150
}

const OrderSummary = props => (
    <table style={tableBorder}>
        {props.selectedsummary.type == "main" && <thead>
            <tr class="p-3 mb-2 bg-dark text-white">
                <th>
                    Order Summary
                </th>
                <th>

                </th>
            </tr>
            <tr>
            <th style={cartStyle}>
                Order {props.selectedsummary.OrderNum}
            </th>
            <th>
                Price
            </th>
            </tr>
        </thead>}
        <tbody>
            <tr>
            <td style={cartStyle}>{props.selectedsummary.mlabel}</td>
            <td>{props.selectedsummary.mprice}</td>
            </tr>
            <tr>
            <td style={cartStyle}>{props.selectedsummary.slabel}</td>
            <td>{props.selectedsummary.sprice}</td>
            </tr>
        </tbody>
              
    </table> 

)

const TotalPrice = props => (
    <table style={priceBorder}>
        <thead>
            <tr>
                <th style={cartStyle}>
                    Total price is:
                </th>
                <th>
                    {props.totalPrice}
                </th>
            </tr>
        </thead>
    </table>
)

export default class Payment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedItems: [],
            totalPrice: 0
        }
        this.componentWillMount = this.componentWillMount.bind(this);
    }

    componentWillMount(){
        var price = this.props.location.state.totalPrice;
        var orders = this.props.location.state.selectedItems;
        this.setState({selectedItems: orders, totalPrice: price});
    }

    renderOrderSummary(){
        return this.state.selectedItems.map(function (selected, i){
            return <OrderSummary selectedsummary={selected} key={i}/>
        })
    }

    renderTotalPrice(){
        var totalPrice = this.state.totalPrice;
        return <TotalPrice totalPrice={totalPrice}/>
    }

    render() {
    return (
    <div
    style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)'
    }}>
        <h3>Your order has been successfully completed. Your order summary is as below:</h3>
        <br/>
        {this.renderOrderSummary()}
        <br/>
        {this.renderTotalPrice()}   
        <br/>
        <h5>
            Please make your payment via PayNow or DBS PayLah! to the contact number 93889150
        </h5>
    </div>)
    }
    
}