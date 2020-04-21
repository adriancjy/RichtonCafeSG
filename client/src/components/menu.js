import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    CheckboxLabelValueSelect,
    CheckboxValueSelect
  } from "mui-checkboxlist";
  import _ from "lodash";

  const Menu = props => (
    <tr>
        <td>{props.menu.menu_item_name}</td>
        <td>{props.menu.menu_item_price}</td>
        <td>{props.menu.menu_item_availability}</td>
        <td><input type="checkbox" onClick={() => { window.menuComponent.onClickCheckbox([props.menu.menu_item_name, props.menu.menu_item_price])}}/></td>
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
            checkboxMenuItems: []
        };
        this.onClickCheckbox = this.onClickCheckbox.bind(this);
    }

    

    handleChange = field => values => {
        this.setState({ [field]: values });
      };



    componentDidMount() {
        axios.get('/api/richton/getMenuData')
            .then(response => {
                this.setState({menuList: response.data});
                this.mapObjecttoArray();
            })
            .catch(function (error){
                console.log(error);
            })
    }
    
    menuItemList() {
        // return Object.keys(this.state.menuList).map(function(currentMenuList, i){
        //         return <Menu menu={list[currentMenuList]} key={i} />;
        return this.state.menuList.map(function(currentTodo, i){
            return <Menu menu={currentTodo} key={i} />;
            })
    }

    mapObjecttoArray(){
        _.map(this.state.menuList, item => {
            this.setState({checkboxMenuItems: [...this.state.checkboxMenuItems, {label: `${item.menu_item_name}`, value: `${item.menu_item_price}`}]});
        })
    }

    onClickCheckbox(e){
        console.log(e);
    }

    render() {
        
        
        const labelValueListItems = [
            { label: "apple",  value: "90" },
            { label: "banana", value: "50" },
            { label: "orange", value: "70" },
            { label: "pear", value: "100" },
            { label: "raspberry", value: "40" }
          ];
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

                    {/* <div>
          <CheckboxLabelValueSelect
            disabled={!this.state.edit}
            label="Her Favorite Food"
            limit={{ max: 3, deleteLast: true }}
            listItems={this.state.checkboxMenuItems}
            onChange={this.handleChange("herFavoriteFruit")}
            searchBarLabel="Trial"
           
            statusBar
            style={{
              listContainer: {
                height: "150px"
              }
            }}
          />
        </div>
        <div style={{ padding: "10px" }}>
          {_.map(this.state.herFavoriteFruit, item => {
            return <div>{`${item.label}: $${item.value}`}</div>;
          })}
        </div> */}
                    </tbody>
                </table>
            </div>
        )
    }
}