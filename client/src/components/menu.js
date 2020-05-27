import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import _ from "lodash";
import Accordion from 'react-bootstrap/Accordion';
import { Alert } from 'reactstrap';
import Card from 'react-bootstrap/Card';
import { Spinner } from "react-bootstrap";

const divStyle = {
    overflowY: 'auto',
    height: 300
};

const alertStyle = {
    display: 'none'
};

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
            tableHidden: "none",
            retrieved: false,
            selectedItems: [],
            selectedSideDish: [],
            mainChecked: false,
            nothingSelected: true
        };
        this.onClickCheckbox = this.onClickCheckbox.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }



    handleChange = field => values => {
        this.setState({ [field]: values });
    };



    componentWillMount(){
        var storage = JSON.parse(localStorage.getItem("currentOrders"));
        if(storage == null){
            console.log(null);
        } else{
            this.setState({selectedItems: storage});
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
        if(nothingSelectedValue){
            document.getElementById("totalAlert").style["display"] = "none";
        }
        const checked = this.state.mainChecked;
        if(!checked){
            this.setState({ selectedItems: [...this.state.selectedItems, {MainId: id, label: foodName, price: foodPrice, type: "main"}], mainChecked: true});
            document.getElementById("alertBox").style["display"] = "none";
        }else{
            const item = this.state.selectedItems;
            if(item[0].label === foodName){
                this.setState({selectedItems: [], mainChecked: false});
            }else{
                var x = document.getElementById(id);
                x.checked = false;
                document.getElementById("alertBox").style["display"] = "block";
            }
            
        }
    }

    //side
    onClickSideDishCheckbox(id, foodName, foodPrice) {
        const selectedSide = this.state.selectedSideDish;
        if(selectedSide.length == 0){
            this.setState({ selectedItems: [...this.state.selectedItems, {SideId: id, label: foodName, price: foodPrice, type: "side"}], selectedSideDish: [...this.state.selectedSideDish, foodName], mainChecked: true});
        }else{
            if(selectedSide.indexOf(foodName) > -1){
                this.setState({selectedSideDish: this.state.selectedSideDish.filter(item => item !== foodName), selectedItems: this.state.selectedItems.filter(item => item.label !== foodName)});
            }else{
                this.setState({ selectedItems: [...this.state.selectedItems, {SideId: id, label: foodName, price: foodPrice, type: "side"}], selectedSideDish: [...this.state.selectedSideDish, foodName], mainChecked: true});
            }
        }
    }

    revealTable() {
        this.setState({ tableHidden: "block" })
    }

    onSubmit() {
        localStorage.setItem("currentOrders", JSON.stringify(this.state.selectedItems));
        window.location.reload(false);
    }

    onCalculate(){
        localStorage.clear();
        var totalItems = this.state.selectedItems;
        if(totalItems.length == 0){
            document.getElementById("totalAlert").style["display"] = "block";
        }else{
            var totalPrice = 0;
            for(var i = 0; i < totalItems.length; i++){
                totalPrice += Number(totalItems[i].price, 10);
            }
            console.log(totalPrice.toFixed(2));
            console.log(totalItems);
        }
        
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
                <input type="submit" onClick={() => {this.onCalculate()}}value="I have finished my ordering!" className="btn btn-success" />
                </div>
               
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