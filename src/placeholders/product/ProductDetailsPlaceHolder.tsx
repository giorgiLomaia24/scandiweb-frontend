import { Component } from 'react';
import './productDetailsPlaceholder.css';

export class ProductDetailsPlaceHolder extends Component {
    render() {
        return (
            <div className="placeholder-product--details-wrapper">           
                <div className="placeholder-product--details">               
                    <div className="placeholder-product--image"></div>               
                    <div className="placeholder-content">                   
                        <div className="placeholder-text placeholder-name"></div>           
                        <div className="placeholder-text placeholder-attribute"></div>
                        <div className="placeholder-text placeholder-attribute"></div>                   
                        <div className="placeholder-price">
                            <div className="placeholder-text placeholder-price-label"></div>
                            <div className="placeholder-text placeholder-price-value"></div>
                        </div>               
                        <div className="placeholder-button"></div>                 
                        <div className="placeholder-text placeholder-description"></div>
                    </div>
                </div>
            </div>

        )
    }
}

export default ProductDetailsPlaceHolder
