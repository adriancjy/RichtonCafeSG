import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';

const Menu = props => (
    <tr>
        <td>{props.menu.menu_item_name}</td>
        <td>{props.menu.menu_item_price}</td>
        <td>{props.menu.menu_item_availability}</td>
        {/* <td> */}
            {/* <Link to={"/edit/"+props.todo._id}>Edit</Link> */}
        {/* </td> */}
    </tr>
)

export default class MenuList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuList: {}
        };
    }



    componentDidMount() {
        axios.get('/api/richton/getMenuData')
            .then(response => {
                var data = response.data[0]['menuitem'];
                this.setState({ menuList: data });
            })
            .catch(function (error){
                console.log(error);
            })
    }
    
    menuItemList() {
        var list = this.state.menuList;
        return Object.keys(this.state.menuList).map(function(currentMenuList, i){
                return <Menu menu={list[currentMenuList]} key={i} />;
            })
        
        
    }

    render() {
        return (
            <div>
                <h3>Menu List</h3>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Availability</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.menuItemList() }
                    </tbody>
                </table>
            </div>
        )
    }
}