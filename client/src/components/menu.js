import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import _ from "lodash";
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

const divStyle = {
    overflowY: 'auto',
    height: 300
};

const Menu = props => (
    <tr>
        <td>{props.menu.menu_item_name}</td>
        <td>{props.menu.menu_item_price}</td>
        <td>{props.menu.menu_item_availability}</td>
        <td><input type="checkbox" onClick={() => { window.menuComponent.onClickCheckbox([props.menu.menu_item_name, props.menu.menu_item_price]) }} /></td>
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
            hisFavoriteFruit: [],
            herFavoriteFruit: [],
            edit: true,
            checkboxMenuItems: [],
            tableHidden: "none"
        };
        this.onClickCheckbox = this.onClickCheckbox.bind(this);
    }



    handleChange = field => values => {
        this.setState({ [field]: values });
    };



    componentDidMount() {
        axios.get('/api/richton/getMenuData')
            .then(response => {
                this.setState({ menuList: response.data });
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

    onClickCheckbox(e) {
        console.log(e);
    }

    revealTable() {
        this.setState({ tableHidden: "block" })
    }



    render() {
        return (
            <div>
                <h3 onClick={() => { this.revealTable() }}>Menu List</h3>

                <Accordion defaultActiveKey="0">
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                            Click me!
                                    </Accordion.Toggle>
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

            </div>
        )
    }
}