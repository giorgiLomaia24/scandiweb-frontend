import { Component } from 'react';
import { CartItemType } from '../../types/cartType';
import Attribute from '../attribute/Attribute';
import { CartItemProps } from '../../types/propType';

export class CartItem extends Component<CartItemType & CartItemProps> {
    render() {
        const { productImage, qty, price, name, uniqueKey, attributes, handleIncreaseQty, handleDecreaseQty } = this.props;
        return (
            <div key={uniqueKey} className="cart-item">
                <div className="cart-item_left">
                    <div className="left-content_wrapper">
                        <div className="item-details">
                            <div className="item-title">{name}</div>
                            <div className="item-price">
                                {price.currency_symbol}
                                {price.amount}
                            </div>
                            {attributes?.length ? (
                                <Attribute
                                    isPDP={false}
                                    isSmall={true}
                                    attributes={attributes}
                                    selectedAttributes={attributes.reduce((acc: Record<string, { id: number; value: string }>, attr) => {
                                        const selectedValue = attr.values?.find((val) => val.selected);
                                        if (selectedValue) {
                                            acc[attr.name] = { id: Number(attr.id), value: selectedValue.value };
                                        }
                                        return acc;
                                    }, {})}
                                />
                            ) : null}

                        </div>
                    </div>
                    <div className="item-qty">
                        <button className="increase-btn" data-testid="cart-item-amount-increase" onClick={() => handleIncreaseQty(uniqueKey)}>+</button>
                        <div className="item-count" data-testid="cart-item-amount">{qty}</div>
                        <button className="decrease-btn" data-testid="cart-item-amount-decrease" onClick={() => handleDecreaseQty(uniqueKey)}>-</button>
                    </div>
                </div>
                <div className="cart-item_right" style={{ backgroundImage: `url(${productImage})` }}></div>
            </div>
        );
    }
}

export default CartItem;

