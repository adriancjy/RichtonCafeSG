import React, { Component, useState } from 'react';
import { Redirect } from 'react-router-dom';
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

const floatingActionStyleF = {
    display: 'none'
}

const floatingActionStyleT = {
    display: 'block'
}

const cartStyle = {
    width: 400
}

const cartStyle2 = {
    width: 100
}

const tbStyle = {
    width: 50
}

const AStyle ={
    width: 606
}

const Menu = props => (
    <tr>
        <td>{props.menu.menu_item_name}</td>
        <td>{props.menu.menu_item_price}</td>
        <td>{props.menu.menu_item_availability}</td>
        <td><input id="quantityMainM" type="button" value="-" onClick={() => { window.menuComponent.quantityMainMinus("quantityMain_" + props.menu._id, props.menu._id, props.menu.menu_item_name, props.menu.menu_item_price) }} /><input id={"quantityMain_" + props.menu._id} style={tbStyle} type="text" onKeyDown={window.menuComponent.tbKeyPressed()} /><input id="quantityMainP" type="button" value="+" onClick={() => { window.menuComponent.quantityMainPlus("quantityMain_" + props.menu._id, props.menu._id, props.menu.menu_item_name, props.menu.menu_item_price) }} /></td>
    </tr>
)

const SideDish = props => (
    <tr>
        <td>{props.sidedish.menu_item_name}</td>
        <td>{props.sidedish.menu_item_price}</td>
        <td>{props.sidedish.menu_item_availability}</td>
        <td><input id="quantitySideM" type="button" value="-" onClick={() => { window.menuComponent.quantitySideMinus("quantitySide_" + props.sidedish._id, props.sidedish._id, props.sidedish.menu_item_name, props.sidedish.menu_item_price) }} /><input id={"quantitySide_" + props.sidedish._id} style={tbStyle} type="text" onKeyDown={window.menuComponent.tbKeyPressed()} /><input id="quantitySideP" type="button" value="+" onClick={() => { window.menuComponent.quantitySidePlus("quantitySide_" + props.sidedish._id, props.sidedish._id, props.sidedish.menu_item_name, props.sidedish.menu_item_price) }} /></td>
    </tr>
)


const Additional = props => (
    <tr>
        <td>{props.additional.menu_item_name}</td>
        <td><input type="checkbox" className="checkbox" id={props.additional._id} onClick={() => { window.menuComponent.onClickAdditionalCheckbox(props.additional._id, props.additional.menu_item_name, props.additional.menu_item_price) }} /></td>
    </tr>
)


const MainOrders = props => (
    <table>
        {props.selectedorder.start === "true" && <thead>
            <tr>
                <th style={cartStyle}>
                    Order {props.selectedorder.OrderNum}
                </th>
                <th style={cartStyle2}>
                    Quantity
                </th>
                <th>
                    Price per item
                </th>
            </tr>
        </thead>}
        <tbody>
            <tr>
                <td style={cartStyle}>{props.selectedorder.mlabel}</td>
                <td style={cartStyle2}>{props.selectedorder.mquantity}</td>
                <td>{props.selectedorder.mprice}</td>
            </tr>
            <tr>
                <td style={cartStyle}>{props.selectedorder.slabel}</td>
                <td style={cartStyle2}>{props.selectedorder.quantity}</td>
                <td>{props.selectedorder.sprice}</td>
            </tr>
            <tr>
                <td style={cartStyle}><i>{props.selectedorder.alabel}</i></td>
            </tr>
            <tr>
                {props.selectedorder.completed == 'true' &&
                    <td>
                        {/* <input type="submit" value="Edit" className="btn btn-warning" onClick={() => { window.menuComponent.editOrder(props.selectedorder.OrderNum) }}></input> */}
                        <input type="submit" value="Delete" className="btn btn-danger" onClick={() => { window.menuComponent.deleteOrder(props.selectedorder.OrderNum) }}></input>
                    </td>}
            </tr>
        </tbody>
</table>


)

