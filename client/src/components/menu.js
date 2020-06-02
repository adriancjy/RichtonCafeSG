import React, { Component, useState } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import _ from "lodash";
import Accordion from 'react-bootstrap/Accordion';
import { Alert } from 'reactstrap';
import Card from 'react-bootstrap/Card';
import { Spinner } from "react-bootstrap";
import { Container, Button, Link } from 'react-floating-action-button';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FiShoppingCart } from 'react-icons/fi/';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';

const divStyle = {
    overflowY: 'auto',
    height: 300
};

const alertStyle = {
    display: 'none'
};

const floatingActionStyleF ={
    display: 'none'
}

const floatingActionStyleT ={
    display: 'block'
}

const cartStyle ={
    width: 400
}

const Menu = props => (
    <tr>
        <td>{props.menu.menu_item_name}</td>
        <td>{props.menu.menu_item_price}</td>
        <td>{props.menu.menu_item_availability}</td>
        <td><input type="checkbox" id={props.menu._id} onClick={() => { window.menuComponent.onClickCheckbox(props.menu._id, props.menu.menu_item_name, props.menu.menu_item_price) }} /></td>
        {/* <td> */}
        {/* <Link to={"/edit/"+props.todo._id}>Edit</Link> */}
        {/* </td> */}
    </tr>
)

const SideDish = props => (
    <tr>
        <td>{props.sidedish.menu_item_name}</td>
        <td>{props.sidedish.menu_item_price}</td>
        <td>{props.sidedish.menu_item_availability}</td>
        <td><input type="checkbox" id={props.sidedish._id} onClick={() => { window.menuComponent.onClickSideDishCheckbox(props.sidedish._id, props.sidedish.menu_item_name, props.sidedish.menu_item_price) }} /></td>
        {/* <td> */}
        {/* <Link to={"/edit/"+props.todo._id}>Edit</Link> */}
        {/* </td> */}
    </tr>
)


const MainOrders = props => (
    <table>
        {props.selectedorder.type == "main" && <thead>
            <tr>
                <th>-------</th>
            </tr>
            <tr>
            <th style={cartStyle}>
                Order {props.selectedorder.OrderNum}
            </th>
            <th>
                Price
            </th>
            </tr>
        </thead>}
        <tbody>
            <tr>
            <td style={cartStyle}>{props.selectedorder.mlabel}</td>
            <td>{props.selectedorder.mprice}</td>
            </tr>
            <tr>
            <td style={cartStyle}>{props.selectedorder.slabel}</td>
            <td>{props.selectedorder.sprice}</td>
            </tr>
        </tbody>
              
    </table> 

)

