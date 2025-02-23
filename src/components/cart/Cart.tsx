import { Component } from "react";
import { RootState } from "../../redux/store";
import { connect } from "react-redux";
import { removeFromCart, increaseQty, decreaseQty, clearCart } from "../../redux/slices/cartSlice";
import { placeOrder } from '../../redux/slices/productSlice'
import Button from "../button/Button";
import CartITem from "./CartITem";
import { CartProps } from "../../types/propType";
import "./cart.css";




export class Cart extends Component<CartProps> {
  state = {
    placeOrderLoading: false,
    orderMessage: "",

  };


  handleRemoveFromCart = (uniqueKey: string) => {
    this.props.removeFromCart(uniqueKey);
  };

  handleIncreaseQty = (uniqueKey: string) => {
    this.props.increaseQty(uniqueKey);

  };

  handleDecreaseQty = (uniqueKey: string) => {
    if (this.props.cartItems.length === 1) {
      document.body.classList.remove('no-scroll')
    }
    this.props.decreaseQty(uniqueKey);

  };

  handlePlaceOrder = async () => {
    if (this.props.cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      this.setState({ placeOrderLoading: true });
      await this.props.placeOrder(this.props.cartItems);
      this.setState({ placeOrderLoading: false, orderMessage: "Order successfully placed!" });
      this.props.clearCart();
      localStorage.setItem("cart", JSON.stringify({ totalItemCount: 0, items: [], totalPrice: 0 }));
      document.body.classList.remove('no-scroll');

    } catch (error) {
      this.setState({ placeOrderLoading: false });
    }
  };

  render() {
    const { cartItems, totalItemCount, totalPrice } = this.props;

    return (
      <>
        <div className="cart-container">
          <div className="cart-header">
            My Bag, <span className="total-items">{totalItemCount} items</span>
          </div>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <div className="cart-items_wrapper">
                {cartItems.map((item) => (
                  <CartITem
                    key={item.uniqueKey}
                    {...item}
                    handleIncreaseQty={this.handleIncreaseQty}
                    handleDecreaseQty={this.handleDecreaseQty}
                  />
                ))}
              </div>
              <div className="cart-total" data-testid="cart-total">
                <span>Total</span> <span>{cartItems[0]?.price.currency_symbol} {totalPrice.toFixed(2)}</span>
              </div>

              <Button
                label={this.state.placeOrderLoading ? 'Making Order...' : 'Place Order'}
                width="100%"
                height="43px"
                onClick={this.handlePlaceOrder}
              />
            </>
          )}
        </div>
      </>
    );
  }

}

const mapStateToProps = (state: RootState) => ({
  cartItems: state.cart.items,
  totalItemCount: state.cart.totalItemCount,
  totalPrice: state.cart.totalPrice,
});

export default connect(mapStateToProps, { removeFromCart, increaseQty, decreaseQty, placeOrder, clearCart })(Cart);
