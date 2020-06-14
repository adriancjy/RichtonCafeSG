import React, { Component } from 'react';

const cartStyle ={
    width: 200,
    textAlign: 'left'
}

const cartStyle2 ={
    width: 100
}

const tableBorder ={
    border: 'solid',
    width: 300,
}

const mainTable ={
    border: 'solid',
    margin: '0 auto',
    width: 300,
}

const priceBorder ={
    margin: '0 auto'
}

const OrderSummary = props => (
    <table>
        {props.selectedsummary.type == "main" && <thead>
            <tr>
            <th style={cartStyle}>
                Order {props.selectedsummary.OrderNum}
            </th>
            <th>
                Price
            </th>
            </tr>
        </thead>}
        {props.selectedsummary.type == "nomain" && <thead>
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
            <td style={cartStyle2}>{props.selectedsummary.mprice}</td>
            </tr>
            <tr>
            <td style={cartStyle}>{props.selectedsummary.slabel}</td>
            <td style={cartStyle2}>{props.selectedsummary.sprice}</td>
            </tr>
            <tr>
            <td style={cartStyle}><i>{props.selectedsummary.alabel}</i></td>
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
                <th style={cartStyle2}>
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
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount(){
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
    >
        <h3>Your order has been successfully completed. Your order summary is as below:</h3>
        <br/>
        <table style={mainTable}>
            <thead>
            <tr class="p-3 mb-2 bg-dark text-white">
                <th>
                    Order Summary
                </th>
            </tr>
        </thead>
        <tbody>
        {this.renderOrderSummary()}
        </tbody>
        </table>
        <br/>
        {this.renderTotalPrice()}   
        <br/>
        <h5>
            Please make your payment via PayNow or DBS PayLah! to the contact number 93889150
        </h5>
    </div>)
    }
    
}