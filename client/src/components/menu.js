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

export default class MenuList extends Component {

    constructor(props) {
        super(props);
        window.menuComponent = this;
        this.state = {
            menuList: [],
            edit: true,
            checkboxMenuItems: [],
            tableHidden: "none",
            retrieved: false,
            selectedItems: [],
            mainChecked: false,
        };
        this.onClickCheckbox = this.onClickCheckbox.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }



    handleChange = field => values => {
        this.setState({ [field]: values });
    };



    componentDidMount() {
        axios.get('/api/richton/getMenuData')
            .then(response => {
                this.setState({ menuList: response.data, retrieved: true });
                this.mapObjecttoArray();
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    menuItemList() {
        // return Object.keys(this.state.menuList).map(function(currentMenuList, i){
        //         return <Menu menu={list[currentMenuList]} key={i} />;
        return this.state.menuList.map(function (currentTodo, i) {
            return <Menu menu={currentTodo} key={i} />;
        })
    }

    mapObjecttoArray() {
        _.map(this.state.menuList, item => {
            this.setState({ checkboxMenuItems: [...this.state.checkboxMenuItems, { label: `${item.menu_item_name}`, value: `${item.menu_item_price}` }] });
        })
    }

    onClickCheckbox(id, foodName, foodPrice) {
        const checked = this.state.mainChecked;
        if(!checked){
            this.setState({ selectedItems: [...this.state.selectedItems, [foodName, foodPrice]], mainChecked: true});
            document.getElementById("alertBox").style["display"] = "none";
        }else{
            const item = this.state.selectedItems;
            if(item[0][0] === foodName){
                this.setState({selectedItems: [], mainChecked: false});
            }else{
                var x = document.getElementById(id);
                x.checked = false;
                document.getElementById("alertBox").style["display"] = "block";
            }
            
        }
    }

    revealTable() {
        this.setState({ tableHidden: "block" })
    }

    onSubmit() {
        console.log(this.state.selectedItems);
    }



    render() {
        return (
            <div>
                {this.state.retrieved ? (<div>
                <h3 onClick={() => { this.revealTable() }}>Menu List</h3>

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
                            Click me!
                                    </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>Hello! I'm another body</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                <div className="form-group">
                        <input type="submit" onClick={() => {this.onSubmit()}}value="Add new order" className="btn btn-primary" />
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