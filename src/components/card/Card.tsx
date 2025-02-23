import { Component } from 'react';
import { BsCart } from "react-icons/bs";
import { kebabCase } from 'lodash';
import { Link } from 'react-router-dom';
import Button from '../button/Button';
import { CardPropsType } from '../../types/propType';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { addToCart } from '../../redux/slices/cartSlice';
import { handleAddToCart } from '../../utils/cartUtils';
import { CartItemType, SelectedAttributesType } from '../../types/cartType';
import { setPlaceOrder } from '../../redux/slices/productSlice';
import './Card.css';

interface ReduxProps {
    addToCart: (item: CartItemType) => void;
    setPlaceOrder: (status: boolean) => void;
    cartItems: CartItemType[];
}

type Props = CardPropsType & ReduxProps;

export class Card extends Component<Props> {
    handleAddToCartClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        const { addToCart, cartItems, id, name, imageUrl, price, in_stock, attributes, setPlaceOrder } = this.props;

        // If the product is out of stock, don't proceed
        if (!in_stock) return;

        let selectedAttributes: SelectedAttributesType = {};
        attributes?.forEach((attr) => {
            if (attr.values?.length) {
                selectedAttributes[attr.name] = { id: attr.id, value: attr.values[0].value };
            }
        });

        const product = {
            id,
            name,
            gallery: [imageUrl],
            price,
            in_stock,
            attributes
        };

        handleAddToCart(product, selectedAttributes, cartItems, addToCart);
        setPlaceOrder(false);
    };

    render() {
        const { id, imageUrl, name, price, in_stock } = this.props;
        const kebabCaseName = kebabCase(name);

        return (
            <Link to={`/product/${id}`} className={`card ${!in_stock ? 'out-of-stock' : ''}`} data-testid={`product-${kebabCaseName}`} >
                <div className="card--image" style={{ backgroundImage: `url(${imageUrl})` }}>
                    {!in_stock && <div className="out-of-stock-message">OUT OF STOCK</div>}
                    {in_stock && (
                        <Button
                            icon={<BsCart style={{ fontSize: '24px' }} />}
                            onClick={this.handleAddToCartClick}
                            circular={true}
                            backgroundColor="#5ECE7B"
                            textColor="#fff"
                            position="absolute"
                            top="304px"
                            left="287px"
                            boxShadow="0px 4px 11px rgba(0, 0, 0, 0.15)"
                            hoverEffect={true}
                        />
                    )}
                </div>
                <div className="card--header">
                    <span className="product--name">{name}</span>
                    <span className="product--price">{price.currency_symbol} {price.amount}</span>
                </div>
            </Link>
        )
    }
}

const mapStateToProps = (state: RootState) => ({
    cartItems: state.cart.items,
});

export default connect(mapStateToProps, { addToCart, setPlaceOrder })(Card);