const CurrentCart = props => (
    <tbody>
        <tr>
            <td style={cartStyle}>{props.currentselect.mlabel}</td>
            <td style={cartStyle2}>{props.currentselect.mquantity}</td>
            <td>{props.currentselect.mprice}</td>
        </tr>
        <tr>
            <td style={cartStyle}>{props.currentselect.slabel}</td>
            <td style={cartStyle2}>{props.currentselect.quantity}</td>
            <td>{props.currentselect.sprice}</td>
        </tr>
        <tr>
            <td style={cartStyle}><i>{props.currentselect.alabel}</i></td>
        </tr>
    </tbody>

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
            additionalCheckBox: [],
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
            totalPriceCal: 0,
            currentCart: [],
            itemAddedToCart: false,
            phoneNo: '',
            additionalList: [],
            selectedAdditionalOptions: []
        };
        this.onClickCheckbox = this.onClickCheckbox.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }



    handleChange = field => values => {
        this.setState({ [field]: values });
    };

    componentWillMount() {
        var storage = JSON.parse(localStorage.getItem("currentOrders"));
        var cartItem = localStorage.getItem("iteminCart");
        var numOrders = localStorage.getItem("numOfOrders");
        var itemAddedCart = localStorage.getItem("itemAddedToCart")
        if (storage == null) {
        } else {
            this.setState({ selectedItems: storage, iteminCart: cartItem, orderCounter: numOrders, itemAddedToCart: itemAddedCart });
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

        //Additional
        axios.get('/api/richton/getAdditional')
            .then(response => {
                this.setState({ additionalList: response.data, retrieved: true });
                this.mapAdditionaltoArray();
            })
            .catch(function (error) {
                console.log(error);
            })

        var key = this.props.location.state.phoneNo;
        this.setState({ phoneNo: key });
    }


    tbKeyPressed(){
        return false;
    }

    editOrder(id) {
        confirmAlert({
            title: 'Do you want to edit this order?',
            message: 'Clicking yes will remove your current selection!',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.editOrderConfirmed(id)
                },
                {
                    label: "No"
                }
            ]
        });
    }

    editOrderConfirmed(id) {
        var checkboxes = document.getElementsByClassName('checkbox');
        for (var x = 0; x < checkboxes.length; x++) {
            checkboxes[x].checked = false;
        }
        var newID = Number(this.state.orderCounter, 10) - 1;
        var currentMain = this.state.currentSelection.splice();
        var currentSide = this.state.selectedSideDish.splice();
        var currentOpt = this.state.selectedAdditionalOptions.splice();
        var currentC = this.state.currentCart.splice();
        var selected = this.state.selectedItems;
        var newOrderId = selected[selected.length - 1].OrderNum;
        var emptyCart = [];
        this.setState({ currentSelection: emptyCart, currentCart: emptyCart, selectedSideDish: emptyCart, mainChecked: false });

        for (var i = 0; i < currentC.length; i++) {
            if (currentC[i].type == "main") {
                document.getElementById(currentC[i].MainId).checked = false;
            } else if (currentC[i].type == "side") {
                document.getElementById(currentC[i].SideId).checked = false;
            } else {
                document.getElementById(currentC[i].AddId).checked = false;

            }
        }
        for (var i = 0; i < selected.length; i++) {
            if (selected[i].OrderNum == id && selected[i].type == "main") {
                currentMain.push(selected[i]);
                currentC.push(selected[i]);
                document.getElementById(selected[i].MainId).checked = true;
            } else if (selected[i].OrderNum == id && selected[i].type == "nomain") {
                currentMain.push(selected[i]);
                currentC.push(selected[i]);
            } else if (selected[i].OrderNum == id && selected[i].type == "side") {
                currentSide.push(selected[i]);
                currentC.push(selected[i]);
                document.getElementById(selected[i].SideId).checked = true;
            } else if (selected[i].OrderNum == id && selected[i].type == "additional") {
                currentOpt.push(selected[i]);
                currentC.push(selected[i]);
                document.getElementById(selected[i].AddId).checked = true;
            }
        }
        selected = selected.filter(item => item.OrderNum !== id);
        for (var i = 0; i < selected.length; i++) {
            if (selected[i].OrderNum > id) {
                selected[i].OrderNum = selected[i].OrderNum - 1;
            }
        }
        for (var i = 0; i < currentC.length; i++) {
            currentC[i].OrderNum = newOrderId;
        }
        this.setState({ orderCounter: newID });
        localStorage.setItem("numOfOrders", newID);
        this.setState({ currentCart: currentC, currentSelection: currentMain, selectedSideDish: currentSide, selectedAdditionalOptions: currentOpt, mainChecked: true, selectedItems: selected });

    }

    deleteOrder(id) {
        confirmAlert({
            title: 'Do you want to remove this order?',
            message: 'Clicking yes will remove your selected order from the cart!',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.deleteOrderConfirmed(id)
                },
                {
                    label: "No"
                }
            ]
        });
    }

    deleteOrderConfirmed(id) {
        var newID = Number(this.state.orderCounter, 10) - 1;
        this.setState({ orderCounter: newID });
        var selectedOrder = this.state.selectedItems.filter(item => item.OrderNum !== id);
        var current = this.state.currentCart;
        var currentSel = this.state.currentSelection;
        if (selectedOrder.length == 0) {
            this.setState({ iteminCart: false });
        } else {
            for (var i = 0; i < selectedOrder.length; i++) {
                if (selectedOrder[i].OrderNum > id) {
                    selectedOrder[i].OrderNum = selectedOrder[i].OrderNum - 1;
                } else if (selectedOrder[i].Ordernum == id) {
                    selectedOrder[i].OrderNum = selectedOrder[i].OrderNum - 1;
                }
            }
        }
        if (current.length > 0) {
            for (var i = 0; i < current.length; i++) {
                var newOID = current[i].OrderNum - 1;
                current[i].OrderNum = newOID;
            }
        }

        if (currentSel.length > 0) {
            for (var i = 0; i < currentSel.length; i++) {
                var newOID = currentSel[i].OrderNum - 1;
                currentSel[i].OrderNum = newOID;
            }
        }


        localStorage.setItem("currentOrders", JSON.stringify(selectedOrder));
        localStorage.setItem("numOfOrders", newID);
        this.setState({ selectedItems: selectedOrder, orderCounter: newID, currentCart: current, currentSelection: currentSel });
    }


    quantityMainMinus(qid, id, foodName, foodPrice) {
        var selectedSide = this.state.selectedSideDish;
        var currentSel = this.state.currentCart;
        var mainSelected = this.state.currentSelection;
        var priceCalculate = Number(this.state.totalPriceCal, 10);
        var orderNo = Number(this.state.orderCounter, 10);
        var quantityQID = document.getElementById(qid);
        var newQuantity = Number(quantityQID.value, 10) - 1;
        if(mainSelected.some(e => e.mlabel === foodName)){
            if(newQuantity > 0){
                quantityQID.value = newQuantity;
                for (var i = 0; i < mainSelected.length; i++) {
                    if (mainSelected[i].MainId == id) {
                        mainSelected[i].mquantity = quantityQID.value;
                    }
                }
                this.setState({ currentSelection: mainSelected, iteminCart: true, mainChecked: true, totalPriceCal: priceCalculate - Number(foodPrice, 10) });
                var current = [...mainSelected, ...selectedSide];
                this.setState({ currentCart: current });
            }else if(newQuantity == 0){
                quantityQID.value = "";
                if(this.state.currentCart.length == 0){
                    this.setState({iteminCart: false, sideChecked: false, mainChecked: false});
                }
                var newASD = currentSel.filter(e => e.mlabel !== foodName);
                this.setState({currentSelection: this.state.currentSelection.filter(e => e.mlabel !== foodName), currentCart: this.state.currentCart.filter(e => e.mlabel !== foodName), totalPriceCal: priceCalculate - Number(foodPrice, 10) });
            }
        }
        
        
        
    }

    quantityMainPlus(qid, id, foodName, foodPrice) {
        var orderNo = Number(this.state.orderCounter, 10);
        var priceCalculate = Number(this.state.totalPriceCal, 10);
        var currentSelect = this.state.currentSelection;
        var currentCartItems = this.state.currentCart;
        var currentSide = this.state.selectedSideDish;
        var quantityQID = document.getElementById(qid);
        var newQuanCount = Number(quantityQID.value, 10) + 1;
        quantityQID.value = newQuanCount;

        if (!currentSide.some(e => e.type === "nomain")) {
            if (currentSelect.some(e => e.mlabel === foodName)) {
                for (var i = 0; i < currentSelect.length; i++) {
                    if (currentSelect[i].MainId == id) {
                        currentSelect[i].mquantity = quantityQID.value;
                    }
                }
                for (var i = 0; i < currentCartItems.length; i++) {
                    if (currentCartItems[i].MainId == id) {
                        currentCartItems[i].mquantity = quantityQID.value;
                    }
                }
                this.setState({ currentCart: currentCartItems, currentSelection: currentSelect, mainChecked: true, iteminCart: true, totalPriceCal: priceCalculate + Number(foodPrice, 10) });
            } else {
                this.setState({ currentSelection: [...this.state.currentSelection, { OrderNum: orderNo, MainId: id, mlabel: foodName, mprice: foodPrice, type: "main", mquantity: quantityQID.value }], currentCart: [...this.state.currentCart, { OrderNum: orderNo, MainId: id, mlabel: foodName, mprice: foodPrice, type: "main", mquantity: quantityQID.value }], currentSelection: [...this.state.currentSelection, { OrderNum: orderNo, MainId: id, mlabel: foodName, mprice: foodPrice, type: "main", mquantity: quantityQID.value }], mainChecked: true, iteminCart: true, totalPriceCal: priceCalculate + Number(foodPrice, 10) });
            }
        }else{
            var filterCart = currentCartItems.filter(e => e.type !== "nomain");
            var newCart = [{OrderNum: orderNo, MainId: id, mlabel: foodName, mprice: foodPrice, type: "main", mquantity: quantityQID.value}].concat(filterCart);
            this.setState({currentCart: newCart, currentSelection: [...this.state.currentSelection, { OrderNum: orderNo, MainId: id, mlabel: foodName, mprice: foodPrice, type: "main", mquantity: quantityQID.value }], mainChecked: true, iteminCart: true, totalPriceCal: priceCalculate + Number(foodPrice, 10) });
        }




    }


    quantitySideMinus(qid, id, foodName, foodPrice) {
        var selectedSide = this.state.selectedSideDish;
        var mainSelected = this.state.currentSelection;
        var priceCalculate = Number(this.state.totalPriceCal, 10);
        var checker = this.state.checkOnce;
        var alrSelectedItems = this.state.selectedItems;
        var orderNo = Number(this.state.orderCounter, 10);
        var quantityQID = document.getElementById(qid);
        var newQuantity = Number(quantityQID.value, 10) - 1;
        if (newQuantity > 0) {
            quantityQID.value = newQuantity;
            if (selectedSide.some(e => e.slabel === foodName)) {
                for (var i = 0; i < selectedSide.length; i++) {
                    if (selectedSide[i].SideId == id) {
                        selectedSide[i].quantity = quantityQID.value;
                    }
                }
                this.setState({ selectedSideDish: selectedSide, iteminCart: true, sideChecked: true, totalPriceCal: priceCalculate - Number(foodPrice, 10) });
                var current = [...mainSelected, ...selectedSide];
                this.setState({ currentCart: current });
            } else {
                this.setState({ selectedSideDish: [...this.state.selectedSideDish, { OrderNum: orderNo, SideId: id, slabel: foodName, sprice: foodPrice, type: "side", quantity: quantityQID.value }], iteminCart: true, sideChecked: true, totalPriceCal: priceCalculate - Number(foodPrice, 10) });
                var sideO = selectedSide.concat({ OrderNum: orderNo, SideId: id, slabel: foodName, sprice: foodPrice, type: "side", quantity: quantityQID.value });
                var current = [...mainSelected, ...sideO];
                this.setState({ currentCart: current });

            }
        } else if (newQuantity == 0) {
            quantityQID.value = "";
            if (mainSelected.length == 0 && alrSelectedItems.length == 0 && selectedSide.length == 0) {
                this.setState({ currentCart: [], selectedSideDish: this.state.selectedSideDish.filter(e => e.slabel !== foodName), iteminCart: false, mainChecked: false, sideChecked: false });
            } else if (mainSelected.length != 0) {
                this.setState({ currentCart: this.state.currentCart.filter(e => e.slabel !== foodName) });
            } else if (selectedSide.length !== 0) {
                this.setState({ currentCart: this.state.currentCart.filter(e => e.slabel !== foodName), selectedSideDish: this.state.selectedSideDish.filter(e => e.slabel !== foodName) });
            }
        }
    }

    quantitySidePlus(qid, id, foodName, foodPrice) {
        var selectedSide = this.state.selectedSideDish;
        var mainSelected = this.state.currentSelection;
        var priceCalculate = Number(this.state.totalPriceCal, 10);
        var checker = this.state.checkOnce;
        var orderNo = Number(this.state.orderCounter, 10);
        var quantityQID = document.getElementById(qid);
        var newQuanCount = Number(quantityQID.value, 10) + 1;
        quantityQID.value = newQuanCount;

        if (mainSelected.length == 0 && !checker) {
            var pushEmpty = this.state.selectedSideDish.push({ OrderNum: orderNo, MainId: 0, label: "No main selected", nmprice: 0, type: "nomain", nquantity: 0 })
            this.setState({ selectedSideDish: pushEmpty, checkOnce: true, totalPriceCal: priceCalculate + 0 });
        }
        if (selectedSide.some(e => e.slabel === foodName)) {
            for (var i = 0; i < selectedSide.length; i++) {
                if (selectedSide[i].SideId == id) {
                    selectedSide[i].quantity = quantityQID.value;
                }
            }
            this.setState({ selectedSideDish: selectedSide, iteminCart: true, sideChecked: true, totalPriceCal: priceCalculate + Number(foodPrice, 10) });
            var current = [...mainSelected, ...selectedSide];
            this.setState({ currentCart: current });

        } else {
            this.setState({ selectedSideDish: [...this.state.selectedSideDish, { OrderNum: orderNo, SideId: id, slabel: foodName, sprice: foodPrice, type: "side", quantity: quantityQID.value }], iteminCart: true, sideChecked: true, totalPriceCal: priceCalculate + Number(foodPrice, 10) });
            var sideO = selectedSide.concat({ OrderNum: orderNo, SideId: id, slabel: foodName, sprice: foodPrice, type: "side", quantity: quantityQID.value });
            var current = [...mainSelected, ...sideO];
            this.setState({ currentCart: current });
        }

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

    //Additional Options
    additionalOptionsList() {
        return this.state.additionalList.map(function (additionalOptions, i) {
            return <Additional additional={additionalOptions} key={i} />;
        })
    }

    //Added Cart
    selectedOrderReturnList() {
        return this.state.selectedItems.map(function (selectedOrders, i) {
            return <MainOrders selectedorder={selectedOrders} key={i} />;
        })
    }

    //Current selections
    renderCurrentSelectedCart() {
        return this.state.currentCart.map(function (currentSelected, i) {
            return <CurrentCart currentselect={currentSelected} key={i} />
        })
    }


    ///pending do i need this portion???
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

    //Richton Additional
    mapAdditionaltoArray() {
        _.map(this.state.sideDishList, item => {
            this.setState({ additionalCheckBox: [...this.state.additionalCheckBox, { label: `${item.menu_item_name}` }] });
        })
    }

    //Main
    //Fix the unchecking all become empty
    onClickCheckbox(id, foodName, foodPrice) {
        const nothingSelectedValue = this.state.nothingSelected;
        var orderNo = Number(this.state.orderCounter, 10);
        var mainO = [{ OrderNum: orderNo, MainId: id, mlabel: foodName, mprice: foodPrice, type: "main" }];
        var sideO = this.state.selectedSideDish;
        var checkCart = this.state.selectedItems;
        var currentCartItems = this.state.currentCart;
        var priceCalculate = Number(this.state.totalPriceCal, 10);
        if (nothingSelectedValue) {
            document.getElementById("totalAlert").style["display"] = "none";
        }
        const checked = this.state.mainChecked;
        if (!checked) {
            if (currentCartItems.some(e => e.type == "nomain")) {
                this.setState({ currentCart: this.state.currentCart.filter(e => e.type !== "nomain") });
            }
            this.setState({ currentSelection: [...this.state.currentSelection, { OrderNum: orderNo, MainId: id, mlabel: foodName, mprice: foodPrice, type: "main" }], mainChecked: true, iteminCart: true, totalPriceCal: priceCalculate + Number(foodPrice, 10) });
            var current = [...mainO, ...sideO];
            this.setState({ currentCart: current });
            document.getElementById("alertBox").style["display"] = "none";
        } else {
            const item = this.state.currentSelection;
            if (item.some(e => e.mlabel === foodName)) {
                this.setState({ currentSelection: [], currentCart: [], selectedSideDish: [], mainChecked: false, totalPriceCal: 0 });
                if (checkCart.length > 0) {
                    this.setState({ iteminCart: true });
                } else {
                    this.setState({ iteminCart: false });
                }
                this.uncheckSideDish();
            } else {
                var x = document.getElementById(id);
                x.checked = false;
                document.getElementById("alertBox").style["display"] = "block";
            }

        }
    }

    uncheckSideDish() {
        var sideDish = this.state.selectedSideDish;
        for (var i = 0; i < sideDish.length; i++) {
            if (sideDish[i].type == "side") {
                document.getElementById(sideDish[i].SideId).checked = false;
            }
        }
    }

    //side
    onClickSideDishCheckbox(id, foodName, foodPrice) {
        const selectedSide = this.state.selectedSideDish;
        const mainSelected = this.state.currentSelection;
        var priceCalculate = Number(this.state.totalPriceCal, 10);
        var checker = this.state.checkOnce;
        var orderNo = Number(this.state.orderCounter, 10);
        if (mainSelected.length == 0 && !checker) {
            var pushEmpty = this.state.selectedSideDish.push({ OrderNum: orderNo, MainId: 0, label: "No main selected", nmprice: 0, type: "nomain" })
            this.setState({ selectedSideDish: pushEmpty, checkOnce: true, totalPriceCal: priceCalculate + 0 });
        }
        if (selectedSide.length == 0) {
            this.setState({ selectedSideDish: [...this.state.selectedSideDish, { OrderNum: orderNo, SideId: id, slabel: foodName, sprice: foodPrice, type: "side" }], iteminCart: true, sideChecked: true, totalPriceCal: priceCalculate + Number(foodPrice, 10) });
            var sideO = selectedSide.concat({ OrderNum: orderNo, SideId: id, slabel: foodName, sprice: foodPrice, type: "side" });
            var current = [...mainSelected, ...sideO];
            this.setState({ currentCart: current });
        } else {
            if (selectedSide.some(e => e.slabel === foodName)) {
                this.setState({ selectedSideDish: this.state.selectedSideDish.filter(item => item.slabel !== foodName), currentCart: this.state.currentCart.filter(item => item.slabel !== foodName), totalPriceCal: priceCalculate - Number(foodPrice, 10) });
            } else {
                this.setState({ selectedSideDish: [...this.state.selectedSideDish, { OrderNum: orderNo, SideId: id, slabel: foodName, sprice: foodPrice, type: "side" }], iteminCart: true, sideChecked: true, totalPriceCal: priceCalculate + Number(foodPrice, 10) });
                var sideO = selectedSide.concat({ OrderNum: orderNo, SideId: id, slabel: foodName, sprice: foodPrice, type: "side" });
                var current = [...mainSelected, ...sideO];
                this.setState({ currentCart: current });
            }
        }
    }


    //Additional checkbox click
    onClickAdditionalCheckbox(id, option, price) {
        var currentCartSel = this.state.currentCart;
        var selOptions = this.state.selectedAdditionalOptions;
        var orderNo = Number(this.state.orderCounter, 10);
        var priceCalculate = Number(this.state.totalPriceCal, 10);
        if (currentCartSel.length == 0) {
            document.getElementById("totalAlert").style["display"] = "block";
            document.getElementById(id).checked = false;
        } else {
            document.getElementById("totalAlert").style["display"] = "none";
            if (selOptions.length == 0) {
                this.setState({ selectedAdditionalOptions: [...this.state.selectedAdditionalOptions, { OrderNum: orderNo, AddId: id, alabel: option, aprice: price, type: "additional" }], totalPriceCal: priceCalculate + Number(price, 10) });
                var addO = selOptions.concat({ OrderNum: orderNo, AddId: id, alabel: option, aprice: price, type: "additional" });
                this.setState({ currentCart: [...this.state.currentCart, { OrderNum: orderNo, AddId: id, alabel: option, aprice: price, type: "additional" }], selectedAdditionalOptions: addO });
            } else {
                if (selOptions.some(e => e.alabel === option)) {
                    this.setState({ selectedAdditionalOptions: this.state.selectedAdditionalOptions.filter(item => item.alabel !== option), currentCart: this.state.currentCart.filter(item => item.alabel !== option) });
                } else {
                    this.setState({ selectedAdditionalOptions: [...this.state.selectedAdditionalOptions, { OrderNum: orderNo, AddId: id, alabel: option, aprice: price, type: "additional" }], totalPriceCal: priceCalculate + Number(price, 10) });
                    var addO = selOptions.concat({ OrderNum: orderNo, AddId: id, alabel: option, aprice: price, type: "additional" });
                    this.setState({ currentCart: [...this.state.currentCart, { OrderNum: orderNo, AddId: id, alabel: option, aprice: price, type: "additional" }], selectedAdditionalOptions: addO });
                }
            }
        }
    }

    revealTable() {
        this.setState({ tableHidden: "block" })
    }

    onSubmit() {
        confirmAlert({
            title: 'Are you done with your current order?',
            message: 'Click Yes to move to next order or No if you wish to change your current order!',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.saveStorage()
                },
                {
                    label: "No"
                }
            ]
        });
    }

    saveStorage() {
        if(this.state.currentCart.length == 0 && this.state.selectedItems.length == 0){
            document.getElementById("totalAlert").style["display"] = "block";
        }else{
            var currentSelected = [{OrderNum: Number(this.state.orderCounter, 10), start: "true"}].concat(this.state.currentCart);
            currentSelected.push({ OrderNum: Number(this.state.orderCounter, 10), completed: 'true' });
            var combined = this.state.selectedItems.concat(currentSelected);
            this.setState({ selectedItems: combined, itemAddedToCart: true });
            var incrementOrderNo = Number(this.state.orderCounter, 10);
            incrementOrderNo = incrementOrderNo + 1;
            this.setState({ orderCounter: incrementOrderNo });
            localStorage.setItem("numOfOrders", incrementOrderNo);
            localStorage.setItem("currentOrders", JSON.stringify(combined));
            localStorage.setItem("iteminCart", this.state.iteminCart);
            localStorage.setItem("itemAddedToCart", this.state.itemAddedToCart);
            console.log(this.state.totalPriceCal);
            window.location.reload(false);
        }
        
    }



    onFinishOrder() {
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

    onCalculate() {
        localStorage.clear();
        var currentItems = this.state.currentCart;
        currentItems.push({ OrderNum: Number(this.state.orderCounter, 10), completed: 'true' });
        var totalItems = this.state.selectedItems;
        var combined = totalItems.concat(currentItems);
        if (combined.length == 0) {
            document.getElementById("totalAlert").style["display"] = "block";
        } else {
            var totalPrice = 0;
            for (var i = 0; i < combined.length; i++) {
                if (combined[i].type == "main") {
                    totalPrice += (Number(combined[i].mprice, 10) * combined[i].mquantity);
                } else if (combined[i].type == "side") {
                    totalPrice += (Number(combined[i].sprice, 10) * combined[i].quantity);
                } else if (combined[i].type == "nomain") {
                    totalPrice += Number(combined[i].nmprice, 10);
                }
            }
            var tP = totalPrice.toFixed(2);
            this.setState({ totalPriceCal: tP });

            //replace key with phone number!
            var objTest = { key: this.state.phoneNo, combined };
            axios.post('/api/richton/saveOrder', objTest)
                .then(res => this.reportError(res.data));

            this.props.history.push({
                pathname: '/payment',
                state: { totalPrice: tP, selectedItems: combined }
            })
        }

    }

    reportError(value) {
        if (value.order == 1) {
            console.log("success");
        } else {
            //Maybe do confirm alert to tell failure saving.
            console.log("fail");
        }
    }

    renderTotalPrice() {
        var totalCalPrice = 0;
        const totalOrder = this.state.selectedItems;
        if (totalOrder.length == 0) {
            return <TotalPrice totalPrice={0} />
        } else {
            for (var i = 0; i < totalOrder.length; i++) {
                if (totalOrder[i].type == "main") {
                    totalCalPrice += (Number(totalOrder[i].mprice, 10) * totalOrder[i].mquantity);
                } else if (totalOrder[i].type == "side") {
                    totalCalPrice += (Number(totalOrder[i].sprice, 10) * totalOrder[i].quantity);
                } else if (totalOrder[i].type == "nomain") {
                    totalCalPrice += Number(totalOrder[i].nmprice, 10);
                }
            }
            return <TotalPrice totalPrice={totalCalPrice.toFixed(2)} />
        }
    }

    OpenPane() {
        this.setState({ isPaneOpen: true });
    }



    render() {
        return (
            <div>
                {this.state.retrieved ? (<div>
                    <h3 onClick={() => { this.revealTable() }}>Menu List</h3>
                    <a id="totalAlert" style={alertStyle}>
                        <Alert display={this.state.alertHidden} color="danger">
                            You did not choose any item!
                                    </Alert >
                    </a>
                    <Accordion defaultActiveKey="0">
                        <Card>
                            <Accordion.Toggle as={Card.Header} eventKey="0">
                                Main food items
                                    </Accordion.Toggle>
                            <a id="alertBox" style={alertStyle}>
                                <Alert display={this.state.alertHidden} color="danger">
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
                                                {this.menuItemList()}
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
                                            {this.sideDishItemList()}
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
                                                <th>Select</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.additionalOptionsList()}
                                        </tbody>
                                    </table>
                                </div></Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                    <div className="form-group">
                        <input type="submit" onClick={() => { this.onSubmit() }} value="Continue ordering!" className="btn btn-warning" />
                        <input type="submit" onClick={() => { this.onFinishOrder() }} value="Checkout order!" className="btn btn-success" />
                    </div>
                    {this.state.iteminCart ? (<div id="floatingActionStyle" style={floatingActionStyleT}>
                        <Container>
                            <Button
                                rotate={true}
                                onClick={() => this.OpenPane()}><FiShoppingCart /></Button>
                        </Container>
                    </div>) : (<div id="floatingActionStyle" style={floatingActionStyleF}>
                        <Container>
                            <Button
                                rotate={true}
                                onClick={() => this.OpenPane()}><FiShoppingCart /></Button>
                        </Container>
                    </div>)}

                    <SlidingPane
                        width='50%'
                        className='some-custom-class'
                        overlayClassName='some-custom-overlay-class'
                        isOpen={this.state.isPaneOpen}
                        title='Your order cart'
                        onRequestClose={() => {
                            // triggered on "<" on left top click or on outside click
                            this.setState({ isPaneOpen: false });
                        }}>
                        <div>
                            <h3 class="p-3 mb-2 bg-secondary text-white">Current selection:</h3>
                            <table>
                                <thead>
                                    <tr>
                                    </tr>
                                    <tr>
                                        <th style={cartStyle}>
                                            Selected items
                                        </th>
                                        <th style={cartStyle2}>
                                            Quantity
                                        </th>
                                        <th>
                                            Price per item
                                        </th>
                                    </tr>
                                </thead>
                                {this.renderCurrentSelectedCart()}

                            </table>
                        </div>
                        <br />
                        {this.state.itemAddedToCart ? (<div>
                            <h3 class="p-3 mb-2 bg-dark text-white">Orders added to cart:</h3>
                                {this.selectedOrderReturnList()}
                            <br />
                            {this.renderTotalPrice()}
                        </div>) : (<div></div>)}
                        <br />

                    </SlidingPane>

                </div>) : (<div class="row h-100 page-container">
                    <div class="col-sm-12 my-auto">
                        <h3>Loading</h3>
                        <Spinner class="" animation="grow" />
                    </div>
                </div>)}
            </div>

        )
    }
}