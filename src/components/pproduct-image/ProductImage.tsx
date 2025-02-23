import { Component } from 'react'

interface ProductImageProps {
  activeIndex: number;
  images: string[];
  handlePrev: () => void;
  handleNext: () => void;
}


export class ProductImage extends Component<ProductImageProps> {
  render() {
    return (
      <div className="product--image" style={{ backgroundImage: this.props.images[this.props.activeIndex] ? `url(${this.props.images[this.props.activeIndex]})` : "none" }}>
        <button className='arrow-left' onClick={this.props.handlePrev}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" fill="black" fillOpacity="0.73" />
            <path d="M20 8 L12 16 L20 24" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button className='arrow-right' onClick={this.props.handleNext}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" fill="black" fillOpacity="0.73" />
            <path d="M12 8 L20 16 L12 24" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>


      </div>
    )
  }
}

export default ProductImage
