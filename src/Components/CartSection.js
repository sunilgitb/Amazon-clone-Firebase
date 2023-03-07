import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./cart.css";
import { AddToList, RemoveList } from "../action/List";
import { IncreaseQuantity, DecreaseQuantity } from "../action/Cart";
import { RemoveCart } from "../action/Cart";
import save from "../imgs/save.png";
import saved from "../imgs/saved.png";
import Delete from "../imgs/delete.png";
import Empty from "../imgs/cart-empty.png";
import { useSelector, useDispatch } from "react-redux";

function CartSection() {
  const CartItems = useSelector((state) => state.CartItemsAdded.CartItems);
  const ListItems = useSelector((state) => state.ItemsAdded.ListItems);
  const dispatch = useDispatch();
  const [AddedIds, setAddedIds] = useState([]);
  const [SubTotal, setSubTotal] = useState(0);

  useEffect(() => {
    const newSubtotal = CartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setSubTotal(newSubtotal);
  }, [CartItems]);

  // const totalQuantity = CartItems.reduce(
  //   (total, item) => total + item.quantity,
  //   0
  // );

  useEffect(() => {
    // Update the added ids whenever the list items change
    const ids = ListItems.map((item) => item.id);
    setAddedIds(ids);
  }, [ListItems]);

  const isAdded = (itemId) => {
    // Check if the item id is in the added ids
    return AddedIds.includes(itemId);
  };

  const DiscountPrice = (SubTotal * 0.2).toFixed(1);
  const TaxPrice = (SubTotal * 0.05).toFixed(1);

  return (
    <>
      <Navbar />
      <div className="entire-section">
        <p style={{ margin: 0 }} className="cart-head">
          Your Cart
        </p>
        <div
          style={
            CartItems && CartItems.length === 0
              ? { height: "40vh" }
              : { height: "100%" }
          }
          className="cart-section"
        >
          <div className="cart-details">
            <div
              style={
                CartItems && CartItems.length === 0
                  ? { display: "block" }
                  : { display: "none" }
              }
              className="empty-cart"
            >
              <img src={Empty} className="empty-cart-img" />
            </div>
            <div className="cart-item">
              {CartItems.map((item) => {
                return (
                  <div className="cart-data" key={item.id}>
                    <img src={item.image} alt="" className="cart-item-img" />
                    <div className="cart-all-data">
                      <p className="cart-title">{item.title}</p>
                      <div className="cart-price">
                        <p className="cart-discount">
                          ${(item.price * item.quantity).toFixed(1)}
                        </p>
                        <p
                          style={
                            (item && item.category === "men's clothing") ||
                            item.category === "women's clothing"
                              ? { display: "block" }
                              : { display: "none" }
                          }
                          className="cart-size"
                        >
                          Size: {item.size ? item.size : "Not choosen"}
                        </p>
                      </div>
                      <div className="more-buttons">
                        <div className="quantity-section">
                          <button
                            onClick={() => dispatch(IncreaseQuantity(item.id))}
                            className="increase"
                          >
                            +
                          </button>
                          <p className="total-items">{item.quantity}</p>
                          <button
                            onClick={() => dispatch(DecreaseQuantity(item.id))}
                            className="decrease"
                            disabled={
                              item && item.quantity === 1 ? true : false
                            }
                          >
                            -
                          </button>
                        </div>
                        <div className="right-btns">
                          <div
                            onClick={() => {
                              if (!isAdded(item.id)) {
                                dispatch(AddToList(item));
                              } else {
                                dispatch(RemoveList(item.id));
                              }
                            }}
                            className="save-btn"
                          >
                            <img
                              src={isAdded(item.id) ? saved : save}
                              className="save-img"
                            />
                            <p>Save</p>
                          </div>
                          <div
                            onClick={() => dispatch(RemoveCart(item.id))}
                            className="delete-btn"
                          >
                            <img src={Delete} className="delete-img" />
                            <p>Delete</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div
            style={
              CartItems && CartItems.length === 0
                ? { display: "none" }
                : { display: "block" }
            }
            className="checkout-section"
          >
            <div className="congrats">
              <p>
                Congrats! You're eligible for <b>Free Delivery</b>.
              </p>
            </div>
            <hr className="horizontal" />
            <div className="promocode">
              <input type="text" placeholder="Promocode" />
              <button className="promocode-btn">Apply</button>
            </div>
            <hr className="horizontal" />

            <div className="money-data">
              <div className="money-1">
                <p className="total">Sub-Total</p>
                <p className="total-price">${SubTotal.toFixed(1)}</p>
              </div>
              <div className="money-2">
                <p className="item-discount">Discount</p>
                <p className="item-discount2">(20%) - ${DiscountPrice}</p>
              </div>
              <div className="money-3">
                <p className="item-delivery">Delivery</p>
                <p className="item-delivery2">$0.00</p>
              </div>
              <div className="money-4">
                <p className="item-tax">Tax</p>
                <p className="item-tax2">(5%) + ${TaxPrice}</p>
              </div>
            </div>
            <hr className="horizontal" />
            <div className="money-5">
              <p className="total">Total</p>
              <p className="total-price">
                ${(parseInt(SubTotal) - parseInt(DiscountPrice) + parseInt(TaxPrice)).toFixed(1)}
              </p>
            </div>
            <div className="payment-btn">
              <button className="payment">Proceed to Payment</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CartSection;