const TotalPrice = props => (
    <table>
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



  
export default class MenuList extends Component {
    
    constructor(props) {
        super(props);
        window.menuComponent = this;
        this.state = {
            menuList: [],
            sideDishList: [],
            edit: true,
            checkboxMenuItems: [],
            sideDishCheckBox: [],
            currentSelection: [],
            tableHidden: "none",
            retrieved: false,
            selectedItems: [],
            selectedSideDish: [],
            mainChecked: false,
            nothingSelected: true,
            iteminCart: false,
            isPaneOpen: false,
            checkOnce: false,
            orderCounter: 1,
            sideChecked: false,
            totalPriceCal: 0
        };
        this.onClickCheckbox = this.onClickCheckbox.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }



    handleChange = field => values => {
        this.setState({ [field]: values });
    };



    componentWillMount(){
        var storage = JSON.parse(localStorage.getItem("currentOrders"));
        var cartItem = localStorage.getItem("iteminCart");
        var numOrders = localStorage.getItem("numOfOrders");
        if(storage == null){
        } else{
            console.log(numOrders);
            this.setState({selectedItems: storage, iteminCart: cartItem, orderCounter: numOrders});
        }
    }

    componentDidMount() {
        //main dish
        axios.get('/api/richton/getMenuData')
            .then(response => {
                this.setState({ menuList: response.data, retrieved: true });
                this.mapObjecttoArray();
            })
            .catch(function (error) {
                console.log(error);
            })
            //side dish
            axios.get('/api/richton/getSideDish')
            .then(response => {
                this.setState({ sideDishList: response.data, retrieved: true });
                this.mapSideDishtoArray();
            })
            .catch(function (error) {
                console.log(error);
            })

            console.log(this.state.selectedItems);
        }

    //Main dish
    menuItemList() {
        return this.state.menuList.map(function (currentTodo, i) {
            return <Menu menu={currentTodo} key={i} />;
        })
    }

    //Side dish 
    sideDishItemList() {
        return this.state.sideDishList.map(function (currentTodo, i) {
            return <SideDish sidedish={currentTodo} key={i} />;
        })
    }

    //Cart
    selectedOrderReturnList(){
        return this.state.selectedItems.map(function (selectedOrders, i) {
            return <MainOrders selectedorder={selectedOrders} key={i}/>;
        })
    }

    //Richton Main dish
    mapObjecttoArray() {
        _.map(this.state.menuList, item => {
            this.setState({ checkboxMenuItems: [...this.state.checkboxMenuItems, { label: `${item.menu_item_name}`, value: `${item.menu_item_price}` }] });
        })
    }

    //Richton Side dish
    mapSideDishtoArray() {
        _.map(this.state.sideDishList, item => {
            this.setState({ sideDishCheckBox: [...this.state.sideDishCheckBox, { label: `${item.menu_item_name}`, value: `${item.menu_item_price}` }] });
        })
    }

    //Main
    onClickCheckbox(id, foodName, foodPrice) {
        const nothingSelectedValue = this.state.nothingSelected;
        var orderNo = this.state.orderCounter;
        var priceCalculate = Number(this.state.totalPriceCal,10);
        if(nothingSelectedValue){
            document.getElementById("totalAlert").style["display"] = "none";
        }
        const checked = this.state.mainChecked;
        if(!checked){
            this.setState({ selectedItems: [...this.state.selectedItems, {OrderNum: orderNo, MainId: id, mlabel: foodName, mprice: foodPrice, type: "main"}], currentSelection: [...this.state.currentSelection, {MainId: id, mlabel: foodName, price: foodPrice, type: "main"}], mainChecked: true, iteminCart: true, totalPriceCal: priceCalculate + Number(foodPrice,10)});
            document.getElementById("alertBox").style["display"] = "none";
        }else{
            const item = this.state.selectedItems;
            if(item[0].mlabel === foodName){
                this.setState({selectedItems: [], currentSelection: [], selectedSideDish: [], mainChecked: false, iteminCart: false, totalPriceCal: 0});
                this.uncheckSideDish();
            }else{
                var x = document.getElementById(id);
                x.checked = false;
                document.getElementById("alertBox").style["display"] = "block";
            }
            
        }
    }

    uncheckSideDish(){
        var sideDish = this.state.selectedItems;
        for(var i = 0; i < sideDish.length; i++){
            if(sideDish[i].type == "side"){
                document.getElementById(sideDish[i].SideId).checked = false;
            }
        }
    }

    //side
    onClickSideDishCheckbox(id, foodName, foodPrice) {
        const selectedSide = this.state.selectedSideDish;
        const mainSelected = this.state.currentSelection;
        var priceCalculate = Number(this.state.totalPriceCal,10);
        var checker = this.state.checkOnce;
        var orderNo = this.state.orderCounter;
        
        if(mainSelected.length == 0 && !checker){
            var pushEmpty = this.state.selectedItems.push({OrderNum: orderNo, MainId: 0, label: "No main selected", mprice: 0, type: "main"})
            this.setState({ selectedItems: pushEmpty, checkOnce: true, totalPriceCal: priceCalculate + 0});            
        }
        if(selectedSide.length == 0){
            this.setState({ selectedItems: [...this.state.selectedItems, {OrderNum: orderNo, SideId: id, slabel: foodName, sprice: foodPrice, type: "side"}], selectedSideDish: [...this.state.selectedSideDish, foodName], mainChecked: true, iteminCart: true, sideChecked: true, totalPriceCal: priceCalculate + Number(foodPrice,10)});
        }else{
            if(selectedSide.indexOf(foodName) > -1){
                this.setState({selectedSideDish: this.state.selectedSideDish.filter(item => item !== foodName), selectedItems: this.state.selectedItems.filter(item => item.slabel !== foodName)});
            }else{
                this.setState({ selectedItems: [...this.state.selectedItems, {OrderNum: orderNo, SideId: id, slabel: foodName, sprice: foodPrice, type: "side"}], selectedSideDish: [...this.state.selectedSideDish, foodName], mainChecked: true, iteminCart: true, sideChecked: true, totalPriceCal: priceCalculate + Number(foodPrice,10)});
            }    
        }
    }

    revealTable() {
        this.setState({ tableHidden: "block" })
    }

    onSubmit() {
        confirmAlert({
            title: 'Are you done with your current order?',
            message: 'Click yes to move to next order, no if you wish to change your current order.',
            buttons: [
              {
                label: 'Yes',
                onClick: () => this.saveStorage()
              },
              {
                label: 'No'
                
              }
            ]
          });
    }


    saveStorage(){
        var incrementOrderNo = Number(this.state.orderCounter, 10);
        incrementOrderNo = incrementOrderNo+1;
        this.setState({orderCounter: incrementOrderNo});
        localStorage.setItem("numOfOrders", incrementOrderNo);
        localStorage.setItem("currentOrders", JSON.stringify(this.state.selectedItems));
        localStorage.setItem("iteminCart", this.state.iteminCart);
        window.location.reload(false);
    }

    onFinishOrder(){
        confirmAlert({
            title: 'Finished ordering?',
            message: 'Click yes to view summary of order, no to continue order!',
            buttons: [
              {
                label: 'Yes',
                onClick: () => this.onCalculate()
              },
              {
                label: 'No'
              }
            ]
          });
    }

    onCalculate(){
        localStorage.clear();
        var totalItems = this.state.selectedItems;
        if(totalItems.length == 0){
            document.getElementById("totalAlert").style["display"] = "block";
        }else{
            var totalPrice = 0;
            for(var i = 0; i < totalItems.length; i++){
                if(totalItems[i].type == "main"){
                    totalPrice += Number(totalItems[i].mprice, 10);
                }else{
                    totalPrice += Number(totalItems[i].sprice, 10);
                }
            }
            var tP = totalPrice.toFixed(2);
            console.log(totalPrice.toFixed(2));
            console.log(totalItems);
            this.setState({totalPriceCal: tP});
        }
        
    }

    renderTotalPrice(){
        var totalCalPrice = 0;
        const totalOrder = this.state.selectedItems;
        if(totalOrder.length == 0){
            return <TotalPrice totalPrice={0}/>
        }else{
            for(var i = 0; i < totalOrder.length; i++){
                if(totalOrder[i].type == "main"){
                    totalCalPrice += Number(totalOrder[i].mprice, 10);
                }else{
                    totalCalPrice += Number(totalOrder[i].sprice, 10);
                }
            }
            return <TotalPrice totalPrice={totalCalPrice.toFixed(2)}/>
        }
    }

    OpenPane(){
        this.setState({isPaneOpen: true});
    }



    render() {
        return (
            <div>
                {this.state.retrieved ? (<div>
                <h3 onClick={() => { this.revealTable() }}>Menu List</h3>
                <a id="totalAlert" style={alertStyle}>
                                    <Alert  display={this.state.alertHidden} color="danger">
                                        You did not choose any item!
                                    </Alert >
                                    </a>
                <Accordion defaultActiveKey="0">
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                            Main food items
                                    </Accordion.Toggle>
                                    <a id="alertBox" style={alertStyle}>
                                    <Alert  display={this.state.alertHidden} color="danger">
                                        Please only select <strong>one</strong> main food item!
                                    </Alert >
                                    </a>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <div style={divStyle}>
                                    <table className="table table-striped" >
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Price</th>
                                                <th>Availability</th>
                                                <th>Select</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { this.menuItemList() } 
                                        </tbody>
                                    </table>
                                </div>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="1">
                            Side dishes
                                    </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body><div style={divStyle}>
                                    <table className="table table-striped" >
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Price</th>
                                                <th>Availability</th>
                                                <th>Select</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { this.sideDishItemList() } 
                                        </tbody>
                                    </table>
                                </div></Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="2">
                            Additional Options
                                    </Accordion.Toggle>
                        <Accordion.Collapse eventKey="2">
                            <Card.Body><div style={divStyle}>
                                    <table className="table table-striped" >
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Price</th>
                                                <th>Availability</th>
                                                <th>Select</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { this.sideDishItemList() } 
                                        </tbody>
                                    </table>
                                </div></Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                <div className="form-group">
                <input type="submit" onClick={() => {this.onSubmit()}}value="I want to add new order!" className="btn btn-warning" />
                <input type="submit" onClick={() => {this.onFinishOrder()}}value="I have finished my ordering!" className="btn btn-success" />
                </div>
                {this.state.iteminCart ? (<div id="floatingActionStyle" style={floatingActionStyleT}>
                <Container>
                <Button
                rotate={true}
                onClick={() => this.OpenPane()}><FiShoppingCart/></Button>
                </Container>
                </div>):(<div id="floatingActionStyle" style={floatingActionStyleF}>
                <Container>
                <Button
                rotate={true}
                onClick={() => this.OpenPane()}><FiShoppingCart/></Button>
                </Container>
                </div>)}

                <SlidingPane
                width= '50%'
                className='some-custom-class'
                overlayClassName='some-custom-overlay-class'
                isOpen={ this.state.isPaneOpen }
                title='Your order cart'
                onRequestClose={ () => {
                    // triggered on "<" on left top click or on outside click
                    this.setState({ isPaneOpen: false });
                } }>
                <div>
                    {this.selectedOrderReturnList()}
                    {this.renderTotalPrice()}
                </div>
                <br />
                
                </SlidingPane>
               
            </div>):(<div class="row h-100 page-container">
            <div class="col-sm-12 my-auto">
              <h3>Loading</h3>
              <Spinner class="" animation="grow" />
            </div>
          </div>)}
            </div>
            
        )
    }
}